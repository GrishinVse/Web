let GetButton = document.getElementById('GetButton');
let SelectedValute = document.getElementById('SelectedValute');
let CourseValue = document.getElementById('CourseValue');

GetButton.onclick = function() {
    $.getJSON('https://www.cbr-xml-daily.ru/daily_json.js', function(data) {

        console.log("Selected Valute = ", SelectedValute.value);

        if (SelectedValute.value in data.Valute) {
            let info = data.Valute[SelectedValute.value];
            console.log("Valute Info = ", info)
            CourseValue.value = info["Value"]
        }
    });
}