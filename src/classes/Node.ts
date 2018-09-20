import Map from './Map';
import Client from './Client';

export default class Node {
    private map:Map; // Reference to the parent map
    private gridPosition = { // Position in the grid
        x:0,
        y:0,
    };
    private gCost:number = 0;
    private hCost:number = 0;
    private walkable:boolean = true;
    private hover:boolean = false;

    constructor(map:Map,x:number,y:number,walkable:boolean){
        this.map = map;
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        this.walkable = walkable;
    }

    public consoleLogPositionOnGrid(){
        console.log("X:"+this.gridPosition.x+" Y:"+this.gridPosition.y);
    }

    // Accessors
    public getGCost(){
        return this.gCost;
    }

    public getHCost(){
        return this.hCost;
    }

    public getFCost(){
        return this.gCost + this.hCost;
    }

    public getWalkable(){
        return this.walkable;
    }

    public getHover(){
        return this.hover;
    }

    public getWorldPosition(){
        return {
            x: this.gridPosition.x * this.map.getCellSize(),
            y: this.gridPosition.y * this.map.getCellSize(),
        }
    }

    // Mutators
    public setGCost(value:number){
        this.gCost = value;
    }

    public setHCost(value:number){
        this.hCost = value;
    }

    public setWalkable(value:boolean){
        if(this.isStartNode() || this.isGoalNode())
            return;

        if(value == !this.getWalkable()){
            this.walkable = value;
            this.draw();
        }
    }

    public setHover(value:boolean){
        // We set it only if it's different from the current one
        if(value == !this.getHover()){
            this.hover = value;
            this.draw();
        }
    }

    // Other
    public isStartNode(){
        return this === this.map.getStartNode();
    }

    public isGoalNode(){
        return this === this.map.getGoalNode();
    }

    public draw(){
        if(this.map.getClient()){
            let ctx = this.map.getClient().getCtx();

            ctx.beginPath();
            // Set draw area for the node
            ctx.rect(this.getWorldPosition().x,this.getWorldPosition().y,this.map.getCellSize(),this.map.getCellSize());

            // Set fill color
            if(!this.getWalkable()){
                // Unwalkable node
                ctx.fillStyle = Client.colorFillSolid;
            }else{
                // Walkable node
                if(this.isStartNode()){
                    ctx.fillStyle = Client.colorFillStart;
                }else if(this.isGoalNode()){
                    ctx.fillStyle = Client.colorFillGoal;
                }else{
                    ctx.fillStyle = Client.colorFillNormal;
                }
                
            }
            ctx.fill();

            // Stroke
            if(!this.getHover()){
                ctx.strokeStyle = Client.colorStroke;
            }else{
                ctx.strokeStyle = Client.colorStrokeHover;
            }

            //Draw text
            ctx.font = "13px " + Client.FONT;
            ctx.fillStyle = Client.colorTextNormal;
            ctx.textBaseline="middle";
            ctx.textAlign="center";

            if(this.isStartNode()){
                ctx.fillText("Start" , this.getWorldPosition().x + this.map.getCellSize()/2 , this.getWorldPosition().y + this.map.getCellSize()/2);
            }else if(this.isGoalNode()){
                ctx.fillText("Goal" , this.getWorldPosition().x + this.map.getCellSize()/2 , this.getWorldPosition().y + this.map.getCellSize()/2);
            }

            // Draw stroke of node
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.closePath();
        }
    }
}