/// <reference path="../typings/globals/jquery/index.d.ts" />
let res_table = $("#resTbl").DataTable({"searching": false , "lengthChange": false});

function addRow(name, email, orderId, date) {
    let formData = [name, email, orderId, date];
    

    //let del_val = "$('#resTbl').DataTable().row(this.parentElement.parentElement.rowIndex-1).remove().draw(false)"
    formData.push("<button class='delete_button' onclick='delRow(this)'></button>")
    console.log(formData)


    let addedRow = res_table.row.add(formData).draw();
    sendToServer()
}

function delRow(value) {
    $('#resTbl').DataTable().row(value.parentElement.parentElement.rowIndex - 1).remove().draw(false);
    sendToServer();
}

function executeJS(event) {
    event.preventDefault();

    let gen_form = document.querySelector("form[id=generated_form]");

    let user_name = document.getElementsByName("name")[0].value;
    let user_email = document.getElementsByName("email")[0].value;
    let user_orderId = document.getElementsByName("order_id")[0].value;
    let user_deliveryDate = document.getElementsByName("delivery_date")[0].value;
    let user_deliveryRate = document.getElementsByName("delivery_rate")[0].value;

    let user_recommend = 'None';
    if (document.getElementById("s_yes").checked) {
        user_recommend = "Yes"
    }
    if (document.getElementById("s_no").checked) {
        user_recommend = "No"
    }

    let user_comment = document.getElementsByName("comment_area")[0].value;                

    gen_form.innerHTML = "<h2>Completed Form<h2><h3>" + 
                 "User Name: " + user_name + 
                 "<br>User Email: " + user_email +  
                 "<br>User Order ID: " + user_orderId + 
                 "<br>Delivery Date: " + user_deliveryDate + 
                 "<br>Delivery Rate: " + user_deliveryRate + 
                 "<br>Would user recommend: " + user_recommend + 
                 "<br>User Comment: " + user_comment + "</h3>"
    
    let form_json = {
     user_name,
     user_email,
     user_orderId,
     user_deliveryDate,
     user_deliveryRate,
     user_recommend,
     user_comment
    }
    //console.log(form_json)

    addRow(user_name, user_email, user_orderId, user_deliveryDate)
}

function fsave(){
    user_name = document.getElementsByName("name")[0].value;
    user_email = document.getElementsByName("email")[0].value;
    user_orderId = document.getElementsByName("order_id")[0].value;
    user_deliveryDate = document.getElementsByName("delivery_date")[0].value;
    user_deliveryRate = document.getElementsByName("delivery_rate")[0].value;

    user_recommend = 'None';
    if (document.getElementById("s_yes").checked) {
        user_recommend = "Yes"
    }
    if (document.getElementById("s_no").checked) {
        user_recommend = "No"
    }

    user_comment = document.getElementsByName("comment_area")[0].value;

    localStorage.setItem('user_name', user_name);
    localStorage.setItem('user_email', user_email);
    localStorage.setItem('user_orderId', user_orderId);
    localStorage.setItem('user_deliveryDate', user_deliveryDate);
    localStorage.setItem('user_deliveryRate', user_deliveryRate);
    localStorage.setItem('user_recommend', user_recommend);
    localStorage.setItem('user_comment', user_comment);

    alert("You have saved data to local store!")
}

function fload(){
    user_name = localStorage.getItem('user_name');
    user_email = localStorage.getItem('user_email');
    user_orderId = localStorage.getItem('user_orderId');
    user_deliveryDate = localStorage.getItem('user_deliveryDate');
    user_deliveryRate = localStorage.getItem('user_deliveryRate');
    user_recommend = localStorage.getItem('user_recommend');
    user_comment = localStorage.getItem('user_comment');
    
    document.getElementsByName("name")[0].value = user_name;
    document.getElementsByName("email")[0].value = user_email;
    document.getElementsByName("order_id")[0].value = user_orderId;
    document.getElementsByName("delivery_date")[0].value = user_deliveryDate;
    document.getElementsByName("delivery_rate")[0].value = user_deliveryRate;

    if (user_recommend == "Yes") {
        document.getElementById("s_yes").checked = true;
    }
    if (user_recommend == "No") {
        document.getElementById("s_no").checked = true;
    }

    document.getElementsByName("comment_area")[0].value = user_comment;
    alert("You have loaded data from local store!")
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

function sendToServer() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:81/hw_6/server.php',
        dataType: 'json',
        data: { flag: 0, text: tableToJson() },
        /*success: function (ans) {
            console.log("sendToServer : " + ans)
            tableFromJson(ans);
        }*/
    });
}

function getFromServer() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:81/hw_6/server.php',
        dataType: 'json',
        data: { flag: 1 },
        success: function (ans) {
            //alert(ans);
            tableFromJson(ans);
        }
    });
}