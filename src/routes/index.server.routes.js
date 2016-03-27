"use strict";

var express = require('express'),
    router = express.Router(),
    homeCtrl = require('../controllers/index.server.controller');

/* GET Home Page */
router.get('/', function(request, response) {
    return homeCtrl.index(request, response);
});

module.exports = router;
