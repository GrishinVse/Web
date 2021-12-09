/// <reference path="../typings/globals/jquery/index.d.ts" />
let res_table = $("#resTbl").DataTable({"searching": false , "lengthChange": false, "iDisplayLength" : 25});

data_id = 916
api_key = '897c6a1118f1af1f6cf53f680398256f'
api_url = `https://apidata.mos.ru/v1/datasets/${data_id}/rows?api_key=${api_key}`

console.log(api_url)

function getFromApi() {
    alert("Загрузка данных началась!")
    $.getJSON(api_url, function(data) {
        DataFromJSON(data)
    });
}

function DataFromJSON(data) {
    key_names = 'global_id|Address|Capacity'
    let coordinates_list = []
    let districts = new Map();
    let capacity_values = new Map();
    for (let el = 0; el < data.length; el++) {
        console.log(el)
        let parsed = data[el]["Cells"]
        let keys = Object.keys(parsed);
        let vals = []
        for (let i = 0; i < keys.length; i++) {
            if (key_names.includes(keys[i])){
                console.log("Value = "+ parsed[keys[i]])
                vals.push(parsed[keys[i]]);
            } else {
                if ('geoData'.includes(keys[i])) {
                console.log("Value = "+ parsed[keys[i]]["coordinates"])
                coordinates_list.push(parsed[keys[i]]["coordinates"])
                vals.push(parsed[keys[i]]["coordinates"]);
                }
                if ('District'.includes(keys[i])) {
                    let district = parsed[keys[i]]
                    console.log("District Value = "+ district)
                    if (districts.has(district)) {
                        let districtCounts = districts.get(district)
                        districts.set(district, districtCounts+1)
                        
                        let capacitySum = capacity_values.get(district)
                        capacity_values.set(district, capacitySum + parsed["Capacity"])
                    } else {
                        districts.set(district, 1)
                        capacity_values.set(district, 0)
                    }
                }
            }
        }
        vals.push("<button class='delete_button' onclick='delRow(this)'></button>")
        res_table.row.add(vals).draw(false);
    }
    alert("Загрузка данных закончилась")
    localStorage.setItem('districts', JSON.stringify(Array.from(districts.entries())));
    localStorage.setItem('capacity_values', JSON.stringify(Array.from(capacity_values.entries())));
    localStorage.setItem('coordinates_list', JSON.stringify(coordinates_list));
    let json_file = tableToJson()
    localStorage.setItem('myStorage', JSON.stringify(json_file));
}

function tableToJson() {
    let table = document.getElementById('resTbl')
    let headers = [];
    for (let i = 0; i < table.rows[0].cells.length - 1; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '_');
    }
    let data = [];
    for (let i = 1; i < table.rows.length; i++) {
        let line = {};
        for (let j = 0; j < table.rows[i].cells.length - 1; j++) {
            line[headers[j]] = table.rows[i].cells[j].innerHTML;
        }
        data.push(line);
    }
    console.log(JSON.stringify(data));
    return JSON.stringify(data)
}

// Возвращает из файла по нажатию на кнопку
function getFromFile() {
    let json_table = JSON.parse(localStorage.getItem('myStorage'));
    tableFromJson(json_table)
}

function tableFromJson(line) {
    console.log(res_table.data().length)
    while (res_table.data().length > 0) {
        res_table.row(0).remove().draw(false);
    }
    let parsed = JSON.parse(line)
    console.log("tableFromJson : " + parsed)
    for (let i = 0; i < parsed.length; i++) {
        let vals = []
        for (let key in parsed[i]) {
            vals.push(parsed[i][key]);
        }
        vals.push("<button class='delete_button' onclick='delRow(this)'></button>")
        res_table.row.add(vals).draw(false);
    }
}

function getStat() {
    let stat_table = $("#statTbl").DataTable();
    let districts = new Map(JSON.parse(localStorage.getItem('districts')));
    console.log(stat_table)
    for (let key of districts.keys()) {
        let district_vals = []
        district_vals.push(key)
        district_vals.push(districts.get(key))
        console.log(district_vals)
        
        stat_table.row.add(district_vals).draw(false);
    }
}

function drawHorizChart(){

    let districts = new Map(JSON.parse(localStorage.getItem('districts')));
    
    let capacity_values = new Map(JSON.parse(localStorage.getItem('capacity_values')))
    console.log("CAPACITY = ", capacity_values)

    let min_val = document.getElementById('min_num_canvas').value;
    console.log("MIN VAL = ",min_val)

    let lotsData = []
    let curr_labels = []
    for (let key of districts.keys()){
        let label_value = key
        let y_value = districts.get(key)
        if (min_val <= y_value){
            console.log(y_value)
            curr_labels.push(label_value)
            let record = {y: y_value, label: label_value};
            lotsData.push(record)
        }
    }
    
    console.log("********************************************")

    let capacityData = []
    for (let key of curr_labels){
        let y_value = capacity_values.get(key)
        let record = {y: y_value, label: key};
        capacityData.push(record)
    }

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        
        title:{
            text:"Статистика по районам"
        },
        axisX:{
            interval: 100,
            labelFormatter: function(){
                return " ";
              }
        },
        axisY2:{
            interlacedColor: "rgba(1,77,101,.2)",
            gridColor: "rgba(1,77,101,.1)",
            title: "Районы",
        },
        data: [{
            type: "bar",
            legendText: "Кол-во парковок",
            showInLegend: true,
            axisYType: "secondary",
            color: "#014D65",
            dataPoints: lotsData
        }, {
            type: "bar",
            legendText: "Кол-во мест",
            showInLegend: true,
            axisYType: "secondary",
            color: "#11b4d9",
            dataPoints: capacityData
        }]
    });    
    chart.render();
}

function drawHorizChartZing(){
    let districts = new Map(JSON.parse(localStorage.getItem('districts')));
    let min_val = document.getElementById('min_num_zing').value;
    console.log("MIN VAL = ",min_val)

    let capacity_values = new Map(JSON.parse(localStorage.getItem('capacity_values')))
    console.log("CAPACITY = ", capacity_values)

    let chartData = []
    let label_list = []
    let value_list = []

    for (let key of districts.keys()){
        let label_value = key
        let y_value = districts.get(key)
        if (min_val <= y_value){
            //console.log(y_value)
            label_list.push(label_value)
            value_list.push(y_value)
        }
    }
    chartData.push({values: value_list})

    let capacity_list = []
    for (let key of label_list){
        console.log("SELECTED AREAS = ",key)
        console.log("AREA CAPACITY = ",capacity_values.get(key))
        capacity_list.push(capacity_values.get(key))
    }
    chartData.push({values: capacity_list})

    console.log(chartData)

    ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "b55b025e438fa8a98e32482b5f768ff5"];
    var myConfig = {
        type: "hbar",
        plotarea: {
            'adjust-layout': true
          },
        'scale-x': {
            labels: label_list
        },
        series: chartData
    };
 
    zingchart.render({
      id: 'myChart',
      data: myConfig,
      height: '100%',
      width: '100%'
    });
}

function delRow(value) {
    $('#resTbl').DataTable().row(value.parentElement.parentElement.rowIndex - 1).remove().draw(false);
}