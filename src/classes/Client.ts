import Map from './Map';
import Node from './Node';
import HtmlButton from './client/HtmlButton';

var functions = require('./functions');
const imgArrow = require('../img/arrow.png');

export default class Client{
    private map:Map;
    private mouseX:number = 0;
    private mouseY:number = 0;
    private nodeFocused:Node;
    private mouseIsDown:boolean = false;
    private cursorOutOfBounds:boolean = false;

    private editMode:number = 0;

    // HTML elements
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private parentHtmlElement: HTMLElement;


    // Editor inputs list
    private inputElementsList:Array<any> = [];

    /*
    ==================
    Static attributes
    ==================
    */

    // Stroke colors
    public static readonly colorStroke:string = "#111";
    public static readonly colorStrokeHover:string = "#AAA";

    // Fill colors
    public static readonly colorFillNormal:string = "#fff";
    public static readonly colorFillSolid:string = "#161616";
    public static readonly colorFillStart:string = "#63c2ff";
    public static readonly colorFillGoal:string = "#63c2ff";
    public static readonly colorFillOpen:string = "#7fbf7f";
    public static readonly colorFillClosed:string = "#ff7f7f";
    public static readonly colorFillPath:string = "purple";

    // Text colors
    public static readonly colorTextNormal:string = "#000";

    // Edit modes
    public static readonly EDIT_MODE_EMPTY:number = 0;
    public static readonly EDIT_MODE_WALKABLE:number = 1;
    public static readonly EDIT_MODE_START:number = 2;
    public static readonly EDIT_MODE_GOAL:number = 3;

    // Font
    public static readonly FONT:string = "Courrier New";

    // Node display mode
    public static readonly NODE_DISPLAY_MODE:number = 2;

    constructor(map:Map,parentHtmlElement:HTMLElement){
        this.map = map;

        // Create canvas element
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.backgroundColor = "gray";
        this.canvas.width = this.map.getWidth() * this.map.getCellSize();
        this.canvas.height = this.map.getHeight() * this.map.getCellSize();

        // Selection of the canvas's parent HTML element
        this.parentHtmlElement = parentHtmlElement;

        this.init();
    }

