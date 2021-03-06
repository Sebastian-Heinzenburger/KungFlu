class Person {

  constructor() {
    this.position = createVector(random(windowWidth), random(windowHeight));
    this.velocity = createVector(random(-1, 1), random(-1, 1)).normalize();
    this.state = HEALTH.HEALTHY;
    this.virus = null; 
  }

  update(){
    this.handleMovement();
    this.handleOthers();
    this.checkTime();
  }

  checkTime() {
    if (this.state == HEALTH.INFECTIOUS) {
      this.virus.tToDie--;
      if (this.virus.tToDie == 0) {
        this.state = HEALTH.DEAD;
      }
    }
  }

  handleOthers() {
    if (this.state==HEALTH.INFECTIOUS) {
      //cycle through every person...
      people.forEach(person => {
        //dont spontainiously self-infect
        if (person === this) return;
        //if in reach
        if (dist(person.position.x, person.position.y, this.position.x, this.position.y) < 30) {
          //and not dead
          if (person.state != HEALTH.DEAD){
            //then infect
            person.state = HEALTH.INFECTIOUS;
            //add virus
            person.virus = new Virus();
          }
        }
      });
    }
  }

  handleMovement() {
    //dont move if ya dead
    if (this.state == HEALTH.DEAD) return;
    
    let posToCheck = this.position.copy().add(this.velocity);
    
    //if outside X
    if(this.isOutsideX(posToCheck)) {
      this.velocity.x = -this.velocity.x;
    }

    //if outside Y
    if(this.isOutsideY(posToCheck)) {
      this.velocity.y = -this.velocity.y;
    }

    //now update position
    this.position.add(this.velocity);

  }

  isOutsideX(p) {
    return p.x < 0 || p.x > windowWidth;
  }

  isOutsideY(p) {
    return p.y < 0 || p.y > windowHeight;
  }

  draw() {
    fill(this.getHealthColor());
    ellipse(this.position.x, this.position.y, 30, 30);
    // fill(0);
    // text(this.virus.tToDie, this.position.x, this.position.y);
  }

  //return color according to current health
  getHealthColor() {
    switch (this.state) {
      case HEALTH.HEALTHY:
        return color(0, 0, 255);      //blue
      case HEALTH.IMMUNE:
        return color(255, 255, 0);    //yellow?
      case HEALTH.INFECTIOUS:
        return color(0, 255, 0);      //green
      case HEALTH.DEAD:
        return color(10, 10, 10);     //black
    }
  }

}
