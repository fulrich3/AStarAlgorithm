export default function pointDistance(x1:number,y1:number,x2:number,y2:number){
    var a = x1 - x2, b = y1 - y2;
    return Math.sqrt( a*a + b*b );
}