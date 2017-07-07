var express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.get('/', function(req, res) {
	console.log(req.webtaskContext);
	res.end('hello world');
});

// like
app.post('/like', function(req, res) {
    console.log('=== like ===');
    console.log(req.body);
    res.sendStatus(200);
});

// highlight
app.post('/highlight', function(req, res) {
    console.log('=== highlight ===');
    console.log(req.body);
    res.sendStatus(200);
});

// comment
app.post('/comment', function(req, res) {
    console.log('=== comment ===');
    console.log(req.body);
    res.sendStatus(200);
});

//archived
app.post('/archived', function(req, res) {
    console.log('=== archived ===');
    console.log(req.body);
    res.sendStatus(200);
});


module.exports = Webtask.fromExpress(app);
