import Map from './Map';
import Client from './Client';

var functions = require('./functions');
const imageSrc = require('../img/arrow.png');

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
            result = Math.floor( functions.pointDistance(this.getGridPosition(),this.map.getStartNode().getGridPosition())*10);
        }

        return result;
    }

    public getHCost(){
        if(this.inClosedList() || this.inOpenList()){
            var result:number = 0;

            if(this.map.getStartNode() && this.map.getGoalNode()){
                result = Math.floor(functions.pointDistance(this.getGridPosition(),this.map.getGoalNode().getGridPosition())*10);
            }

            return result;
        }else{
            return null;
        }
    }

    public getFCost(){
        if(this.inClosedList() || this.inOpenList())
            return this.getGCost() + this.getHCost();
        else
            return null;
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

    public getNeighbours(){
        var result:Array<Node> = [];

        for(let y = this.getGridPosition().y-1 ; y<this.getGridPosition().y+2 ; y++){
            for(let x= this.getGridPosition().x-1; x<this.getGridPosition().x+2 ; x++){
            // We don't want to check the current node + If x or y is out of bounds + the node needs to be in the closed list + it needs to be walkable
                if(x<0 || y<0 || x>this.map.getWidth() || y>this.map.getHeight())
                    continue;

                let currentNode = this.map.getNodeAtPosition(x,y);

                if (this===currentNode)
                    continue;
                
                result.push(currentNode);
            }
        }

        return result;
    }

    public getNeighbourWithLowestFCost(){
        var neighbourNode:Node = null;

        let neighbours = this.getNeighbours();

        for(let i = 0; i<neighbours.length ;i++){
            var currentNode = neighbours[i];

            // We don't want to check the current node + If x or y is out of bounds + the node needs to be in the closed list + it needs to be walkable
            if(currentNode.getWalkable()==false)
                continue;

            // Get best neighbour
            var currentNodeIsClosest:boolean;

            if(neighbourNode)
                currentNodeIsClosest = functions.pointDistance(this.getGridPosition(),currentNode.getGridPosition()) < functions.pointDistance(this.getGridPosition(),neighbourNode.getGridPosition());
            else
                currentNodeIsClosest = true;

            if(!neighbourNode || (currentNode.getFCost() < neighbourNode.getFCost() || currentNodeIsClosest)){
                neighbourNode = currentNode;
                if(neighbourNode===this.map.getStartNode()){
                    break;
                }
            }
        };

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
                switch(Client.NODE_DISPLAY_MODE){
                    case 0 :
                        if(this.inOpenList() || this.inClosedList()){
                            ctx.font = "16px " + Client.FONT;
                            // Display FCost
                            if(this.getFCost())
                                ctx.fillText((this.getFCost()).toString() , this.getWorldPosition().x + this.map.getCellSize()/2 , this.getWorldPosition().y + this.map.getCellSize()/2);
        
                            ctx.font = "10px " + Client.FONT;
                            // Display GCost
                            if(this.getGCost())
                                ctx.fillText( (this.getGCost()).toString() , this.getWorldPosition().x + 8 , this.getWorldPosition().y + 8);
        
                            // Display HCost
                            if(this.getHCost())
                                ctx.fillText( (this.getHCost()).toString() , this.getWorldPosition().x + this.map.getCellSize() - 8 , this.getWorldPosition().y + 8);
                        }
                        break;
                    case 1 :
                        ctx.font = "10px " + Client.FONT;

                        // Display FCost
                        if(this.getFCost()){
                            ctx.fillText((this.getFCost()).toString() , this.getWorldPosition().x + this.map.getCellSize()/2 , this.getWorldPosition().y + 8);

                            let neighbourWithLowestFCost:Node = this.getNeighbourWithLowestFCost();

                            // Display image
                            var img = new Image();
                            img.onload = function() {
                                ctx.save();

                                let drawAngle:number = functions.pointAngleDeg(this.getGridPosition(),neighbourWithLowestFCost.getGridPosition());
                                console.log(drawAngle);
                                let arrowPosition = {
                                    x: this.getWorldPosition().x + this.map.getCellSize()/2,
                                    y: this.getWorldPosition().y + this.map.getCellSize()/2,
                                };
                                
                                console.log(drawAngle);

                                ctx.translate(arrowPosition.x,arrowPosition.y);
                                //ctx.rotate(drawAngle*Math.PI/180);
                                ctx.rotate(drawAngle);

                                ctx.translate(-arrowPosition.x,-arrowPosition.y);

                                ctx.drawImage(img, arrowPosition.x - img.width/2 , arrowPosition.y - img.width/2);
                                
                                ctx.restore();
                            }.bind(this);
                            img.src = imageSrc;
                        }
                        break;
                }
            }

            // Draw stroke of node
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.closePath();
        }
    }
}