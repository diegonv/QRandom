const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//number format like: 27692123390

app.get('/image', function (req, res, next) {
    fileToLoad = fs.readFileSync("qr.png");
    res.writeHead(200, { 'Content-Type': "image/png" });
    res.end(fileToLoad, 'binary');
});

app.get('/generate', function (req, res, next) {
    let currentNumber = getCurrentNumber();
    currentNumber = currentNumber + 1;
    setCurrentNumber(currentNumber);
    var QRCode = require('qrcode');

    QRCode.toFile('qr.png', '' + currentNumber, {
        color: {
            dark: '#000',
            light: '#FFF'
        }
    }, function (err) {
        if (err) throw err
        console.log('done');
    res.send(`<p>${currentNumber}</p><img src='http://192.168.0.27:8080/image' alt='${currentNumber}'/>`);
    });
    
});

function getCurrentNumber() {
    let obj = JSON.parse(fs.readFileSync('originalNumber.json', 'utf8'));
    return obj.number;
}

function setCurrentNumber(currentNumber) {
    const json = { "number": currentNumber };
    fs.writeFileSync('originalNumber.json', JSON.stringify(json));
}


const server = app.listen(8080, function () {
    console.log('Server is running..');
});