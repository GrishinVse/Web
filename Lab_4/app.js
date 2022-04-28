const express = require('express');
const cheerio = require('cheerio');
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const request = require('request');
const rp = require('request-promise');
const VKBot = require('node-vk-bot-api');
const bodyParser = require('body-parser');

const port = 5000;
const app = express();
// const server = require('http').createServer(app);

app.use(bodyParser.json());

const token = 'ebfa7e809a8c67aea41478403a235393617d808b85ddf2d1673a8651443c978685a667731e7e8745cad82'
const confirmation_code = '363e7e9d'

const bot = new VKBot({
    token: token,
    confirmation: confirmation_code
})

//{ "type": "confirmation", "group_id": 212824418 }


app.post('/', bot.webhookCallback)

bot.command('/start', (ctx) => {
    ctx.reply('Приветствую тебя путник!\nДля получения погоды введи название города, например "Москва"')
})

bot.on((ctx) => {
    let word = ctx.message.text
    if (word.toLowerCase() == 'начать') {
        ctx.reply('Приветствую тебя путник!\nДля получения погоды введи название города, например "Москва"')
    } else {
        let city = ctx.message.text
        city = cyrillicToTranslit().transform(city, '_');

        console.log(city);

        const url = `https://pogoda.mail.ru/prognoz/${city}`

        ctx.reply(`Ваша ссылка - ${url}`)

        rp(url)
            .then(function(html) {
                const $ = cheerio.load(html);
                let data = [];
                //$('')
                $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_first > div').each((idx, elem) => {
                    const title = $(elem).text();
                    data.push(title)
                })
                $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_temperature > div.information__content__temperature').each((idx, elem) => {
                    const title = $(elem).text();
                    data.push(title)
                })
                $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_temperature > div.information__content__additional__item > span').each((idx, elem) => {
                    const title = $(elem).text();
                    data.push(title)
                })

                ctx.reply(data[1].trim() + ' ' + data[0].trim() + '\n' + data[2].trim())
            })
            .catch(function(err) {
                // error
                console.log(err);
            })


    }
})

app.get('/get/:city', (req, res) => {
    let city = req.params.city;
    city = cyrillicToTranslit().transform(city, '_');

    const url = `https://pogoda.mail.ru/prognoz/${city}`

    rp(url)
        .then(function(html) {
            const $ = cheerio.load(html);
            let data = [];
            //$('')
            $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_first > div').each((idx, elem) => {
                const title = $(elem).text();
                data.push(title)
            })
            console.log(data);
        })
        .catch(function(err) {
            // error
            console.log(err);
        })

    res.send(city);
})

app.listen(port, function() {
    console.log(`Listening on port: ${port}`);
})

// .\ngrok authtoken --ngrok token-- set new token
// .\ngrok http --port--