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
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    colorStroke:string = "#111";
    colorStrokeHover:string = "#666";
    colorFillNormal:string = "#fff";
    colorFillSolid:string = "#161616";

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

        // Set client
        this.client = new Client(this);
    }

    public appendHtmlCanvas(tagId?:string){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.backgroundColor = "gray";
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;

        if(tagId == undefined){
            document.body.appendChild(this.canvas);
        }else{
            document.getElementById(tagId).appendChild(this.canvas);
        }

        this.drawHtmlCanvas();
    }

    /*
    update(){
        console.log("update");
        this.drawHtmlCanvas();
    }
    */

   public drawHtmlCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let y:number=0; y<this.height; y++){
            for(let x:number=0; x<this.width; x++){
                let currentNode = this.grid[y][x];
                currentNode.draw();
            }
        }

        console.log("done");
    }
}