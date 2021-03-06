import Node from './Node';
import HtmlPathfinderEditor from './HtmlPathfinderEditor';

interface mapConfigInterface {
    width:number,
    height:number,
    drawOptions: {
        cellSize: number,
    }
    startNodePosition:any;
    goalNodePosition:any;
}

export default class Pathfinder {
    private grid:Node[][] = [];
    private htmlPathfinderEditor:HtmlPathfinderEditor;
    private width: number = 20;
    private height: number = 20;
    private cellSize: number = 20;

    private startNode:Node;
    private goalNode:Node;

    private startNodeDefaultPosition = {
        x:4,
        y:4,
    }

    private goalNodeDefaultPosition = {
        x: this.width-5,
        y: this.height-5,
    }

    private closedList:Array<Node> = [];
    private openList:Array<Node> = [];
    private pathList:Array<Node> = [];

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

        this.startNodeDefaultPosition = config.startNodePosition;
        this.goalNodeDefaultPosition = config.goalNodePosition;

        // Set array size
        for(let y:number=0; y<this.height; y++){
            this.grid.push([]);
        }

        this.init();
    }

    public init(){
        this.closedList = [];
        this.openList = [];
        this.pathList = [];

        // Add nodes to grid
        for(let y:number=0; y<this.height; y++){
            for(let x:number=0; x<this.width; x++){
                let walkable = true;
                let htmlPathfinderEditor = this;
                this.grid[y][x] = new Node(htmlPathfinderEditor,x,y,walkable);
            }
        };


        this.setGoalNode( this.getNodeAtPosition(
            this.startNodeDefaultPosition.x,
            this.startNodeDefaultPosition.y
        ));

        this.setStartNode( this.getNodeAtPosition(
            this.goalNodeDefaultPosition.x,
            this.goalNodeDefaultPosition.y
        ));
    }

    // Accessors
    public getNodeAtPosition(x:number,y:number){
        return this.grid[y][x];
    }

    public getHtmlPathfinderEditor(){
        return this.htmlPathfinderEditor;
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
    
    public getPathList(){
        return this.pathList;
    }

    public isPathFound(){
        return this.getStartNode() === this.pathList[this.pathList.length-1]
    }

    public getPath(){
        var result:any = [];

        while(!this.isPathFound() && this.getOpenList().length > 0){
            this.aStarExecuteNextStep();
        }
        
        this.getPathList().forEach(function(node) {
            result.push({
                x: node.getGridPosition().x,
                y: node.getGridPosition().y,
            });
        });

        return result;
    }

    // Mutators
    public setStartNode(node:Node){
        this.openList.length = 0;
        this.closedList.length = 0;

        // If the passed node is declared but isn't walkable or is the goal node
        if(node && (!node.getWalkable() || node===this.goalNode))
            return;

        // If the passed node is null, we set the start node to null
        if(!node){
            this.startNode = null;
        }else{
             // If the passed node is valid, we place the new node
            this.startNode = node;
            this.addNodeToOpenList(this.startNode);
        }
    }

    public setGoalNode(node:Node){
        // If the passed node is declared but isn't walkable or is the start node
        if(node && (!node.getWalkable() || node===this.startNode))
            return;

        // If the passed node is null, we set the goal node to null
        if(!node){
            this.goalNode = null;
        }else{
            // If the passed node is valid, we place the new node
            this.goalNode = node;
        }
    }

    public setStartPoint(object:any){
        let startNode = this.getNodeAtPosition(object.x,object.y);
        this.setStartNode(startNode);
    }

    public setGoalPoint(object:any){
        let goalNode = this.getNodeAtPosition(object.x,object.y);
        this.setGoalNode(goalNode);
    }

    public setHtmlPathfinderEditor(htmlPathfinderEditor:HtmlPathfinderEditor){
        this.htmlPathfinderEditor = htmlPathfinderEditor;
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

    public deleteNodeFromClosedList(node:Node){
        let nodeToDeleteIndex = this.closedList.indexOf(node);
        if (nodeToDeleteIndex > -1) {
            this.closedList.splice(nodeToDeleteIndex, 1);
        }
    }

    public moveNodeFromOpenToClosedList(node:Node){
        this.deleteNodeFromOpenList(node);
        this.addNodeToClosedList(node);
    }

    /*
    ==================
    Algorithms
    ==================
    */
    public aStarExecuteNextStep(){
        // If goal is not found, we try to find it first....
        if(!this.getClosedList().includes(this.getGoalNode())){
            if(!this.startNode || !this.goalNode){
                return;
            }

            if(this.openList.length==0){
                return;
            }

            // We get the node with the lowest FCost
            var currentNode:Node;
            this.openList.forEach((node,index) => {
                if(index==0 || node.getFCost() < currentNode.getFCost()){
                    currentNode = this.openList[index];
                }
            });

            // We move the current node to the closed list
            this.moveNodeFromOpenToClosedList(currentNode);

            // Get every neighbours of the current node and loop through them
            let neighbours = currentNode.getNeighbours();

            for(var i=0; i<neighbours.length;i++){
                // Get current neighbour
                let neighbour:Node = neighbours[i];

                if(neighbour.inClosedList() || neighbour.getWalkable()==false)
                    continue;

                var xx:number = currentNode.getGridPosition().x - neighbour.getGridPosition().x;
                var yy:number = currentNode.getGridPosition().y - neighbour.getGridPosition().y;

                // Corners check
                if(yy!=0){
                    if(yy==-1){
                        if(xx!=0){
                            if(this.getNodeAtPosition(neighbour.getGridPosition().x+xx,neighbour.getGridPosition().y+yy).getWalkable())

                            if(xx==-1){
                                // Top left corner
                                // If corner walkable
                                if(!this.getNodeAtPosition(neighbour.getGridPosition().x,neighbour.getGridPosition().y-1).getWalkable() && !this.getNodeAtPosition(neighbour.getGridPosition().x-1,neighbour.getGridPosition().y).getWalkable())
                                    continue;
                            }
                            else
                            if(xx==1){
                                // Top right corner
                                // If corner walkable
                                if(!this.getNodeAtPosition(neighbour.getGridPosition().x,neighbour.getGridPosition().y-1).getWalkable() && !this.getNodeAtPosition(neighbour.getGridPosition().x+1,neighbour.getGridPosition().y).getWalkable())
                                    continue;
                            }
                        }
                    }
                    else
                    if(yy==1){
                        if(xx!=0){
                            if(xx==-1){
                                // Bottom left corner
                                // If corner walkable
                                if(!this.getNodeAtPosition(neighbour.getGridPosition().x,neighbour.getGridPosition().y+1).getWalkable() && !this.getNodeAtPosition(neighbour.getGridPosition().x-1,neighbour.getGridPosition().y).getWalkable())
                                    continue;
                            }
                            else
                            if(xx==1){
                                // Bottom right corner
                                // If corner walkable
                                if(!this.getNodeAtPosition(neighbour.getGridPosition().x,neighbour.getGridPosition().y+1).getWalkable() && !this.getNodeAtPosition(neighbour.getGridPosition().x+1,neighbour.getGridPosition().y).getWalkable())
                                    continue;
                            }
                        }
                    }
                }

                // If new path to neighbour is shorter OR neighbour is not in open
                var newMovementCostToNeighbour:number = currentNode.getGCost() + currentNode.getDistanceToNode(neighbour);
                if(newMovementCostToNeighbour < neighbour.getGCost() || !this.getOpenList().includes(neighbour)){
                    // Set G Cost
                    if(neighbour.getGCost() == 0)
                        neighbour.setGCost( currentNode.getGCost() + neighbour.getDistanceToNode(currentNode));

                    // Set parent of neighbour to current
                    neighbour.setParent(currentNode);

                    // Add neighbour if not in open
                    if(!this.getOpenList().includes(neighbour))
                        this.addNodeToOpenList(neighbour);
                }
            }
        }
        
        // If goal is found, we trace the path until we find the start node
        else if(!this.pathList.includes(this.startNode)){
            if(this.pathList.length==0){
                this.pathList.push( this.goalNode );
            }else{  
                var nodeAtTopOfStack:Node = this.pathList[this.pathList.length-1];
                this.pathList.push( nodeAtTopOfStack.getParent());
            }
        }
    }
}