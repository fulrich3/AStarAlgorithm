import Pathfinder from './Pathfinder';
import Node from './Node';
import HtmlButton from './client/HtmlButton';

var functions = require('./functions');
const imgArrow = require('../img/arrow.png');

export default class HtmlPathfinderEditor{
    private pathfinder:Pathfinder;
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
    private static readonly colorStroke:string = "#111";
    private static readonly colorStrokeHover:string = "#AAA";

    // Fill colors
    private static readonly colorFillNormal:string = "#fff";
    private static readonly colorFillSolid:string = "#161616";
    private static readonly colorFillStart:string = "#63c2ff";
    private static readonly colorFillGoal:string = "#63c2ff";
    private static readonly colorFillOpen:string = "#7fbf7f";
    private static readonly colorFillClosed:string = "#ff7f7f";
    private static readonly colorFillPath:string = "purple";

    // Text colors
    private static readonly colorTextNormal:string = "#000";

    // Edit modes
    private static readonly EDIT_MODE_EMPTY:number = 0;
    private static readonly EDIT_MODE_WALKABLE:number = 1;
    private static readonly EDIT_MODE_START:number = 2;
    private static readonly EDIT_MODE_GOAL:number = 3;

    // Font
    public static readonly FONT:string = "Courrier New";

    // Node display mode
    public static readonly NODE_DISPLAY_MODE:number = 2;

    constructor(pathfinder:Pathfinder,parentHtmlElement:HTMLElement){
        this.pathfinder = pathfinder;

        // Create canvas element
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.backgroundColor = "gray";
        this.canvas.width = this.pathfinder.getWidth() * this.pathfinder.getCellSize();
        this.canvas.height = this.pathfinder.getHeight() * this.pathfinder.getCellSize();

        // Selection of the canvas's parent HTML element
        this.parentHtmlElement = parentHtmlElement;

        this.init();
        this.draw();
    }

