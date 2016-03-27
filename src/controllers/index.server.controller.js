"use strict";

var model = {
    attractSequence: {
        name: "Attract Sequence",
        video: "project.mp4"
    },
    menus: [
        {
            name: "Play Clip 1",
            video: "museum-app-1.mp4"
        },
        {
            name: "Play Clip 2",
            video: "museum-app-2.mp4"
        },
        {
            name: "Play Clip 3",
            video: "museum-app-3.mp4"
        },
        {
            name: "Play Clip 5",
            video: "museum-app-5.mp4"
        },
        {
            name: "Play Clip 6",
            video: "museum-app-6.mp4"
        }
    ]
};

module.exports.index = function (request, response) {
    response.render('index.html', {Menus: model.menus});
};
