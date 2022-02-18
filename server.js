var express  = require('express');
var app = express();

app.get('/', function(req, res) {
    res.sendFile("D:/_ВУЗ/6 Семестр/Технологии разработки web приложений/index.html");
});

app.listen(8089);

console.log('Сервер стартовал');
//185.6.166.242 внешний IP