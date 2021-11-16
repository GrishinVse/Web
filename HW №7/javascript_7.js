/// <reference path="../typings/globals/jquery/index.d.ts" />
let res_table = $("#resTbl").DataTable({"searching": false , "lengthChange": false});

function delRow(value) {
    $('#resTbl').DataTable().row(value.parentElement.parentElement.rowIndex - 1).remove().draw(false);
}

function parseDataFromJSON(line) {
    key_names = 'ID|Name|Address|Capacity'

    console.log(res_table.data().length)
    while (res_table.data().length > 0) {
        res_table.row(0).remove().draw(false);
    }
    let parsed = JSON.parse(line)
    console.log("parseDataFromJSON : " + parsed)
    for (let i = 0; i < parsed.length; i++) {
        console.log(i, parsed[i])
        let vals = []
        for (let key in parsed[i]) {
            if (key_names.includes(key)){
                console.log(parsed[i][key]);
                vals.push(parsed[i][key]);
            }
        }
        console.log(vals)   
        vals.push("<button class='delete_button' onclick='delRow(this)'></button>")
        res_table.row.add(vals).draw(false);
    }
}

function getFromServer() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:81/hw_7_final/data_server.php',
        dataType: 'json',
        data: { flag: 1 },
        success: function (ans) {
            parseDataFromJSON(ans);
        }
    });
}