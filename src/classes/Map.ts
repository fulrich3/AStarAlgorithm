import Node from './Node';
import Client from './Client';

interface mapConfigInterface {
    width:number,
    height:number,
    drawOptions: {
        cellSize: number,
    }
}

export default class Map {
    grid:Node[][] = [];
    client:Client;
    width: number = 20;
    height: number = 20;
    cellSize: number = 20;

    private startNode:Node;
    private goalNode:Node;

    constructor(config:mapConfigInterface){
        if (config.width)
            this.width = Math.floor(config.width);

        if (config.height)
            this.height = Math.floor(config.height);

        if (config.drawOptions){
            let drawConfig = config.drawOptions;

            if(drawConfig.cellSize){
                this.cellSize = Math.floor(drawConfig.cellSize);
            }
        }

        // Set array size
        for(let y:number=0; y<this.height; y++){
            this.grid.push([]);
        }

        // Add nodes to grid
        for(let y:number=0; y<this.height; y++){
            for(let x:number=0; x<this.width; x++){
                let walkable = true;
                let map = this;
                this.grid[y][x] = new Node(map,x,y,walkable);
            }
        }
    }

    // Accessors
    getStartNode(){
        return this.startNode;
    }

    getGoalNode(){
        return this.goalNode;
    }

    // Mutators
    setStartNode(node:Node){
        if(node==this.goalNode || (node && !node.getWalkable()))
            return;

        if(!node){
            //this.startNode = new Node(this,this.startNode.gridPosition.x,this.startNode.gridPosition.y,true);
            this.startNode = null;
            this.client.draw();
            return;
        }else{
            let oldNode = this.startNode;
            this.startNode = node;
            if(oldNode){
                oldNode.draw();
            }
        }
       
        this.startNode.draw();
    }

    setGoalNode(node:Node){
        if(node==this.startNode || (node && !node.getWalkable()))
            return;

        if(!node){
            //this.goalNode = new Node(this,this.goalNode.gridPosition.x,this.goalNode.gridPosition.y,true);
            this.goalNode = null;
            this.client.draw();
            return;
        }else{
            let oldNode = this.goalNode;
            this.goalNode = node;
            if(oldNode){
                oldNode.draw();
            }
        }

        this.goalNode.draw();
    }

    public appendHtmlEditorToElement(element:HTMLElement){
        // Set client
        this.client = new Client(this,element);
        this.client.draw();
    }
}