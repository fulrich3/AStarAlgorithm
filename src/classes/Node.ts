import Map from './Map';
//import canvasDrawRectangle from '../utils';

export default class Node {
    map:Map; // Reference to the parent map
    gridPosition = { // Position in the grid
        x:0,
        y:0,
    };
    worldPosition = { // Position in the world
        x:0,
        y:0,
    };
    gCost:number = 0;
    hCost:number = 0;
    walkable:boolean = true;
    hover:boolean = false;

    constructor(map:Map,x:number,y:number,walkable:boolean){
        this.map = map;
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        this.worldPosition.x = x * this.map.cellSize;
        this.worldPosition.y = y * this.map.cellSize;
        this.walkable = walkable;
    }

    consoleLogPositionOnGrid(){
        console.log("X:"+this.gridPosition.x+" Y:"+this.gridPosition.y);
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

    getHover(){
        return this.hover;
    }

    // Mutators
    setGCost(value:number){
        this.gCost = value;
    }

    setHCost(value:number){
        this.hCost = value;
    }

    setWalkable(value:boolean){
        if(value == !this.getWalkable()){
            this.walkable = value;
            this.consoleLogPositionOnGrid();
            this.draw();
        }
    }

    setHover(value:boolean){
        // We set it only if it's different from the current one
        if(value == !this.getHover()){
            this.hover = value;
            this.draw();
        }
    }

    // Other
    draw(){
        let ctx = this.map.ctx;

        ctx.beginPath();
        // Set draw area for the node
        ctx.rect(this.worldPosition.x,this.worldPosition.y,this.map.cellSize,this.map.cellSize);

        // Set color
        // Unwalkable node
        if(!this.getWalkable()){
            ctx.fillStyle = this.map.colorFillSolid;
        }
        // Walkable node
        else{
            if(!this.getHover()){
                ctx.fillStyle = this.map.colorFillNormal;
            }else{
                ctx.fillStyle = this.map.colorFillHover;
            }
        }
        
        ctx.fill();

        // Draw outline of node
        ctx.fillStyle = this.map.colorStroke;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.closePath();
    }
}