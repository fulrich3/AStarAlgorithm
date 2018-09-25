module.exports = {
    pointDistance: function(p1:any,p2:any){
        return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
    },

    pointAngleRad: function(p1:any,p2:any){
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    },

    pointAngleDeg: function(p1:any,p2:any){
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }
};