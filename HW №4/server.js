const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

let data = [
{
id: 1,
user_name: 'Seva',
user_email: 'test@mail.ru',
user_orderId: 2,
user_deliveryDate: '22.12.12',
user_deliveryRate: 5,
user_recommend: 'Yes',
user_comment: 'kruto'
}
]

app.get('/data', (req, res) => {
res.json(data).status(200)
})

app.post('/data', (req, res) => {
data.push({id: data.length+1,...req.body})
res.json(data).status(200)
})
app.delete('/data/:id', (req, res) => {
data = data.filter(el=> el.id != req.params.id)
res.json(data).status(200)
})

app.listen(port, () => {
console.log(`Example app listening at http://localhost:3000`)
})

//In Terminal -> nodemon .\server.js