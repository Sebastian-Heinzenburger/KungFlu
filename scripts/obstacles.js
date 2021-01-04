class Obstacle {
  constructor(x,y,w,h, i, o) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.i = i;
    this.o = o;
  }

  draw() {
    if (!this.x) return;
    fill(this.i);
    stroke(this.o);
    rect(this.x, this.y, this.w, this.h, 5);
  }

}
