module.exports = {
    pointDistance: function(p1:any,p2:any){
        return Math.sqrt(Math.pow((p1.x-p2.x), 2) + Math.pow((p1.y-p2.y), 2));
    },

    pointAngleRad: function(p1:any,p2:any){
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    },

    pointAngleDeg: function(p1:any,p2:any){
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }
};