    init(){
        let client = this;

        // Append canvas to the selected HTML element
        this.parentHtmlElement.appendChild(this.canvas);

        // Listener for mouse move event
        window.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - this.canvas.offsetLeft;
            this.mouseY = e.clientY - this.canvas.offsetTop;

            this.mouseMove();
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

        this.inputElementsList.push(new HtmlButton(client,"Add goal node",true,function(){
            this.editMode = Client.EDIT_MODE_GOAL;
        }.bind(this)));

        // Reset grid button
        new HtmlButton(client,"Reset grid",false,function(){
            this.map.setGoalNode(null);
            this.map.setStartNode(null);

            for(let y:number=0; y<this.map.height; y++){
                for(let x:number=0; x<this.map.getWidth(); x++){
                    let currentNode = this.map.grid[y][x];
                    currentNode.setWalkable(true);
                }
            }

            this.draw();
        }.bind(this));

        this.inputElementsList.push(new HtmlButton(client,"Next step",false,function(){
            this.map.aStarExecuteNextStep();

            // Draw every open & closed nodes
            this.map.getOpenList().forEach(function(node:Node) {
                this.drawNode(node);
            }.bind(this));

            this.map.getClosedList().forEach(function(node:Node,index:number) {
                this.drawNode(node);
            }.bind(this));

        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(client,"Next step",false,function(){
            this.map.aStarExecuteNextStep();

            // Draw every open & closed nodes
            this.map.getOpenList().forEach(function(node:Node) {
                this.drawNode(node);
            }.bind(this));

            this.map.getClosedList().forEach(function(node:Node,index:number) {
                this.drawNode(node);
            }.bind(this));

        }.bind(this)));
    }

    // Accessor
    public getCtx(){
        return this.ctx;
    }

    public getParentHtmlElement(){
        return this.parentHtmlElement;
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
        this.cursorOutOfBounds = !(this.mouseX>=0 && this.mouseX<this.map.getWidth()*this.map.getCellSize() && this.mouseY>=0 && this.mouseY<this.map.getHeight()*this.map.getCellSize());

        // If the cursor is inside the canvas area
        if(!this.cursorOutOfBounds){
            // We set the hovered node
            //let hoveredNode = this.map.grid[Math.floor(this.mouseY/this.map.getCellSize())][Math.floor(this.mouseX/this.map.getCellSize())];
            let hoveredNode = this.map.getNodeAtPosition(Math.floor(this.mouseX/this.map.getCellSize()),Math.floor(this.mouseY/this.map.getCellSize()));

            // If the hovered node isn't the focused one, we don't do anything
            if(hoveredNode && hoveredNode!=this.nodeFocused){
                // If the focus was on a previous node
                if(this.nodeFocused){
                    // We set it's hover attribute to false
                    this.nodeFocused.setHover(false);
                    this.drawNode( this.nodeFocused );
                }

                // The node the client is focused is the hover node
                this.nodeFocused = hoveredNode;

                // We set the hover attribute of the hovered Node to true
                this.nodeFocused.setHover(true);
                this.drawNode( this.nodeFocused );

                // Edit node if mouse down
                if(this.mouseIsDown){
                    this.editNode();
                }
            }
        }
        else{
            if(this.nodeFocused){
                this.nodeFocused.setHover(false);
                this.drawNode( this.nodeFocused );
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
                    // We get the current position of the start node to erase it later
                    let oldStartNode:Node = this.map.getNodeAtPosition(this.map.getStartNode().getGridPosition().x,this.map.getStartNode().getGridPosition().y);
                    // We set the new start node
                    this.map.setStartNode(this.nodeFocused);
                    // Erase old start node
                    this.drawNode(oldStartNode);
                    break;
                case Client.EDIT_MODE_GOAL:
                    // We get the current position of the goal node to erase it later
                    let oldGoalNode:Node = this.map.getNodeAtPosition(this.map.getGoalNode().getGridPosition().x,this.map.getGoalNode().getGridPosition().y);
                    // We set the new goal node
                    this.map.setGoalNode(this.nodeFocused);
                    // Erase old goal node
                    this.drawNode(oldGoalNode);
                    break;
            }

            // Draw focused node
            this.drawNode(this.nodeFocused);
        }
    }

    public draw(){
        for(let y:number=0; y<this.map.getHeight(); y++){
            for(let x:number=0; x<this.map.getWidth(); x++){
                let currentNode = this.map.getNodeAtPosition(x,y);
                this.drawNode(currentNode);
            }
        }
    }

    public drawNode(node:Node){
        if(this.map.getClient()){
            let ctx = this.map.getClient().getCtx();

            ctx.beginPath();
            // Set draw area for the node
            ctx.rect(node.getWorldPosition().x,node.getWorldPosition().y,this.map.getCellSize(),this.map.getCellSize());

            // Set fill color
            if(!node.getWalkable()){
                // Unwalkable node
                ctx.fillStyle = Client.colorFillSolid;
            }else{
                // Walkable node
                
                if(node.inPathList()){
                    // Set color for closed node
                    ctx.fillStyle = Client.colorFillPath;
                }else if(node.isStartNode()){
                    // Set color for start node
                    ctx.fillStyle = Client.colorFillStart;
                }else if(node.isGoalNode()){
                    // Set color for goal node
                    ctx.fillStyle = Client.colorFillGoal;
                }else if(node.inOpenList()){
                    // Set color for open node
                    ctx.fillStyle = Client.colorFillOpen;
                }else if(node.inClosedList()){
                    // Set color for closed node
                    ctx.fillStyle = Client.colorFillClosed;
                }else{
                    // Set color for normal node
                    ctx.fillStyle = Client.colorFillNormal;
                }
                
            }
            ctx.fill();

            // Stroke
            if(!node.getHover()){
                ctx.strokeStyle = Client.colorStroke;
            }else{
                ctx.strokeStyle = Client.colorStrokeHover;
            }

            // Draw stroke of node
            ctx.lineWidth = 2;
            ctx.stroke();

            //Draw text
            ctx.fillStyle = Client.colorTextNormal;
            ctx.textBaseline="middle";
            ctx.textAlign="center";

            if(node.isStartNode() || node.isGoalNode()){
                ctx.font = "13px " + Client.FONT;
                if(node.isStartNode()){
                    ctx.fillText("Start" , node.getWorldPosition().x + this.map.getCellSize()/2 , node.getWorldPosition().y + this.map.getCellSize()/2);
                }else if(node.isGoalNode()){
                    ctx.fillText("Goal" , node.getWorldPosition().x + this.map.getCellSize()/2 , node.getWorldPosition().y + this.map.getCellSize()/2);
                }
            }else{
                switch(Client.NODE_DISPLAY_MODE){
                    case 0 :
                        if(node.inOpenList() || node.inClosedList()){
                            ctx.font = "16px " + Client.FONT;
                            // Display FCost
                            if(node.getFCost())
                                ctx.fillText((node.getFCost()).toString() , node.getWorldPosition().x + this.map.getCellSize()/2 , node.getWorldPosition().y + this.map.getCellSize()/2);
        
                            ctx.font = "10px " + Client.FONT;
                            // Display GCost
                            if(node.getGCost())
                                ctx.fillText( (node.getGCost()).toString() , node.getWorldPosition().x + 8 , node.getWorldPosition().y + 8);
        
                            // Display HCost
                            if(node.getHCost()){
                                ctx.fillText( (node.getHCost()).toString() , node.getWorldPosition().x + this.map.getCellSize() - 8 , node.getWorldPosition().y + 4);

                                let drawAngle:number = functions.pointAngleRad(node.getGridPosition(),node.getPreviousNeighbour().getGridPosition());
                                
                                let arrowPosition = {
                                    x: node.getWorldPosition().x + this.map.getCellSize()/2,
                                    y: node.getWorldPosition().y + this.map.getCellSize()/2,
                                };

                                ctx.translate(arrowPosition.x,arrowPosition.y);
                                ctx.rotate(drawAngle);
                                ctx.translate(-arrowPosition.x,-arrowPosition.y);

                                ctx.drawImage(img, arrowPosition.x - img.width/2 , arrowPosition.y - img.height/2);
                                
                                ctx.restore();
                            }
                        }
                        break;
                    case 1 :
                        ctx.font = "10px " + Client.FONT;

                        // Display FCost
                        if(node.getFCost()){
                            ctx.fillText((node.getFCost()).toString() , node.getWorldPosition().x + this.map.getCellSize()/2 , node.getWorldPosition().y + 8);

                            // Display image
                            var img = new Image();
                            img.onload = function() {
                                ctx.save();

                                let drawAngle:number = functions.pointAngleRad(node.getGridPosition(),node.getParent().getGridPosition());
                                
                                let arrowPosition = {
                                    x: node.getWorldPosition().x + this.map.getCellSize()/2,
                                    y: node.getWorldPosition().y + this.map.getCellSize()/2,
                                };

                                ctx.translate(arrowPosition.x,arrowPosition.y);
                                ctx.rotate(drawAngle);
                                ctx.translate(-arrowPosition.x,-arrowPosition.y);

                                ctx.drawImage(img, arrowPosition.x - img.width/2 , arrowPosition.y - img.height/2);
                                
                                ctx.restore();
                            }.bind(this);
                            img.src = imgArrow;

                            // Display GCost
                            if(node.getGCost())
                                ctx.fillText( (node.getGCost()).toString() , node.getWorldPosition().x + 8 , node.getWorldPosition().y + this.map.getCellSize()-8 );

                            // Display HCost
                            if(node.getHCost())
                                ctx.fillText( (node.getHCost()).toString() , node.getWorldPosition().x + this.map.getCellSize() - 8 , node.getWorldPosition().y + this.map.getCellSize()-8 );
                            }
                        break;
                    case 2 :
                        // Display arrow
                        if(node.getParent()){
                            var img = new Image();
                            img.onload = function() {
                                ctx.save();

                                let drawAngle:number = functions.pointAngleRad(node.getGridPosition(),node.getParent().getGridPosition());
                                
                                let arrowPosition = {
                                    x: node.getWorldPosition().x + this.map.getCellSize()/2,
                                    y: node.getWorldPosition().y + this.map.getCellSize()/2,
                                };

                                ctx.translate(arrowPosition.x,arrowPosition.y);
                                ctx.rotate(drawAngle);
                                ctx.translate(-arrowPosition.x,-arrowPosition.y);

                                ctx.drawImage(img, arrowPosition.x - img.width/2 , arrowPosition.y - img.height/2);
                                
                                ctx.restore();
                            }.bind(this);

                            img.src = imgArrow;
                        }
                    break;
                }
            }

            ctx.closePath();
        }
    }
}