    init(){
        let htmlPathfinderEditor = this;

        this.pathfinder.setHtmlPathfinderEditor(htmlPathfinderEditor);

        // Append canvas to the selected HTML element
        this.parentHtmlElement.appendChild(this.canvas);

        // Listener for mouse move event
        window.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - this.canvas.offsetLeft + window.pageXOffset;
            this.mouseY = e.clientY - this.canvas.offsetTop + window.pageYOffset;

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
        this.inputElementsList.push(new HtmlButton(htmlPathfinderEditor,"Supprimer solide",true,function(){
            this.editMode = HtmlPathfinderEditor.EDIT_MODE_EMPTY;
        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(htmlPathfinderEditor,"Ajouter solide",true,function(){
            this.editMode = HtmlPathfinderEditor.EDIT_MODE_WALKABLE;
        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(htmlPathfinderEditor,"Ajouter case de départ",true,function(){
            this.editMode = HtmlPathfinderEditor.EDIT_MODE_START;
        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(htmlPathfinderEditor,"Ajouter case d'arrivée",true,function(){
            this.editMode = HtmlPathfinderEditor.EDIT_MODE_GOAL;
        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(htmlPathfinderEditor,"Prochaine itération",false,function(){
            this.pathfinder.aStarExecuteNextStep();
            // Draw every open & closed nodes
            this.drawOpenAndClosedList();
        }.bind(this)));

        this.inputElementsList.push(new HtmlButton(htmlPathfinderEditor,"Trouver le chemin",false,function(){
            this.pathfinder.getPath();
            this.drawOpenAndClosedList();
        }.bind(this)));
        
        // Reset grid button
        new HtmlButton(htmlPathfinderEditor,"Reset",false,function(){
            this.pathfinder.init();
            this.draw();
        }.bind(this));
    }

    // Accessors
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
        this.cursorOutOfBounds = !(this.mouseX>=0 && this.mouseX<this.pathfinder.getWidth()*this.pathfinder.getCellSize() && this.mouseY>=0 && this.mouseY<this.pathfinder.getHeight()*this.pathfinder.getCellSize());

        // If the cursor is inside the canvas area
        if(!this.cursorOutOfBounds){
            // We set the hovered node
            let hoveredNode = this.pathfinder.getNodeAtPosition(Math.floor(this.mouseX/this.pathfinder.getCellSize()),Math.floor(this.mouseY/this.pathfinder.getCellSize()));

            // If the hovered node isn't the focused one, we don't do anything
            if(hoveredNode && hoveredNode!=this.nodeFocused){
                // If the focus was on a previous node
                if(this.nodeFocused){
                    // We set it's hover attribute to false
                    this.nodeFocused.setHover(false);
                    this.drawNode( this.nodeFocused );
                }

                // The node the htmlPathfinderEditor is focused is the hover node
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
                case HtmlPathfinderEditor.EDIT_MODE_EMPTY:
                    this.nodeFocused.setWalkable(true);

                    break;
                case HtmlPathfinderEditor.EDIT_MODE_WALKABLE:
                    this.nodeFocused.setWalkable(false);
                    break;
                case HtmlPathfinderEditor.EDIT_MODE_START:
                    // We get the current position of the start node to erase it later
                    let oldStartNode:Node = this.pathfinder.getNodeAtPosition(this.pathfinder.getStartNode().getGridPosition().x,this.pathfinder.getStartNode().getGridPosition().y);
                    // We set the new start node
                    this.pathfinder.setStartNode(this.nodeFocused);
                    // Erase old start node
                    this.drawNode(oldStartNode);
                    break;
                case HtmlPathfinderEditor.EDIT_MODE_GOAL:
                    // We get the current position of the goal node to erase it later
                    let oldGoalNode:Node = this.pathfinder.getNodeAtPosition(this.pathfinder.getGoalNode().getGridPosition().x,this.pathfinder.getGoalNode().getGridPosition().y);
                    // We set the new goal node
                    this.pathfinder.setGoalNode(this.nodeFocused);
                    // Erase old goal node
                    this.drawNode(oldGoalNode);
                    break;
            }

            // Draw focused node
            this.drawNode(this.nodeFocused);
        }
    }

    // Draw every open & closed nodes
    public drawOpenAndClosedList(){
        this.pathfinder.getOpenList().forEach(function(node:Node) {
            this.drawNode(node);
        }.bind(this));

        this.pathfinder.getClosedList().forEach(function(node:Node,index:number) {
            this.drawNode(node);
        }.bind(this));
    }

    public draw(){
        for(let y:number=0; y<this.pathfinder.getHeight(); y++){
            for(let x:number=0; x<this.pathfinder.getWidth(); x++){
                let currentNode = this.pathfinder.getNodeAtPosition(x,y);
                this.drawNode(currentNode);
            }
        }
    }

    public drawNode(node:Node){
        if(this.pathfinder.getHtmlPathfinderEditor()){
            let ctx = this.pathfinder.getHtmlPathfinderEditor().getCtx();

            ctx.beginPath();
            // Set draw area for the node
            ctx.rect(node.getWorldPosition().x,node.getWorldPosition().y,this.pathfinder.getCellSize(),this.pathfinder.getCellSize());

            // Set fill color
            if(!node.getWalkable()){
                // Unwalkable node
                ctx.fillStyle = HtmlPathfinderEditor.colorFillSolid;
            }else{
                // Walkable node
                if(node.inPathList()){
                    // Set color for closed node
                    ctx.fillStyle = HtmlPathfinderEditor.colorFillPath;
                }else if(node.isStartNode()){
                    // Set color for start node
                    ctx.fillStyle = HtmlPathfinderEditor.colorFillStart;
                }else if(node.isGoalNode()){
                    // Set color for goal node
                    ctx.fillStyle = HtmlPathfinderEditor.colorFillGoal;
                }else if(node.inOpenList()){
                    // Set color for open node
                    ctx.fillStyle = HtmlPathfinderEditor.colorFillOpen;
                }else if(node.inClosedList()){
                    // Set color for closed node
                    ctx.fillStyle = HtmlPathfinderEditor.colorFillClosed;
                }else{
                    // Set color for normal node
                    ctx.fillStyle = HtmlPathfinderEditor.colorFillNormal;
                }
                
            }
            ctx.fill();

            // Stroke
            if(!node.getHover()){
                ctx.strokeStyle = HtmlPathfinderEditor.colorStroke;
            }else{
                ctx.strokeStyle = HtmlPathfinderEditor.colorStrokeHover;
            }

            // Draw stroke of node
            ctx.lineWidth = 2;
            ctx.stroke();

            //Draw text
            ctx.fillStyle = HtmlPathfinderEditor.colorTextNormal;
            ctx.textBaseline="middle";
            ctx.textAlign="center";

            if(node.isStartNode() || node.isGoalNode()){
                ctx.font = "13px " + HtmlPathfinderEditor.FONT;
                if(node.isStartNode()){
                    ctx.fillText("Start" , node.getWorldPosition().x + this.pathfinder.getCellSize()/2 , node.getWorldPosition().y + this.pathfinder.getCellSize()/2);
                }else if(node.isGoalNode()){
                    ctx.fillText("Goal" , node.getWorldPosition().x + this.pathfinder.getCellSize()/2 , node.getWorldPosition().y + this.pathfinder.getCellSize()/2);
                }
            }else{
                switch(HtmlPathfinderEditor.NODE_DISPLAY_MODE){
                    case 0 :
                        if(node.inOpenList() || node.inClosedList()){
                            ctx.font = "16px " + HtmlPathfinderEditor.FONT;
                            // Display FCost
                            if(node.getFCost())
                                ctx.fillText((node.getFCost()).toString() , node.getWorldPosition().x + this.pathfinder.getCellSize()/2 , node.getWorldPosition().y + this.pathfinder.getCellSize()/2);
        
                            ctx.font = "10px " + HtmlPathfinderEditor.FONT;
                            // Display GCost
                            if(node.getGCost())
                                ctx.fillText( (node.getGCost()).toString() , node.getWorldPosition().x + 8 , node.getWorldPosition().y + 8);
        
                            // Display HCost
                            if(node.getHCost()){
                                ctx.fillText( (node.getHCost()).toString() , node.getWorldPosition().x + this.pathfinder.getCellSize() - 8 , node.getWorldPosition().y + 4);

                                let drawAngle:number = functions.pointAngleRad(node.getGridPosition(),node.getPreviousNeighbour().getGridPosition());
                                
                                let arrowPosition = {
                                    x: node.getWorldPosition().x + this.pathfinder.getCellSize()/2,
                                    y: node.getWorldPosition().y + this.pathfinder.getCellSize()/2,
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
                        ctx.font = "10px " + HtmlPathfinderEditor.FONT;

                        // Display FCost
                        if(node.getFCost()){
                            ctx.fillText((node.getFCost()).toString() , node.getWorldPosition().x + this.pathfinder.getCellSize()/2 , node.getWorldPosition().y + 8);

                            // Display image
                            var img = new Image();
                            img.onload = function() {
                                ctx.save();

                                let drawAngle:number = functions.pointAngleRad(node.getGridPosition(),node.getParent().getGridPosition());
                                
                                let arrowPosition = {
                                    x: node.getWorldPosition().x + this.pathfinder.getCellSize()/2,
                                    y: node.getWorldPosition().y + this.pathfinder.getCellSize()/2,
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
                                ctx.fillText( (node.getGCost()).toString() , node.getWorldPosition().x + 8 , node.getWorldPosition().y + this.pathfinder.getCellSize()-8 );

                            // Display HCost
                            if(node.getHCost())
                                ctx.fillText( (node.getHCost()).toString() , node.getWorldPosition().x + this.pathfinder.getCellSize() - 8 , node.getWorldPosition().y + this.pathfinder.getCellSize()-8 );
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
                                    x: node.getWorldPosition().x + this.pathfinder.getCellSize()/2,
                                    y: node.getWorldPosition().y + this.pathfinder.getCellSize()/2,
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