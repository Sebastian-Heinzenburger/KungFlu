class Person {

  constructor() {
    this.position = createVector(random(windowWidth), random(windowHeight));
    this.velocity = createVector(random(-1, 1), random(-1, 1)).normalize();
    this.state = HEALTH.HEALTHY;
    this.size = 30;
    this.localTimer = 0;
    this.infectRadius = this.size+2;
    this.currentSymptom = null;
    this.virus = null;
    this.pathFinder = new AStar();

    //create Nodes
    this.pathFinder.nodes = [];
    for (var x = 0; x < windowWidth/nodeSize; x++) {
      this.pathFinder.nodes.push([]);
      for (var y = 0; y < windowHeight/nodeSize; y++) {
        this.pathFinder.nodes[x][y] = new Node(x, y);
      }
    }

  }

  update(){
    this.handleMovement();
    this.handleOthers();
    this.checkTime();
    switch (this.state) {
      case HEALTH.HEALTHY:
          currentAnalData.HEALTHY++;
        break;
      case HEALTH.INFECTED:
          currentAnalData.INFECTED++;
        break;
      case HEALTH.INFECTIOUS:
          currentAnalData.INFECTIOUS++;
        break;
      case HEALTH.IMMUNE:
          currentAnalData.IMMUNE++;
        break;
      case HEALTH.DEAD:
          currentAnalData.DEAD++;
        break;
    }
  }

  checkTime() {

    //wenn du nicht krank bist, lebe glücklich weiter
    if (this.state != HEALTH.INFECTIOUS && this.state != HEALTH.INFECTED) return;

    //Symptome?
    if (this.state == HEALTH.INFECTIOUS) {

      //für jedes Symptom
      if (!this.currentSymptom) {
        for (var symp in this.virus.symptoms) {
          let r = random(1)
          if (r < this.virus.symptoms[symp]) {
            this.infectRadius = 60;
          }
        }
      }
    }

    //update Timer
    this.localTimer++;

    //update infectRadius
    if (this.infectRadius > this.size+2) this.infectRadius-=0.5;

    //Check if gonna die
    if (this.virus.tRekonvaleszenz + this.virus.tIncubation == this.localTimer) {
      if (random(1)<this.virus.rLetalitaet) {
        this.state = HEALTH.DEAD;
      } else {
        this.state = HEALTH.IMMUNE;
      }
    }

    //check if its time to start sneezing
    if (this.state == HEALTH.INFECTED) {
      if (this.localTimer == this.virus.tLatenz) {
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
        if (dist(person.position.x, person.position.y, this.position.x, this.position.y) < this.infectRadius) {
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

    this.pathFinder.startNode = this.pathFinder.nodes[Math.floor(this.position.x/nodeSize)][Math.floor(this.position.y/nodeSize)];
    // this.pathFinder.endNode = this.pathFinder.nodes[Math.floor(Math.random(windowWidth)/nodeSize)][Math.floor(Math.random(windowHeight)/nodeSize)];
    if(!this.pathFinder.endNode)
      this.pathFinder.endNode = this.pathFinder.nodes[Math.floor(random(windowWidth)/nodeSize)][Math.floor(random(windowHeight)/nodeSize)];
    // console.log(this.pathFinder.endNode);
    // this.pathFinder.endNode = this.pathFinder.nodes[Math.floor(mouseX/nodeSize)][Math.floor(mouseY/nodeSize)];

    if (neq(this.pathFinder.position, { x: Math.floor(this.position.x/nodeSize), y: Math.floor(this.position.y/nodeSize) }) || neq(this.pathFinder.lEndNode, this.pathFinder.endNode)) {

      this.pathFinder.lEndNode = this.pathFinder.endNode;
      this.pathFinder.position =  {
        x: Math.floor(this.position.x/nodeSize),
        y: Math.floor(this.position.y/nodeSize)
      };

      if (this.pathFinder.getPath(this.pathFinder.nodes)) {
        let n = this.pathFinder.endNode;
        this.pathFinder.nextN = this.pathFinder.endNode;
        while (n.daddy!=null && n.daddy!=this.pathFinder.startNode) {
          this.pathFinder.nextN = n;
          n = n.daddy;
        }
      } else {
        this.pathFinder.nextN = this.pathFinder.startNode;
      }
    }
    if (this.pathFinder.startNode != this.pathFinder.endNode) {
      this.velocity = createVector(this.pathFinder.nextN.x+0.5 - this.position.x/nodeSize, this.pathFinder.nextN.y+0.5 - this.position.y/nodeSize).normalize();
      this.position.add(this.velocity);
    } else {
      this.pathFinder.endNode = this.pathFinder.nodes[Math.floor(random(windowWidth)/nodeSize)][Math.floor(random(windowHeight)/nodeSize)];
    }

  }

  infectWith(virus) {
    //if healty
    if (this.state != HEALTH.HEALTHY) return;
    //infect self with given Virus
    this.localTimer = 0;
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
    //get color according to health
    let c = this.getHealthColor();

    //draw self
    simulationGRaphics.fill(c);
    simulationGRaphics.ellipse(this.position.x, this.position.y, 20, 20);

    //if not dead
    if (!(this.state == HEALTH.DEAD || this.state == HEALTH.IMMUNE)) {
      //draw infect radius
      c.setAlpha(90);
      simulationGRaphics.fill(c);
      simulationGRaphics.ellipse(this.position.x, this.position.y, this.infectRadius, this.infectRadius);
    }

    //debug text
    // simulationGRaphics.fill(255);
    // simulationGRaphics.text(this.state, this.position.x+20, this.position.y);
    // simulationGRaphics.text(this.localTimer, this.position.x+20, this.position.y+20);
  }

  //return color according to current health
  getHealthColor() {
    switch (this.state) {
      case HEALTH.HEALTHY:
        return color(0, 0, 255);      //blue
      case HEALTH.IMMUNE:
        return color(255, 255, 0);    //yellow?
      case HEALTH.INFECTED:
        return color(20, 100, 20);      //dark green
      case HEALTH.INFECTIOUS:
        return color(0, 255, 0);    //green
      case HEALTH.DEAD:
        return color(10, 10, 10);     //black
    }
  }

}
