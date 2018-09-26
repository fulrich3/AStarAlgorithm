import Map from './Map';
import Client from './Client';

export default class Node {
    private map:Map; // Reference to the parent map
    private gridPosition = { // Position in the grid
        x:0,
        y:0,
    };
    private walkable:boolean = true;
    private hover:boolean = false;
    private gCost:number = 0;
    private parent:Node = null;

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
        /*
        var closedNodeWithLowestFCost:Node = null;


        this.map.getClosedList().forEach((currentNode,index) => {
            if(index==0 || currentNode.getFCost()<closedNodeWithLowestFCost.getFCost()){
                closedNodeWithLowestFCost = currentNode;
            }
        });
        */

        /*
        if(this.map.getStartNode() && this.map.getGoalNode()){
            result = Math.floor( functions.pointDistance(this.getGridPosition(),this.map.getStartNode().getGridPosition())*10);
        }
        */

        return this.gCost;
    }

    public getHCost(){
        if(this.inClosedList() || this.inOpenList()){
            var result:number = null;

            if(this.map.getStartNode() && this.map.getGoalNode()){
                result = this.getDistanceToNode(this.map.getGoalNode());
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
                if(x<0 || y<0 || x>this.map.getWidth()-1 || y>this.map.getHeight()-1)
                    continue;

                let currentNode = this.map.getNodeAtPosition(x,y);

                if (this===currentNode)
                    continue;

                result.push(currentNode);
            }
        }

        return result;
    }

    public getPreviousNeighbour(){
        var neighbourNode:Node = null;

        let neighbours = this.getNeighbours();

        for(let i = 0; i<neighbours.length ;i++){
            var currentNode = neighbours[i];

            // We don't want to check the current node + If x or y is out of bounds + the node needs to be in the closed list + it needs to be walkable
            if(currentNode.getWalkable()==false || !currentNode.inClosedList())
                continue;

            // Get best neighbour
            if(!neighbourNode || (currentNode===this.map.getStartNode() || neighbourNode.getFCost() < currentNode.getFCost() )){
                neighbourNode = currentNode;

                if(neighbourNode===this.map.getStartNode()){
                    break;
                }
            }
        };

        return neighbourNode;
    }

    public getDistanceToNode(node:Node){
        var dstX:number = Math.abs(this.getGridPosition().x - node.getGridPosition().x);
        var dstY:number = Math.abs(this.getGridPosition().y - node.getGridPosition().y);

        return dstX>dstY ? 14*dstY + 10*(dstX-dstY) : 14*dstX + 10*(dstY-dstX);
    }

    public getParent(){
        return this.parent;
    }

    // Mutators
    public setGCost(value:number){
        this.gCost = value;
    }

    public setWalkable(value:boolean){
        if(this.isStartNode() || this.isGoalNode())
            return;

        if(value == !this.getWalkable()){
            this.walkable = value;
        }
    }

    public setHover(value:boolean){
        // We set it only if it's different from the current one
        if(value == !this.getHover()){
            this.hover = value;
        }
    }

    public setParent(value:Node){
        this.parent = value;
    };

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
}