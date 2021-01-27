class Obstacle {
  constructor(x,y,w,h, i, o) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.i = i;
    this.o = o;

    for (var w = 0; w < this.w; w++) {
      for (var h = 0; h < this.h; h++) {
        globalNodes[this.x+w][this.y+h].isGood = false;
        console.log((this.x+w) + " " + (this.y+h));
      }
    }
  }

  draw() {
    if (!this.x) return;
    simulationGraphics.fill(this.i);
    simulationGraphics.stroke(this.o);
    simulationGraphics.rect(this.x*nodeSize-10, this.y*nodeSize-10, this.w*nodeSize-10, this.h*nodeSize-10, 5);

  }

}

obstacles = []

function setupBackground() {

  obstacles.push(new Obstacle(1, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(3, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(5, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(7, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(9, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(11, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(13, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(15, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(17, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(19, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(21, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(23, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(25, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(27, 2, 1, 1, color(110, 80, 10), color(0, 0, 0)))


  obstacles.push(new Obstacle(2, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(4, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(6, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(8, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(10, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(12, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(14, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(16, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(18, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(20, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(22, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(24, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(26, 5, 1, 1, color(110, 80, 10), color(0, 0, 0)))


  obstacles.push(new Obstacle(1, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(3, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(5, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(7, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(9, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(11, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(13, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(15, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(17, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(19, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(21, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(23, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(25, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(27, 8, 1, 1, color(110, 80, 10), color(0, 0, 0)))

  }



function drawBackground() {
  obstacles.forEach(o => {
    o.draw();
  });

}
