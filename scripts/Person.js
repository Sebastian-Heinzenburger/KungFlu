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

    //Check if gonna die
    if (this.state == HEALTH.INFECTIOUS || this.state == HEALTH.INFECTED) {
      this.virus.tToDie--;
      if (this.virus.tToDie == 0) {
        if (random(1)<this.virus.mortalityRate) {
          this.state = HEALTH.DEAD;
        } else {
          this.state = HEALTH.IMMUNE;
        }
      }
    }

    //check if its time to start sneezing
    if (this.state == HEALTH.INFECTED) {
      this.virus.tToInfectious--;
      if (this.virus.tToInfectious == 0) {
        this.state = HEALTH.INFECTIOUS;
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
          if (person.state == HEALTH.HEALTHY){
            person.infectWith(this.virus.get());
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

  infectWith(virus) {
    //infect self with given Virus
    this.virus = virus;
    this.state = HEALTH.INFECTED;
  }

  isOutsideX(p) {
    return p.x < 0 || p.x > windowWidth;
  }

  isOutsideY(p) {
    return p.y < 0 || p.y > windowHeight;
  }

  draw() {
    simulationGRaphics.fill(this.getHealthColor());
    simulationGRaphics.ellipse(this.position.x, this.position.y, 30, 30);
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
      case HEALTH.INFECTED:
        return color(0, 100, 0);      //dark green
      case HEALTH.INFECTIOUS:
        return color(0, 255, 0);    //yellow?
      case HEALTH.DEAD:
        return color(10, 10, 10);     //black
    }
  }

}
