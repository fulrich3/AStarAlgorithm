import Pathfinder from './Pathfinder';

export default class Node {
    private pathfinder:Pathfinder; // Reference to the parent map
    private gridPosition = { // Position in the grid
        x:0,
        y:0,
    };
    private walkable:boolean = true;
    private hover:boolean = false;
    private gCost:number = 0;
    private parent:Node = null;

    constructor(pathfinder:Pathfinder,x:number,y:number,walkable:boolean){
        this.pathfinder = pathfinder;
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
        if(this.inClosedList() || this.inOpenList()){
            var result:number = null;

            if(this.pathfinder.getStartNode() && this.pathfinder.getGoalNode()){
                result = this.getDistanceToNode(this.pathfinder.getGoalNode());
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
            x: this.gridPosition.x * this.pathfinder.getCellSize(),
            y: this.gridPosition.y * this.pathfinder.getCellSize(),
        }
    }

    public getNeighbours(){
        var result:Array<Node> = [];

        for(let y = this.getGridPosition().y-1 ; y<this.getGridPosition().y+2 ; y++){
            for(let x= this.getGridPosition().x-1; x<this.getGridPosition().x+2 ; x++){
            // We don't want to check the current node + If x or y is out of bounds + the node needs to be in the closed list + it needs to be walkable
                if(x<0 || y<0 || x>this.pathfinder.getWidth()-1 || y>this.pathfinder.getHeight()-1)
                    continue;

                let currentNode = this.pathfinder.getNodeAtPosition(x,y);

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
            if(!neighbourNode || (currentNode===this.pathfinder.getStartNode() || neighbourNode.getFCost() < currentNode.getFCost() )){
                neighbourNode = currentNode;

                if(neighbourNode===this.pathfinder.getStartNode()){
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
        return this === this.pathfinder.getStartNode();
    }

    public isGoalNode(){
        return this === this.pathfinder.getGoalNode();
    }

    public inOpenList(){
        return this.pathfinder.getOpenList().includes(this);
    }

    public inClosedList(){
        return this.pathfinder.getClosedList().includes(this);
    }

    public inPathList(){
        return this.pathfinder.getPathList().includes(this);
    }
}