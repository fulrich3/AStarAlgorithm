import './style.scss';

import Map from './classes/Map';

var mapConfig = {
    width: 20,
    height: 20,
    draw: true,
    drawOptions: {
        cellSize: 40,
    }
}

function init(){
    console.log("loaded");
    var map = new Map(mapConfig);
    map.appendHtmlCanvas();
    map.update();
}

document.addEventListener("DOMContentLoaded", init, false);