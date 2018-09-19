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
        for(let x:number=0; x<this.width; x++){
            for(let y:number=0; y<this.height; y++){
                let walkable = true;
                let map = this;
                this.grid[y][x] = new Node(map,x,y,walkable);
            }
        }
    }

    public appendHtmlEditorToElement(element:HTMLElement){
        // Set client
        this.client = new Client(this,element);
        this.client.draw();
    }
}