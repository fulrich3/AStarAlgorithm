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
    var map = new Map(mapConfig);
    map.appendHtmlCanvas();
}

document.addEventListener("DOMContentLoaded", init, false);