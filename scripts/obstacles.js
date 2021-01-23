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
    simulationGRaphics.fill(this.i);
    simulationGRaphics.stroke(this.o);
    simulationGRaphics.rect(this.x*nodeSize, this.y*nodeSize, this.w*nodeSize, this.h*nodeSize, 5);

  }

}

obstacles = []

function setupBackground() {
  // //oben
  // obstacles.push(new Obstacle(60, 30, 100, 100, color(120, 80, 10), color(0, 0, 0)))
  // obstacles.push(new Obstacle(250, 30, 100, 100, color(120, 80, 10), color(0, 0, 0)))
  // obstacles.push(new Obstacle(440, 30, 100, 100, color(120, 80, 10), color(0, 0, 0)))
  // obstacles.push(new Obstacle(630, 30, 100, 100, color(120, 80, 10), color(0, 0, 0)))
  //
  // //eins weniger als oben
  // obstacles.push(new Obstacle(60, 130, 100, 100, color(120, 80, 10), color(0, 0, 0)))
  // obstacles.push(new Obstacle(250, 130, 100, 100, color(120, 80, 10), color(0, 0, 0)))
  // obstacles.push(new Obstacle(440, 130, 100, 100, color(120, 80, 10), color(0, 0, 0)))
  // obstacles.push(new Obstacle(630, 130, 100, 100, color(120, 80, 10), color(0, 0, 0)))
  //
  // //nicht oben
  // obstacles.push(new Obstacle(300, 200, 100, 200, color(120, 80, 10), color(0, 0, 0)))
  // obstacles.push(new Obstacle(300, 200, 100, 200, color(120, 80, 10), color(0, 0, 0)))
  // obstacles.push(new Obstacle(300, 200, 100, 200, color(120, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(1, 1, 2, 2, color(120, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(5, 1, 2, 2, color(120, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(9, 1, 2, 2, color(120, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(13, 1, 2, 2, color(120, 80, 10), color(0, 0, 0)))

  obstacles.push(new Obstacle(1, 3, 2, 2, color(120, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(5, 3, 2, 2, color(120, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(9, 3, 2, 2, color(120, 80, 10), color(0, 0, 0)))
  obstacles.push(new Obstacle(13, 3, 2, 2, color(120, 80, 10), color(0, 0, 0)))

  }



function drawBackground() {
  obstacles.forEach(o => {
    o.draw();
  });

}
