/// <reference path="../typings/globals/jquery/index.d.ts" />
let res_table = $("#resTbl").DataTable({"searching": false , "lengthChange": false, "iDisplayLength" : 100});

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
                coordinates_list.push(parsed[keys[i]]["coordinates"])
                vals.push(parsed[keys[i]]["coordinates"]);
                }
            }
        }
        vals.push("<button class='delete_button' onclick='delRow(this)'></button>")
        res_table.row.add(vals).draw(false);
    }
    alert("Загрузка данных закончилась")
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

function getCoordinates() {
    var canvas = document.getElementById("dots");
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext("2d");

    let coordinates_list = JSON.parse(localStorage.getItem('coordinates_list'));
    
    dmin0 = 37.15; dmax0=37.93; dd = dmax0-dmin0  // по X
    wmin0 = 55.50; wmax0=55.999; wd = wmax0-wmin0; // по Y
    
    /*
    dmin0 = 37.35; dmax0=37.87; dd = dmax0-dmin0  // по X
    wmin0 = 55.56; wmax0=55.893; wd = wmax0-wmin0; // по Y
    */
    kw = 10000/90;  // км/градус по меридиану 
    wkm = 50 //wd*kw  	// север-юг 42 км 
    kd = kw*Math.cos(((wmax0+wmin0)/2)*Math.PI/180) // км/градус по параллели 
    dkm = 50 //kd*dd     // восток-запад в км  32
    kkm = dkm/wkm   // пропорция прям-ка (<1)
 
    ymax = 540; xmax = Math.round(ymax * kkm);
    ky = ymax/(wmax0-wmin0); kx=xmax/(dmax0-dmin0)
    function kY(w){return -Math.round(ky*(w-wmin0))} // широта
    function kX(d){return Math.round(kx*(d-dmin0))} // долгота

    offset_x = -50;
    offset_y = 500;

    with (ctx) {
        strokeStyle = "#F00";
        for (el in coordinates_list) {
            console.log(`X = ${coordinates_list[el][0]} | Y = ${coordinates_list[el][1]}`);
            x = kX(coordinates_list[el][0]);
            y = kY(coordinates_list[el][1]);
            //console.log(`X = ${x} | Y = ${y}`);
            //console.log(typeof(x), typeof(y))
            beginPath()
                ctx.arc(x+offset_x,y+offset_y, 2, 0, Math.PI*2);
            stroke()
        }
        dx =  Math.round(5*xmax/dkm) // dkm - xmax, 5 - x
		dy =  Math.round(5*ymax/wkm) // dkm - xmax, 5 - x
		strokeStyle = "#000"; // цвет линий
		beginPath()
		for (var i=dx;i<xmax;i+=dx){ // шкала 0x
			moveTo(i,0); lineTo(i,-6); stroke()
		}
		for (var i=dy;i<ymax;i+=dy){ // шкала 0y
			moveTo(0,-i); lineTo(6,-i); stroke()
		}
    }
}

function delRow(value) {
    $('#resTbl').DataTable().row(value.parentElement.parentElement.rowIndex - 1).remove().draw(false);
}