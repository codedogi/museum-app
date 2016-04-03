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

var indexCtrl = require('./index/controllers/index.server.controller.js');
var attractSequence = indexCtrl.getAttractSequence();
var clips = indexCtrl.getMenus();

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

/* Video Attract Sequence */
var playAttractSequence = function () {
    playSequence(attractSequence.video);
};

var playSequence = function (clip) {
    wrapper.addClass('toggled');
    videoAttributeToggle();

    // load and play clip
    videoInstance.src = '../video/' + clip;
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
buttons.click(function () {
    var index = buttons.index(this);
    playSequence(clips[index].video);
});

/*Video Script*/
videoInstance.onended = playAttractSequence;

//leftMenuToggle();
videoAttributeToggle();
playAttractSequence();
