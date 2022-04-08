const express = require('express');
const axios = require('axios')
const app = express()
const port = 3000;
const server = require('http').createServer(app)

app.use(
    express.urlencoded({
        extended: true
    }),
);

app.get('/', (req, res) => {
    res.sendFile('D:/ВУЗ/6_Семестр/Технологии разработки web приложений/Lab_3/index.html')
})

app.get('/get/:val', (req, res) => {
    // Проверка на загруженные курсы
    let options = {
        method: 'get',
        uri: 'https://www.cbr-xml-daily.ru/daily_json.js',
        json: true
    }

    let val = req.params.val
    let response = null;
    new Promise(async(resolve, reject) => {
        try {
            response = await axios("https://www.cbr-xml-daily.ru/daily_json.js")
        } catch (er) {
            response = null;
            reject(er);
        }
        if (response) {
            let json = response.data;
            let value = json['Valute'][val]['Value']
            console.log(value);
            resolve(json);
            res.send({ 'value': value });
        }
    });
});

server.listen(port, function() {
    console.log(`Listening on port ${port}`)
});