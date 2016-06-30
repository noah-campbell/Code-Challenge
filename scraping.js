var request = require('request'),
    cheerio = require('cheerio'),
    jsonFormat = require('json-format'),
    fs = require('fs'),
    express = require('express'),
    app = express(),
    port = 8080;

var titleText = [],
    imageUrlText = [],
    authorText = [],
    priceText = [],
    books = [],
    space = '';

var url = 'https://origin-web-scraping.herokuapp.com';

request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {

        var $ = cheerio.load(body, {
            normalizeWhitespace: true
        });

        $('.panel-heading').each(function(i, elem) {
            space = $(this).text();
            titleText[i] = space.trim();
        });

        $('.panel-body img').each(function(i, elem) {
            imageUrlText[i] = $(this).attr('src');
        });

        $('.panel-body p').each(function(i, elem) {
            authorText[i] = $(this).text();
        });

        $('.panel-body small').each(function(i, elem) {
            priceText[i] = $(this).text();
        });

        for (var i = 0; i < titleText.length; i++) {
            books.push({
                name: titleText[i],
                imageUrl: imageUrlText[i],
                author: authorText[i],
                price: priceText[i]
            });
        }

        fs.writeFile('books.json', jsonFormat(books), function(err) {
            if (err) throw err;

            app.listen(port);
            console.log('listening on ' + port);

            console.log(books);
        });

    }
});
