import Map from './Map';
import Client from './Client';

import pointDistance from './Function';

export default class Node {
    private map:Map; // Reference to the parent map
    private gridPosition = { // Position in the grid
        x:0,
        y:0,
    };
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
        var result:number = 0;

        if(this.map.getStartNode() && this.map.getGoalNode()){
            result = Math.floor( pointDistance(this.gridPosition.x,this.gridPosition.y,this.map.getStartNode().gridPosition.x,this.map.getStartNode().gridPosition.y)*10);
        }

        return result;
    }

    public getHCost(){
        var result:number = 0;

        if(this.map.getStartNode() && this.map.getGoalNode()){
            result = Math.floor( pointDistance(this.gridPosition.x,this.gridPosition.y,this.map.getGoalNode().gridPosition.x,this.map.getGoalNode().gridPosition.y)*10);
        }

        return result;
    }

    public getFCost(){
        return this.getGCost() + this.getHCost();
    }

    public getWalkable(){
        return this.walkable;
    }

    public getHover(){
        return this.hover;
    }

    public getGridPosition(){
        return {
            x: this.gridPosition.x,
            y: this.gridPosition.y,
        }
    }

    public getWorldPosition(){
        return {
            x: this.gridPosition.x * this.map.getCellSize(),
            y: this.gridPosition.y * this.map.getCellSize(),
        }
    }

    public getNeighbourWithLowestFCost(){
        var neighbourNode:Node = null;

        for(let y = this.getGridPosition().y-1 ; y<this.getGridPosition().y+2 ; y++){
            for(let x= this.getGridPosition().x-1; x<this.getGridPosition().x+2 ; x++){
                // We don't want to check the current node + If x or y is out of bounds, continue
                if(x==this.getGridPosition().x && y==this.getGridPosition().y && (x<0 || y<0 || x>this.map.getWidth()-1 || y>this.map.getHeight()-1) && !this.map.getNodeAtPosition(x,y).inClosedList() && this.map.getNodeAtPosition(x,y).getWalkable()!=true)
                    continue;

                //console.log( this.map.getNodeAtPosition(x,y) );
                
                // Get best neighbour
                if(!neighbourNode || this.map.getNodeAtPosition(x,y).getFCost() < neighbourNode.getFCost()){
                    neighbourNode = this.map.getNodeAtPosition(x,y);
                    if(neighbourNode===this.map.getStartNode()){
                        break;
                    }
                }
            }

            if(neighbourNode===this.map.getStartNode())
                break;
        }

        return neighbourNode;
    }

    // Mutators
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

    public inOpenList(){
        return this.map.getOpenList().includes(this);
    }

    public inClosedList(){
        return this.map.getClosedList().includes(this);
    }

    public inPathList(){
        return this.map.getPathList().includes(this);
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
                    // Set color for start node
                    ctx.fillStyle = Client.colorFillStart;
                }else if(this.isGoalNode()){
                    // Set color for goal node
                    ctx.fillStyle = Client.colorFillGoal;
                }else if(this.inPathList()){
                    // Set color for closed node
                    ctx.fillStyle = Client.colorFillPath;
                }else if(this.inOpenList()){
                    // Set color for open node
                    ctx.fillStyle = Client.colorFillOpen;
                }else if(this.inClosedList()){
                    // Set color for closed node
                    ctx.fillStyle = Client.colorFillClosed;
                }else{
                    // Set color for normal node
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
            ctx.fillStyle = Client.colorTextNormal;
            ctx.textBaseline="middle";
            ctx.textAlign="center";

            if(this.isStartNode() || this.isGoalNode()){
                ctx.font = "13px " + Client.FONT;
                if(this.isStartNode()){
                    ctx.fillText("Start" , this.getWorldPosition().x + this.map.getCellSize()/2 , this.getWorldPosition().y + this.map.getCellSize()/2);
                }else if(this.isGoalNode()){
                    ctx.fillText("Goal" , this.getWorldPosition().x + this.map.getCellSize()/2 , this.getWorldPosition().y + this.map.getCellSize()/2);
                }
            }else{
                if(this.inOpenList() || this.inClosedList()){
                    ctx.font = "16px " + Client.FONT;
                    // Display FCost
                    ctx.fillText((this.getFCost()).toString() , this.getWorldPosition().x + this.map.getCellSize()/2 , this.getWorldPosition().y + this.map.getCellSize()/2);

                    ctx.font = "10px " + Client.FONT;
                    // Display GCost
                    ctx.fillText( (this.getGCost()).toString() , this.getWorldPosition().x + 8 , this.getWorldPosition().y + 8);

                    // Display HCost
                    ctx.fillText( (this.getHCost()).toString() , this.getWorldPosition().x + this.map.getCellSize() - 8 , this.getWorldPosition().y + 8);
                }
            }

            // Draw stroke of node
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.closePath();
        }
    }
}