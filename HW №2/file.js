const user_form = document.querySelector("form[name=user_form]");
const main_form = document.querySelector("form[name=main_form]");
const body = document.querySelector("body");
const style = document.querySelector("style[name=page_style]");

body.onkeypress = executeJS;

function generateForm(form_quantity, form_name) {
    result = '<h1>Новая форма | имя = ' + form_name + '</h1><form class="colorform">'
    for (let i = 0; i < form_quantity; i++) {
        result += '<p><input type="button" value="button_' + i +'"></p>'
    }
    result += '</form>'
    console.log(result)
    return result
}

function executeJS() {
    console.log("Pressed");

    document.addEventListener('keyup', function(event) {
        if (event.key === 'Enter' & event.keyCode === 13) {
            var form_quantity = main_form.querySelector("input[name=form_quantity]").value;
            var form_name = main_form.querySelector("input[name=form_name]").value;
            var form_color = main_form.querySelector("input[name=form_color]").value;

            console.log(form_quantity, form_name, form_color);
            
            user_form.innerHTML = generateForm(form_quantity, form_name);
            style.innerHTML = 'form[name="user_form"] {background-color: ' + form_color + ';}'
        }
    });   
}