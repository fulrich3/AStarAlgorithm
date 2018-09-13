export default class Grid {
    width: number = 20;
    height: number = 20;
    canvas: HTMLCanvasElement;
    ctx: any;

    constructor(width:number,height:number){
        this.width = width;
        this.height = height;
    }

    createHtmlCanvas(tagId?:string){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        
        if(tagId == undefined){
            document.body.appendChild(this.canvas);
        }else{
            document.getElementById(tagId).appendChild(this.canvas);
        }
        
    }
}