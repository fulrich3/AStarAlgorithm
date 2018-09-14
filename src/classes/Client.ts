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

        window.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - this.map.canvas.offsetLeft;
            this.mouseY = e.clientY - this.map.canvas.offsetTop;

            this.mouseMove();
        });

        window.addEventListener("click", (e) => {
            //this.mouseClick();
        });
    }

    mouseMove(){
        this.outOfBounds = !(this.mouseX>=0 && this.mouseX<this.map.width*this.map.cellSize && this.mouseY>=0 && this.mouseY<this.map.height*this.map.cellSize);

        if(!this.outOfBounds){
            let hoveredNode = this.map.grid[Math.floor(this.mouseY/this.map.cellSize)][Math.floor(this.mouseX/this.map.cellSize)];
            if(hoveredNode){
                if(this.nodeFocused){
                    this.nodeFocused.setWalkable(false);
                }

                hoveredNode.setWalkable(true);

                this.nodeFocused = hoveredNode;
            }
        }
    }

    mouseClick(){
        console.log("Click");

        let hoveredNode = this.map.grid[Math.floor(this.mouseY/this.map.cellSize)][Math.floor(this.mouseX/this.map.cellSize)];
        hoveredNode.walkable = !hoveredNode.walkable;
        this.map.drawHtmlCanvas();
    }
}