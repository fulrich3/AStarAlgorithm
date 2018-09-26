import './style.scss';

import Pathfinder from './classes/Pathfinder';

var mapConfig = {
    width: 40,
    height: 40,
    draw: true,
    drawOptions: {
        cellSize: 20,
    }
}

function init(){
    var pathfinder = new Pathfinder(mapConfig);
    pathfinder.appendHtmlEditorToElement(document.body);
}

document.addEventListener("DOMContentLoaded", init, false);