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
    private grid:Node[][] = [];
    private client:Client;
    private width: number = 20;
    private height: number = 20;
    private cellSize: number = 20;

    private startNode:Node;
    private goalNode:Node;

    private closedList:Array<Node> = [];
    private openList:Array<Node> = [];

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
    public getNodeAtPosition(x:number,y:number){
        return this.grid[y][x];
    }

    public getClient(){
        return this.client;
    }

    public getWidth(){
        return this.width;
    }

    public getHeight(){
        return this.height;
    }

    public getCellSize(){
        return this.cellSize;
    }

    public getStartNode(){
        return this.startNode;
    }

    public getGoalNode(){
        return this.goalNode;
    }

    public getOpenList(){
        return this.openList;
    }

    public getClosedList(){
        return this.closedList;
    }

    // Mutators
    public setStartNode(node:Node){
        this.openList.length = 0;
        this.closedList.length = 0;

        // If the passed node is declared but isn't walkable or is the goal node, the method is canceled
        if(node && (!node.getWalkable() || node===this.goalNode))
            return;

        // If the passed node is null, we set the start node at null and we draw it.
        if(!node){
            this.startNode = null;
            this.client.draw();
        }
        // If the passed node is valid, we draw an empty node in place of the old node and place and draw the new node
        else{
            let oldNode = this.startNode;
            this.startNode = node;

            if(oldNode){
                oldNode.draw();
            }

            this.addNodeToOpenList(this.startNode);
            this.startNode.draw();
        }
    }

    public setGoalNode(node:Node){
        if(node && (!node.getWalkable() || node===this.startNode))
            return;

        if(!node){
            this.goalNode = null;
            this.client.draw();
            return;
        }else{
            let oldNode = this.goalNode;
            this.goalNode = node;
            if(oldNode){
                oldNode.draw();
            }
            this.goalNode.draw();
        }
    }

    public appendHtmlEditorToElement(element:HTMLElement){
        // Set client
        this.client = new Client(this,element);
        this.client.draw();
    }

    public addNodeToOpenList(node:Node){
        this.openList.push(node);
    }

    public addNodeToClosedList(node:Node){
        this.closedList.push(node);
    }

    public deleteNodeFromOpenList(node:Node){
        let nodeToDeleteIndex = this.openList.indexOf(node);
        if (nodeToDeleteIndex > -1) {
            this.openList.splice(nodeToDeleteIndex, 1);
        }
    }
/*
    public deleteNodeFromClosedList(node:Node){
        let nodeToDeleteIndex = this.closedList.indexOf(node);
        if (nodeToDeleteIndex > -1) {
            this.closedList.splice(nodeToDeleteIndex, 1);
        }
    }
*/
    public moveNodeFromOpenToCosedList(node:Node){
        this.deleteNodeFromOpenList(node);
        this.addNodeToClosedList(node);
    }

    /*
    ==================
    Algorithms
    ==================
    */
    public publicAStarExecuteNextStep(){
        if(!this.startNode || !this.goalNode){
            return;
        }

        this.openList.forEach(node => {
            // Add every neighbour of the open list to the open list
            for(let y = node.getGridPosition().y-1 ; y<node.getGridPosition().y+2 ; y++){
                for(let x= node.getGridPosition().x-1; x<node.getGridPosition().x+2 ; x++){
                    // We don't want to check the current node
                    if(x==node.getGridPosition().x && y==node.getGridPosition().y)
                        continue;

                    console.log("AH!")
                    
                    // Get current neighbour
                    let neighbourNode:Node = this.getNodeAtPosition(x,y);

                    if(neighbourNode.inClosedList() || neighbourNode.inOpenList())
                        continue;

                    this.addNodeToOpenList(neighbourNode);
                    neighbourNode.draw();
                }
            }

            this.moveNodeFromOpenToCosedList(node);
        });



        console.log("Open list: ");
        console.log(this.openList);
        console.log("Closed list: ");
        console.log(this.closedList);
    }
}