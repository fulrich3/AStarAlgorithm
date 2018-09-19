import Map from './Map';
import Node from './Node';
import HtmlButton from './client/HtmlButton';

export default class Client{
    map:Map;
    mouseX:number = 0;
    mouseY:number = 0;
    nodeFocused:Node;
    mouseIsDown:boolean = false;
    cursorOutOfBounds:boolean = false;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    parentHtmlElement: HTMLElement;

    colorStroke:string = "#111";
    colorStrokeHover:string = "#AAA";
    colorFillNormal:string = "#fff";
    colorFillSolid:string = "#161616";

    constructor(map:Map,parentHtmlElement:HTMLElement){
        this.map = map;

        // Create canvas element
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.backgroundColor = "gray";
        this.canvas.width = this.map.width * this.map.cellSize;
        this.canvas.height = this.map.height * this.map.cellSize;

        // Selection of the canvas's parent HTML element
        this.parentHtmlElement = parentHtmlElement;

        this.init();
    }

    init(){
        let client = this;

        // Append canvas to the selected HTML element
        this.parentHtmlElement.appendChild(this.canvas);

        // Listener for right click
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            console.log("Click droit!");
        });

        // Listener for mouse move event
        window.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - this.canvas.offsetLeft;
            this.mouseY = e.clientY - this.canvas.offsetTop;

            this.mouseMove();
        });

        // Listener for mouse click event
        window.addEventListener("click", (e) => {
            this.click();
        });

        // Listener for mouse mousedown event
        window.addEventListener("mousedown", (e) => {
            this.mouseDown();
        });

        // Listener for mouse mouseup event
        window.addEventListener("mouseup", (e) => {
            this.mouseUp();
        });

        // Append editor buttons
        new HtmlButton(client,"Add walls",function(){
            console.log("Add walls");
        });

        new HtmlButton(client,"Add start node",function(){
            console.log("Add start node");
        });

        new HtmlButton(client,"Add end node",function(){
            console.log("Add end node");
        });

        new HtmlButton(client,"Reset grid",function(){
            for(let y:number=0; y<this.map.height; y++){
                for(let x:number=0; x<this.map.width; x++){
                    let currentNode = this.map.grid[y][x];
                    currentNode.setWalkable(true);
                    currentNode.setGCost(0);
                    currentNode.setHCost(0);
                }
            }
        }.bind(this));
    }

    // Will be executed each frame the mouse position has changed
    private mouseMove(){
        // We first check if the cursor is inside the canvas area
        this.cursorOutOfBounds = !(this.mouseX>=0 && this.mouseX<this.map.width*this.map.cellSize && this.mouseY>=0 && this.mouseY<this.map.height*this.map.cellSize);

        // If the cursor is inside the canvas area
        if(!this.cursorOutOfBounds){
            // We set the hovered node
            let hoveredNode = this.map.grid[Math.floor(this.mouseY/this.map.cellSize)][Math.floor(this.mouseX/this.map.cellSize)];

            // If the hovered node isn't the focused one, we don't do anything
            if(hoveredNode && hoveredNode!=this.nodeFocused){
                // If the focus was on a previous node
                if(this.nodeFocused){
                    // We set it's hover attribute to false
                    this.nodeFocused.setHover(false);
                }

                // The node the client is focused is the hover node
                this.nodeFocused = hoveredNode;

                // We set the hover attribute of the hovered Node to true
                this.nodeFocused.setHover(true);

                // Edit node if mouse down
                if(this.mouseIsDown){
                    this.editNode();
                }
            }
        }
        else{
            if(this.nodeFocused){
                this.nodeFocused.setHover(false);
                this.nodeFocused = null;
            }
        }
    }

    // Executed when mouseup javascript event is executed
    private mouseUp(){
        this.mouseIsDown=false;
    }

    // Executed when mousedown javascript event is executed
    private mouseDown(){
        this.mouseIsDown=true;
        this.editNode();
    }

    // Will be executed on click
    private click(){
    }

    // Edit focused node
    private editNode(){
        if(this.nodeFocused)
            this.nodeFocused.setWalkable(false);
    }

    public draw(){
        for(let y:number=0; y<this.map.height; y++){
            for(let x:number=0; x<this.map.width; x++){
                let currentNode = this.map.grid[y][x];
                currentNode.draw();
            }
        }
    }

    drawEmptyCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}