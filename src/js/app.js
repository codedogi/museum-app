"use strict";
/**
 * Created by hrspencer on 1/23/2016.
 * Dependencies: jquery
 */

var App = {
    name: 'museum-app',
    author: 'hrs',
    created: '1/23/2016'
};

console.log(App);

var ctrl = require('../controllers/index.server.controller')
var model = ctrl.model;

/* Setup Menus */
var menu = $(".menu");
var buttons = $(".btn.btn-lg.btn-block.clip");
var video = $("video");
var videoInstance = video.get(0);
var wrapper = $("#wrapper");

menu.addClass('fa-bars');

/* Left Menu */
var leftMenuToggle = function () {
    wrapper.toggleClass("toggled");
};

menu.click(leftMenuToggle);

/* Video Sequence */
var playAttractSequence = function () {
    if (wrapper.hasClass("toggled")) {
        leftMenuToggle();
    }

    playSequence(model.attractSequence.video);
};

var playSequence = function (clip) {

    leftMenuToggle();
    videoAttributeToggle();

    // load and play clip
    videoInstance.src = '../videos/' + clip;
    videoInstance.load();
    videoInstance.play();
};

var videoAttributeToggle = function () {
    if (video.attr('loop')) {
        video.removeAttr('loop');
        video.removeAttr('autoplay');
        video.removeAttr('controls');
    } else {
        video.attr('loop', '');
        video.attr('autoplay', '');
        video.attr('controls', '');
    }
};

/*Button Click Script*/
buttons.click(function (e) {
    var button = e.target;
    var clip = button.attr('clip')
    playSequence(clip);
});

/*Video Script*/
videoInstance.onended = playAttractSequence;
