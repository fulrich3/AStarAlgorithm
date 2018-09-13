import Map from './Map';

export default class Client{
    map:Map;
    mouseX:number = 0;
    mouseY:number = 0;

    constructor(map:Map){
        this.map = map;

        window.addEventListener("mousemove", () => {
            console.log(this.updateMousePosition());
        });
    }

    //updateMousePosition(event:MouseEvent){
    updateMousePosition(){
        /*
        var mouseX = event.clientX + this.map.canvas.offsetLeft;
        var mouseY = event.clientY + this.map.canvas.offsetTop;
*/
        console.log(this);
        //console.log(mouseX,mouseY);
    }
}