///<reference path="Tsketch.ts"/>
var obstacles;
var baseNodeIndexes = [];
var Obstacle = /** @class */ (function () {
    // @ts-ignore
    function Obstacle(x, y, w, h, i, o) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.i = i;
        this.o = o;
        if (this.w % 1 !== 0 || this.h % 1 !== 0)
            return;
        //try to find each corresponding node inside the Obstacle
        for (var w_1 = 0; w_1 < this.w; w_1++) {
            for (var h_1 = 0; h_1 < this.h; h_1++) {
                baseNodeIndexes.push([x + w_1, y + h_1]);
            }
        }
    }
    Obstacle.prototype.draw = function () {
        if (!this.x)
            return;
        fill(this.i);
        stroke(this.o);
        rect(this.x * nodeSize, this.y * nodeSize, this.w * nodeSize, this.h * nodeSize, 5);
    };
    return Obstacle;
}());
function setupBackground() {
    var _x = 0;
    var _y = 0;
    obstacles = [];
    //Wände
    //Wände
    obstacles.push(new Obstacle(1, 1, 31, 1, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(1, 1, 1, 20, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(31, 1, 1, 20, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(1, 20, 13, 1, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(17, 20, 15, 1, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(1, 11, 9, 1, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(22, 11, 10, 1, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(9, 1, 1, 9, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(22, 1, 1, 9, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(9, 11, 1, 8, color(0, 0, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(22, 11, 1, 8, color(0, 0, 0), color(0, 0, 0)));
    //Taffel
    obstacles.push(new Obstacle(5, 2, 2, 0.2, color(0, 153, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(5, 2, 2, 0.2, color(0, 153, 0), color(0, 0, 0)));
    //Tische
    //Pult
    obstacles.push(new Obstacle(5, 3, 2, 1, color(150, 80, 50), color(0, 0, 0)));
    obstacles.push(new Obstacle(4, 13, 3, 1, color(150, 80, 50), color(0, 0, 0)));
    obstacles.push(new Obstacle(24, 3, 2, 1, color(150, 80, 50), color(0, 0, 0)));
    obstacles.push(new Obstacle(26, 13, 2, 1, color(150, 80, 50), color(0, 0, 0)));
    //Schüler
    obstacles.push(new Obstacle(2, 4, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(5, 4, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(7, 4, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(2, 6, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(4, 6, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(7, 6, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(2, 8, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(5, 8, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(7, 8, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(2, 12, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(2, 14, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(2, 16, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(2, 18, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(8, 12, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(8, 14, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(8, 16, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(8, 18, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(4, 18, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(6, 18, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(4, 16, 2, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(6, 16, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(24, 4, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(25, 4, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(24, 7, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(25, 7, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(29, 4, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(28, 4, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(28, 7, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(29, 7, 1, 2, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(25, 13, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(25, 14, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(25, 15, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(25, 16, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(28, 16, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(28, 15, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(28, 14, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    obstacles.push(new Obstacle(28, 13, 1, 1, color(110, 80, 10), color(0, 0, 0)));
    //sonstiges ka vieleicht schränke
    obstacles.push(new Obstacle(30, 12, 1, 8, color(102, 51, 0), color(0, 0, 0)));
    obstacles.push(new Obstacle(23, 12, 1, 6, color(102, 51, 0), color(0, 0, 0)));
    // obstacles.push(new Obstacle(1+_x, globalNodes[0].length-4+_y, 1, 2, color(80, 20, 80), color(40, 10, 40)));
    // obstacles.push(new Obstacle(3+_x, globalNodes[0].length-4+_y, 1, 2, color(80, 20, 80), color(40, 10, 40)));
}
function drawBackground() {
    for (var _i = 0, obstacles_1 = obstacles; _i < obstacles_1.length; _i++) {
        var o = obstacles_1[_i];
        o.draw();
    }
}
