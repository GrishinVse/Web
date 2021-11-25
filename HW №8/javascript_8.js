/// <reference path="../typings/globals/jquery/index.d.ts" />
let res_table = $("#resTbl").DataTable({"searching": false , "lengthChange": false, "iDisplayLength" : 100});

data_id = 916 // dataset id
api_key = 'dskfsjf' // your key
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
    for (let el = 0; el < data.length; el++) {
        let parsed = data[el]["Cells"]
        let keys = Object.keys(parsed);
        let vals = []
        for (let i = 0; i < keys.length; i++) {
            if (key_names.includes(keys[i])){
                /*
                console.log("Key = " + keys[i])
                */
                console.log("Value = "+ parsed[keys[i]])
                
                vals.push(parsed[keys[i]]);
            } else {
                if ('geoData'.includes(keys[i])) {
                /*
                console.log("Key = " + keys[i])
                */
                console.log("Value = "+ parsed[keys[i]]["coordinates"])
                
                vals.push(parsed[keys[i]]["coordinates"]);
                }
            }
        }
        vals.push("<button class='delete_button' onclick='delRow(this)'></button>")
        res_table.row.add(vals).draw(false);
    }
    alert("Загрузка данных закончилась")
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


/*
example_data = [{"global_id":2757725,"Number":1,"Cells":{"Name":"Велосипедная парковка № 37124 «Гимназия № 1506»","global_id":2757725,"Photo":"4b2327b3-55af-4ff1-ab55-786c1d199557","AdmArea":"Северо-Восточный административный округ","District":"район Северное Медведково","DepartmentalAffiliation":"Департамент транспорта и развития дорожно-транспортной инфраструктуры города Москвы","Address":"Широкая улица, дом 1А","Capacity":10,"ObjectOperOrgName":"ГКУ Центр организации дорожного движения Правительства Москвы","ObjectOperOrgPhone":[{"OperationOrganizationPhone":"(495) 361-78-07"}],"geoData":{"coordinates":[37.650781,55.889628],"type":"Point"}}}]

DataFromJSON(example_data)
*/

function delRow(value) {
    $('#resTbl').DataTable().row(value.parentElement.parentElement.rowIndex - 1).remove().draw(false);
}