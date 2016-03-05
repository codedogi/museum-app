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

/* document ready */
$(function () {

    /* Setup Menus */
    var menu = $(".menu");
    var buttons = $(".btn.btn-lg.btn-block.clip")
    var video = $("video");
    var videoObject = video.get(0);
    var wrapper = $("#wrapper");

    menu.addClass('fa-bars');

    var videos = [
        "video/project.mp4",
        "video/museum-app-1.mp4",
        "video/museum-app-2.mp4",
        "video/museum-app-3.mp4",
        "video/museum-app-4.mp4",
        "video/museum-app-5.mp4",
        "video/museum-app-6.mp4",
    ];

    /* Left Menu */
    var leftMenuToggle = function () {
        wrapper.toggleClass("toggled");
    };

    menu.click(leftMenuToggle);

    /* Video Sequence */
    var playAttractSequence = function () {
        if (wrapper.hasClass("toggled"))
            leftMenuToggle();

        playSequence(0);
    };

    var playSequence = function(clip) {

        leftMenuToggle();
        videoAttributeToggle();

        // load and play clip
        videoObject.src = videos[clip];
        videoObject.load();
        videoObject.play();
    };

    var videoAttributeToggle = function() {
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

        // determine clip to play
        var clip = parseInt(button.id.substring(1));
        playSequence(clip);
    });

    /*Video Script*/
    videoObject.onended = playAttractSequence;
});
