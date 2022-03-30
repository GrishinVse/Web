const express = require('express');
const MongoClient = require("mongodb").MongoClient;
const { futimesSync } = require('fs');
const { post } = require('request');
const app = express();
const port = 4000;
var server = require('http').createServer(app);
const path = require('path');

const https = require('https')
const url = "https://www.cbr-xml-daily.ru/daily_json.js";

app.use(
    express.urlencoded({
        extended: true
    }),
);

app.use(express.static('public'));

// http://localhost:4000/valute_rate
app.get('/valute_rate', function(req, res) {
    res.sendFile('D:/_ВУЗ/6 Семестр/Технологии разработки web приложений/Lab_2/public/courses.html')
})

server.listen(port, function() {
    console.log(`Listening on : ${port}`);
})

/*
Проверка есть такие данные в БД или нет:
    Если нет то добавляем
    Если есть то не добавляем 
        
Из бд забираем нужную валюту на сегодняшний день
*/

app.post('/valute_rate', async function(req, res) {
    try {
        // База данных тут
        const db_port = 4001
        const mongo_url = `mongodb://localhost:${db_port}/`;
        const mongo_client = new MongoClient(mongo_url);

        // Текущая дата как в формате MongoDB
        let current_date = new Date().toISOString().split('T')[0];
        console.log("Текущая дата = ", current_date);

        function getDataDB(current_date, callBack) {
            mongo_client.connect(async function(err, valutes_info) {
                const db = valutes_info.db('valutes');
                const collection = db.collection('info');

                collection.find({ "Date": { $regex: current_date, $options: "$i" } }).toArray(function(err, result) {
                    if (err) throw err;
                    if (result.length != 0) {
                        return callBack(result);
                    } else {
                        return callBack(false);
                    }
                });
            })
        }

        // Выбранная валюта
        let sel_valute = req.body.SelectedValute;
        console.log("Selected Valute = ", sel_valute);

        // Дописать вывод в виде HTML
        function printDataHTML(res) {
            if (sel_valute in res.Valute) {
                let info = res.Valute[sel_valute];
                let html = `<!DOCTYPE html><html><head><h1>Info about ${sel_valute} | Date: ${current_date}</h1></head><body><div>`
                for (el in info) {
                    html += `<p>${el} : ${info[el]}</p>`
                }
                html += "</div></body></html>"
                console.log(info);
                return html
            } else {
                return "NONE"
            }
        }

        // "2021-03-29"
        var dataDB = getDataDB(current_date, function(result) {
            // false - записи нет в БД | true - запись есть
            if (result) {
                console.log("Запись в БД есть");
                res.send(printDataHTML(result[0]))
            } else {
                console.log("Записи в БД НЕТ")

                // Забираем JSON с сервера
                https.get(url, resp => {
                    let json_info = "";

                    resp.on('data', d => {
                        json_info += d;
                    })

                    resp.on('end', () => {
                        json_info = JSON.parse(json_info);
                        console.log("DATE =", json_info.Date.split('T')[0]);

                        // Добавляем новую запись
                        mongo_client.connect(function(err, valutes_info) {
                            const db = valutes_info.db('valutes');
                            const collection = db.collection('info');

                            collection.insertOne(json_info, function(err, result) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log(result);
                                valutes_info.close();
                            });
                        });

                        res.send(printDataHTML(json_info))
                    });
                }).on('error', err => {
                    console.log(err.message);
                })
            }
        })

    } catch (e) {
        res.send(e.message || e.toString());
    }
})

/*Запуск БД .\mongod --port=4001 --dbpath="D:\_ВУЗ\6 Семестр\Технологии разработки web приложений\Lab_2\data" */