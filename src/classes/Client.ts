import Map from './Map';
import Node from './Node';

export default class Client{
    map:Map;
    mouseX:number = 0;
    mouseY:number = 0;
    nodeFocused:Node;
    mouseIsDown:boolean = false;
    cursorOutOfBounds:boolean = false;

    constructor(map:Map){
        this.map = map;

        // Listener for mouse move event
        window.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - this.map.canvas.offsetLeft;
            this.mouseY = e.clientY - this.map.canvas.offsetTop;

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
            }
        }
        
    }

    private mouseUp(){
        this.mouseIsDown=false;
        this.editNode();
    }

    private mouseDown(){
        this.mouseIsDown=true;
        this.editNode();
    }

    // Will be executed on click (doesn't work yet)
    private click(){
        // Toggle node solid mode
        if(!this.cursorOutOfBounds && this.nodeFocused){
            // Set Value 
            this.nodeFocused.setWalkable(!this.nodeFocused.walkable);
        }
    }

    private editNode(){
        this.nodeFocused.setWalkable(false);
    }
}