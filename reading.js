var express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser');
var app = express();
var request = require("request");

app.use(bodyParser.json());

var OWNER = 'kk0829';
var REPO = 'reading';
var GITHUB_TOKEN = 'e8f7b3b5b9c425118be3df456aed724346bb07e2';
var HEADERS = {
    'authorization': `token ${GITHUB_TOKEN}`,
    'user-agent': 'Awesome-Octocat-App',
    'content-type': 'application/json'
};

function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

app.get('/', function(req, res) {

});

// like
app.post('/like', function(req, res) {
    console.log('=================== like ===================');
    console.log(req.body);
    res.sendStatus(200);
});

// highlight
app.post('/highlight', function(req, res) {
    console.log('=================== highlight ===================');
    var data = req.body;
    console.log(data);

    var options = {
        method: 'GET',
        url: 'https://api.github.com/search/issues',
        qs: { q: `${data.title}repo:${OWNER}/${REPO}` },
        headers: HEADERS
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(body);
            var items = isString(body) ? JSON.parse(body).items : body.items || [];
            items.forEach((function(item) {
                var options = {
                    method: 'POST',
                    url: `${item.url}/comments`,
                    headers: HEADERS,
                    body: {
                        body: `> ${data.text}`
                    },
                    json: true
                };

                request(options, function(error, response, body) {
                    if (error) {
                        console.log(error);
                    }
                });
            }));
            res.end(body);
        }
    });
});

// comment
app.post('/comment', function(req, res) {
    console.log('=================== comment ===================');
    var data = req.body;
    console.log(data);

    var options = {
        method: 'GET',
        url: 'https://api.github.com/search/issues',
        qs: { q: `${data.title}repo:${OWNER}/${REPO}` },
        headers: HEADERS
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            var items = JSON.parse(body).items;
            items.forEach((function(item) {
                var options = {
                    method: 'POST',
                    url: `${item.url}/comments`,
                    headers: HEADERS,
                    body: {
                        body: `> ${data.highlightedText}\n\n${data.comment}`
                    },
                    json: true
                };

                request(options, function(error, response, body) {
                    if (error) console.log(error);;
                });
            }));
            res.end(body);
        }
    });
});

//archived
app.post('/archived', function(req, res) {
    console.log('=================== archived ===================');
    var data = req.body;
    console.log(data);

    var options = {
        method: 'GET',
        url: 'https://api.github.com/search/issues',
        qs: { q: `${data.title}repo:${OWNER}/${REPO}` },
        headers: HEADERS
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            var items = JSON.parse(body).items;
            items.forEach((function(item) {
                var options = {
                    method: 'PATCH',
                    url: `${item.url}`,
                    headers: HEADERS,
                    body: { state: 'closed' },
                    json: true
                };

                request(options, function(error, response, body) {
                    if (error) console.log(error);;
                });
            }));
            res.end(body);
        }
    });



});


module.exports = Webtask.fromExpress(app);
