import './style.scss';

import Pathfinder from './classes/Pathfinder';
import HtmlPathfinderEditor from './classes/HtmlPathfinderEditor';

var pathfinderConfig = {
    width: 40,
    height: 40,
    draw: true,
    drawOptions: {
        cellSize: 20,
    }
}

var startPoint = {
    x: 4,
    y: 4,
}

var goalPoint = {
    x: pathfinderConfig.width-5,
    y: pathfinderConfig.width-5,
}

function init(){
    var pathfinder = new Pathfinder(pathfinderConfig);
    pathfinder.setStartPoint(startPoint);
    pathfinder.setGoalPoint(goalPoint);

    //var path = pathfinder.getPath();

    new HtmlPathfinderEditor(pathfinder,document.body);
}

document.addEventListener("DOMContentLoaded", init, false);