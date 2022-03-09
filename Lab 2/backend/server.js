const express = require('express');
const { futimesSync } = require('fs');
const app = express();
const port = 3000;
var server = require('http').createServer(app);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.static('public'));

app.get('/scoring', function(req, res) {
    res.sendFile('D:/_ВУЗ/6 Семестр/Технологии разработки web приложений/Lab 2/public/index.html')
})

function parseJson(json) {
    let score = 0;

    /* Пол */
    if (json.gender = "female") {
        score += 0.4;
    } else {
        score += 0;
    }

    /* Возраст */
    let current = new Date()
    let birth_date = new Date(json.birthDate)
    let age = Math.trunc((current.getTime() - birth_date) / (24 * 3600 * 365.25 * 1000));

    //console.log(age);
    if ((age - 20) * 0.1 <= 0.3) {
        score += (age - 20) * 0.1;
    } else {
        score += 0.3
    }

    /* Срок проживания в местности */
    if (json.periodLife * 0.042 <= 0.42) {
        score += json.periodLife * 0.042;
    } else {
        score += 0.42;
    }

    /* Профессия */
    //console.log("Профессия", json.profession)
    if ("manager_teacher_developer".includes(json.profession)) {
        score += 0.55;
        //console.log("Низкий риск")
    } else if ("policeman_judge_driver_pilot".includes(json.profession)) {
        score += 0;
        //console.log("Высокий риск")
    } else {
        score += 0.16;
        //console.log("Другое")
    }

    /* Финансовые показатели */
    if (json.bankAccount) {
        //console.log("Наличие банковского счета")
        score += 0.45;
    }
    if (json.realEstate) {
        //console.log("Наличие недвижимости")
        score += 0.35;
    }
    if (json.insurancePolicy) {
        //console.log("Наличие страхового полиса")
        score += 0.19;
    }

    /* Работа */
    if (json.sphere = "public") {
        score += 0.21;
    }

    /* Занятость */
    score += json.periodWork * 0.059

    console.log("SCORE = ", score)

    return score;
}

app.post('/scoring', (req, res) => {
    let client_score = parseJson(req.body);
    console.log(client_score)
    if (client_score > 1.25) {
        res.send('Вам одобрен кредит!');
    } else {
        res.send('К сожалению вам отказано в выдаче кредита!');
    }

})

server.listen(port, function() {
    console.log(`Listening on : ${port}`);
})