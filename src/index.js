import './style.scss';

import Pathfinder from './classes/Pathfinder';
import HtmlPathfinderEditor from './classes/HtmlPathfinderEditor';

var pathfinderConfig = {
    width: 30,
    height: 30,
    draw: true,
    drawOptions: {
        cellSize: 25,
    },
    startNodePosition: {
        x:4,
        y:4,
    },
    goalNodePosition: {
        x: 25,
        y: 25,
    },
}

function init(){
    var pathfinder = new Pathfinder(pathfinderConfig);
    new HtmlPathfinderEditor(pathfinder,document.body);
}

document.addEventListener("DOMContentLoaded", init, false);