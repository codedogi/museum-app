/**
 * Created by hrspencer on 3/6/2016.
 */
"use strict";

var express = require('express');
var open = require('open');

var app = express();

app.use(express.static('app'));

var port = process.env.PORT || 8080;

app.get('/', function(request, response) {
    console.log('Mount get path: ', app.mountpath);
    response.open('index.html')
});

app.listen(port, function() {
    console.log('Express server listening on port: ' + port);
    open('http://localhost:' + port);
});

