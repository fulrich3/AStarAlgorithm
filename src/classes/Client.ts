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

    private editMode:number = 0;

    // HTML elements
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    parentHtmlElement: HTMLElement;

    // Stroke colors
    public static readonly colorStroke:string = "#111";
    public static readonly colorStrokeHover:string = "#AAA";

    // Fill colors
    public static readonly colorFillNormal:string = "#fff";
    public static readonly colorFillSolid:string = "#161616";
    public static readonly colorFillStart:string = "red";
    public static readonly colorFillGoal:string = "green";

    // Text colors
    public static readonly colorTextNormal:string = "#000";

    // Edit modes
    public static readonly EDIT_MODE_EMPTY:number = 0;
    public static readonly EDIT_MODE_WALKABLE:number = 1;
    public static readonly EDIT_MODE_START:number = 2;
    public static readonly EDIT_MODE_GOAL:number = 3;

    // Font
    public static readonly FONT:string = "Courrier New";

    // Editor inputs list
    private inputElementsList:Array<any> = [];

    constructor(map:Map,parentHtmlElement:HTMLElement){
        this.map = map;

        // Create canvas element
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.backgroundColor = "gray";
        this.canvas.width = this.map.width * this.map.getCellSize();
        this.canvas.height = this.map.height * this.map.getCellSize();

        // Selection of the canvas's parent HTML element
        this.parentHtmlElement = parentHtmlElement;

        this.init();
    }

    init(){
        let client = this;

        // Append canvas to the selected HTML element
        this.parentHtmlElement.appendChild(this.canvas);

        // Listener for right click
        /*
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            console.log("Click droit!");
        });
        */

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
        this.inputElementsList.push(new HtmlButton(client,"Delete walls",true,function(){
            this.editMode = Client.EDIT_MODE_EMPTY;
        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(client,"Add walls",true,function(){
            this.editMode = Client.EDIT_MODE_WALKABLE;
        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(client,"Add start node",true,function(){
            this.editMode = Client.EDIT_MODE_START;
        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(client,"Add end node",true,function(){
            this.editMode = Client.EDIT_MODE_GOAL;
        }.bind(this)));

        // Reset grid button
        new HtmlButton(client,"Reset grid",false,function(){
            this.map.setGoalNode(null);
            this.map.setStartNode(null);

            for(let y:number=0; y<this.map.height; y++){
                for(let x:number=0; x<this.map.width; x++){
                    let currentNode = this.map.grid[y][x];
                    currentNode.setWalkable(true);
                    currentNode.setGCost(0);
                    currentNode.setHCost(0);
                }
            }
        }.bind(this));

        this.inputElementsList.push(new HtmlButton(client,"Run",true,function(){
            console.log("Start pathfinding algorithm");
        }.bind(this)));
    }

    public deactivateButtons(){
        this.inputElementsList.forEach(element => {
            if(element instanceof HtmlButton){
                element.deactivate();
            }
        });
    }

    // Will be executed each frame the mouse position has changed
    private mouseMove(){
        // We first check if the cursor is inside the canvas area
        this.cursorOutOfBounds = !(this.mouseX>=0 && this.mouseX<this.map.width*this.map.getCellSize() && this.mouseY>=0 && this.mouseY<this.map.height*this.map.getCellSize());

        // If the cursor is inside the canvas area
        if(!this.cursorOutOfBounds){
            // We set the hovered node
            let hoveredNode = this.map.grid[Math.floor(this.mouseY/this.map.getCellSize())][Math.floor(this.mouseX/this.map.getCellSize())];

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
        if(this.nodeFocused){
            switch(this.editMode){
                case Client.EDIT_MODE_EMPTY:
                    this.nodeFocused.setWalkable(true);
                    break;
                case Client.EDIT_MODE_WALKABLE:
                    this.nodeFocused.setWalkable(false);
                    break;
                case Client.EDIT_MODE_START:
                    this.map.setStartNode(this.nodeFocused);
                    break;
                case Client.EDIT_MODE_GOAL:
                    this.map.setGoalNode(this.nodeFocused);
                    break;

            }
        }
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