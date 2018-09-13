import Map from './Map';
//import canvasDrawRectangle from '../utils';

export default class Node {
    map:Map;
    gridPosition = {
        x:0,
        y:0,
    };
    worldPosition = {
        x:0,
        y:0,
    };
    gCost:number = 0;
    hCost:number = 0;
    walkable:boolean = true;

    cursorHover:boolean = false;

    constructor(map:Map,x:number,y:number,walkable:boolean){
        this.map = map;
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        this.worldPosition.x = x * this.map.cellSize;
        this.worldPosition.y = y * this.map.cellSize;
        this.walkable = walkable;
    }

    // Accessors
    getGCost(){
        return this.gCost;
    }

    getHCost(){
        return this.hCost;
    }

    getFCost(){
        return this.gCost + this.hCost;
    }

    getWalkable(){
        return this.walkable;
    }

    // Mutators
    setGCost(value:number){
        this.gCost = value;
    }

    setHCost(value:number){
        this.hCost = value;
    }

    setWalkable(value:boolean){
        this.walkable = value;
    }

    update(){
        /*
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        */

        this.draw();
    }

    // Other
    draw(){
        let ctx = this.map.ctx;

        // Unwalkable node
        if(!this.walkable){
            ctx.rect(this.worldPosition.x,this.worldPosition.y,this.map.cellSize,this.map.cellSize);
            ctx.fillStyle = "black";
            ctx.fill();
        }
        // Walkable node
        else{
            ctx.rect(this.worldPosition.x,this.worldPosition.y,this.map.cellSize,this.map.cellSize);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        // Draw outline of node
        ctx.rect(this.worldPosition.x,this.worldPosition.y,this.map.cellSize,this.map.cellSize);
        ctx.fillStyle = "#222";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}