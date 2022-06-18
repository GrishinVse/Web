const express = require('express');
const MongoClient = require("mongodb").MongoClient;
const { post } = require('request');
const app = express();
const port = 8085;
var server = require('http').createServer(app);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.static('public'));

app.get('/server', function(req, res) {
    res.sendFile('D:/ВУЗ/6_Семестр/Технологии разработки web приложений/Экзамен/index.html')
})

app.post('/server', function(req, res) {
    const url = "mongodb://localhost:3000/";
    const client = new MongoClient(url);

    let searchEmail = req.body.login;
    let clientInfoSearch = "";
    let status = "";

    client.connect(function(err, client) {
        const db = client.db('clients');
        const collection = db.collection('info');

        collection.findOne({ "login": searchEmail }, { _id: 0 }, function(err, result) {
            if (err) throw err;
            clientInfoSearch = JSON.stringify(result)
            console.log(clientInfoSearch != 'null');

            let answer_text = ''

            if (clientInfoSearch != 'null') {
                status = "success"
                answer_text = "Данная запись уже есть в системе"
            } else {
                status = "fail"
                answer_text = "Такой записи нет. Добавляю."
            }
            console.log(status);
            client.close();

            if (status == "fail") {
                client.connect(function(err, client) {
                    const db = client.db('clients');
                    const collection = db.collection('info');
                    let clientInformation = req.body;
                    collection.insertOne(clientInformation, function(err_2, result_2) {
                        if (err_2) {
                            return console.log(err_2);
                        }
                        console.log(clientInformation);
                        client.close();
                    });
                });
            }

            res.send(`<form>
                <label>Ответ от сервера:</label>
                <p></p>
                <p>${status} -> ${answer_text}</p>
            </form>`)
        })
    });
})

server.listen(port, function() {
    console.log(`Listening on : ${port}`);
})