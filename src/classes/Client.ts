import Map from './Map';
import Node from './Node';

export default class Client{
    map:Map;
    mouseX:number = 0;
    mouseY:number = 0;

    nodeFocused:Node;

    outOfBounds:boolean = false;

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
            this.mouseClick();
        });
    }

    // Will be executed each frame the mouse position has changed
    mouseMove(){
        // We first check if the cursor is inside the canvas area
        this.outOfBounds = !(this.mouseX>=0 && this.mouseX<this.map.width*this.map.cellSize && this.mouseY>=0 && this.mouseY<this.map.height*this.map.cellSize);

        // If the cursor is inside the canvas area
        if(!this.outOfBounds){
            // We set the hovered node
            let hoveredNode = this.map.grid[Math.floor(this.mouseY/this.map.cellSize)][Math.floor(this.mouseX/this.map.cellSize)];

            // If the hovered node isn't the focused one, we don't do anything
            if(hoveredNode && hoveredNode!=this.nodeFocused){
                // If the focus was on a previous node
                if(this.nodeFocused){
                    // We set it's hover attribute to false
                    this.nodeFocused.setHover(false);
                }

                // We set the hover attribute of the hovered Node to true
                hoveredNode.setHover(true);

                // The node the client is focused is the hover node
                this.nodeFocused = hoveredNode;
            }
        }else{
            this.nodeFocused.setHover(false);
        }
    }

    // Will be executed on click (doesn't work yet)
    mouseClick(){
        // Toggle node solid mode
        if(!this.outOfBounds && this.nodeFocused){
            // Set Value 
            this.nodeFocused.setWalkable(!this.nodeFocused.walkable);
        }
    }
}