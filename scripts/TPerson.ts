///<reference path="Tutils.ts"/>
///<reference path="TastarLib.ts"/>
///<reference path="TVirus.ts"/>
///<reference path="Tsketch.ts"/>
class Person {


  // @ts-ignore
  position: p5.Vector;
  // @ts-ignore
  private velocity: p5.Vector;
  private state: number;
  size: number;
  localTimer: number;
  infectRadius: number;
  virus: Virus;
  pathFinder: AStar;
  showInfo: number;
  timeTable: PathFinderNode[];
  timeTableIndex: number;
  myPersonalIndex: number;
  infectedPeople: number = 0;
  atHome: boolean = false;


  constructor() {
    this.position = createVector(15.5*nodeSize, 21.5*nodeSize);
    this.velocity = createVector(random(-1, 1), random(-1, 1)).normalize();
    this.state = HEALTH.HEALTHY;
    this.size = nodeSize/2;
    this.localTimer = 0;
    this.infectRadius = this.size;
    this.virus = null;
    this.pathFinder = new AStar();
    this.myPersonalIndex = people.length
    this.timeTableIndex = 0;
    this.pathFinder.startNode = globalNodes[Math.floor(this.position.x/nodeSize)][Math.floor(this.position.y/nodeSize)+1]

  }

  update(): void {
    this.handleMovement();
    this.handleOthers();
    this.checkTime();
    this.addSelfToAnalytics();
  }

  addSelfToAnalytics(): void {
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
      case HEALTH.SYMPTOMS:
        currentAnalData.SYMPTOMS++;
        break;
      case HEALTH.IMMUNE:
        currentAnalData.IMMUNE++;
        break;
      case HEALTH.DEAD:
        currentAnalData.DEAD++;
        break;
    }
  }

  createAerosol(): void {
    if (!aerosols) return;
    if (humidity < 0.4 && random(1) > 0.1) return;
    if (humidity > 0.4 && random(1) > 0.5) return;

    let n = {
      x: floor(this.position.x / nodeSize),
      y: floor(this.position.y / nodeSize),
    }

    let r = 4;
    let s = 400;
    for (let x = -r; x < r; x++) {
      for (let y = -r; y < r; y++) {
        try {
          let node = globalNodes[n.x + x][n.y + y];
          if (node.isGood) {
            node.aerosol += (s / (dist(n.x, n.y, n.x + x, n.y + y) + 1))
            node.infector = this;
          }
        } catch {
        }
      }
    }
  }

  checkTime() {

    //wenn du nicht krank bist, lebe glücklich weiter
    if (this.state !== HEALTH.INFECTIOUS && this.state !== HEALTH.INFECTED && this.state !== HEALTH.SYMPTOMS) return;


    //update Timer
    this.localTimer++;

    if (this.virus.tIncubation < this.localTimer) this.state = HEALTH.SYMPTOMS;

    //Symptome?
    if (this.state === HEALTH.SYMPTOMS) {

      //für jedes Symptom
      for (let symptom in this.virus.symptoms) {
        if (!mask && random(1) < this.virus.symptoms[symptom]) {
          this.infectRadius = this.size*4;
          this.createAerosol();
        }
      }
    }

    //update infectRadius
    if (this.infectRadius > this.size * 1.5) this.infectRadius -= 0.5;

    //Check if gonna die
    if (round(this.virus.tRekonvaleszenz + this.virus.tIncubation + this.virus.tLatenz) <= this.localTimer) {
      this.infectRadius = 0;
      if (random(1) < this.virus.rLetalitaet) {
        this.state = HEALTH.DEAD;
      } else {
        this.state = HEALTH.IMMUNE;
        this.atHome = false;
      }
    }

    //check if Latenzzeit is over
    if (this.state === HEALTH.INFECTED) {
      if (this.localTimer > round(this.virus.tLatenz)) {
        this.state = HEALTH.INFECTIOUS;
        this.infectRadius = this.size * 1.5;
      }
    }

  }

  handleOthers() {
    let _this = this;
    if (_this.state === HEALTH.INFECTED) return;
    if (!_this.atHome && (_this.state === HEALTH.INFECTIOUS || this.state === HEALTH.SYMPTOMS)) {
      //cycle through every person...
      people.forEach(person => {
        //dont spontaneously self-infect
        if (person !== _this) {
//TRÖPCHENINFEKTION
          //if in reach
          if (dist(person.position.x, person.position.y, _this.position.x, _this.position.y) < _this.infectRadius) {
            //and infectable
            if (person.state === HEALTH.HEALTHY || person.state === HEALTH.IMMUNE) {
              if (random(1) < _this.virus.pInfection*maskProtection*(oneWayMask ? (1-maskProtection) : 1)) {
                if (person.state === HEALTH.IMMUNE && this.virus.isNotSimilarEnough(person.virus)) {
                  person.infectWith(this.virus.get());
                  this.infectedPeople++;
                } else if (person.state === HEALTH.HEALTHY) {
                  person.infectWith(this.virus.get());
                  this.infectedPeople++;
                }
              }
            }
          }
        }
      });
    }
  }

  handleMovement() {

    //dont move if ya dead
    if (this.state === HEALTH.DEAD) return;

    
    //if youre leaving home
    if (getCurrentLessonIndex() === 0) {
      //and feel sick
      if (this.state === HEALTH.SYMPTOMS && stayAtHomeWhenSick) {
        //then stay at home
        this.pathFinder.endNode = timetables[this.myPersonalIndex%timetables.length][timetables[this.myPersonalIndex%timetables.length].length-1][floor(this.myPersonalIndex/timetables.length)];
        this.atHome = true;
      } else {
      //and dont feel sick
        //then you can continue
        this.atHome = false;
        this.pathFinder.endNode = this.getNextNode();
      }
      //except when youre not allowed to stay at home
      if(!stayAtHomeWhenSick) this.atHome = false;
    } else if (!this.atHome) {
      this.pathFinder.endNode = this.getNextNode();
    }

    //refresh the startNode
    this.pathFinder.startNode = globalNodes[Math.floor(this.position.x / nodeSize)][Math.floor(this.position.y / nodeSize)];


    //falls man den pfad neuberechnen sollte
    if (
        //if the next node got irrelevant
        !this.pathFinder.nextN
        || ((this.position.x / nodeSize >= this.pathFinder.nextN.x - nodeSize * 0.5)
        && (this.position.x / nodeSize <= this.pathFinder.nextN.x + nodeSize * 0.5)
        && (this.position.y / nodeSize >= this.pathFinder.nextN.y - nodeSize * 0.5)
        && (this.position.y / nodeSize <= this.pathFinder.nextN.y + nodeSize * 0.5))

        //or the endNode changed
        || this.pathFinder.endNode !== this.pathFinder.lEndNode
    ) {

      this.pathFinder.lEndNode = this.pathFinder.endNode;

      //get the path
      if (this.pathFinder.getPath(globalNodes)) {

        //reconstructing the path in order to get the next node:
        //the current node we are looking at
        let n = this.pathFinder.endNode;
        //the node before that
        this.pathFinder.nextN = this.pathFinder.endNode;
        //reconstruct the path and store the nodes
        while (n.daddy != null && n.daddy !== this.pathFinder.startNode) {
          this.pathFinder.nextN = n;
          n = n.daddy;
        }
        this.pathFinder.nextN = n;
      } else {
        //if theres noooo path:
        this.pathFinder.nextN = this.pathFinder.startNode;
      }
    }

    //if we didnt reached the goal yet
    if (this.pathFinder.startNode !== this.pathFinder.endNode) {
      //move in the direction of the center of the next node!!

      //calculate direction
      this.velocity = createVector(
          ((this.pathFinder.nextN.x + 0.5) * nodeSize) - this.position.x,
          ((this.pathFinder.nextN.y + 0.5) * nodeSize) - this.position.y,
      );
      //set the speed
      this.velocity.limit(this.velocity.mag())
      this.velocity.setMag((this.velocity.mag()/200)*(deltaTime/Config.speed))

      //dont walk out of screen
      if(this.position.x + this.velocity.x > 0 && this.position.x + this.velocity.x < windowWidth &&
         this.position.y + this.velocity.y > 0 && this.position.y + this.velocity.y < windowHeight)
        //update position
        this.position.add(this.velocity);
    } else {
    //if we arrived
      if (this.timeTableIndex === 11) {
        this.atHome = true;
      }
    }

    if (map(this.pathFinder.startNode.aerosol, 0, 400, 0, 1) >random(1)) {
      this.infectWith(this.pathFinder.startNode.infector.virus.get());
    }

  }

  getNextNode() {
    this.timeTableIndex = getCurrentLessonIndex();
    return timetables[this.myPersonalIndex%timetables.length][this.timeTableIndex][floor(this.myPersonalIndex/timetables.length)]
  }

  infectWith(virus) {
    if (this.state===HEALTH.HEALTHY || !this.virus.isNotSimilarEnough(virus)) {

      //infect self with given Virus
      this.localTimer = 0;
      this.virus = virus;
      this.state = HEALTH.INFECTED;
    }
  }

  getInfo() {
    if (!this.virus) return `
_____GENERELL_____
- Gehe zu ${this.pathFinder.endNode.x}|${this.pathFinder.endNode.x}
  denn es ist #${this.timeTableIndex}
`

    return `
______Pathogen_______
- Latenzzeit: ${(this.virus.tLatenz/60).toFixed(1)}h
- Incubationszeit:${(this.virus.tIncubation/60).toFixed(1)}h
- Rekonvaleszenzzeit:${(this.virus.tRekonvaleszenz/60).toFixed(1)}h
- Letalität: ${this.virus.rLetalitaet}%
- Infektiosität:${(this.virus.pInfection * 100).toFixed(1)}%
- Symptome:
${this.virus.symptoms.toString()}
- R: ${this.infectedPeople}
_____GENERELL_____
- Gehe zu ${this.pathFinder.endNode.x}|${this.pathFinder.endNode.x}
  weil es Stunde Nummer #${this.timeTableIndex} ist!
`

  }

  drawInfo(c) {
    let _m = createVector(mouseX - this.position.x, mouseY - this.position.y);
    _m.limit(60);

    let _h = _m.y > 0 ? 220 : -220;
    let _w = _m.x > 0 ? 170 : -170;
    let _x = this.position.x + _m.x;
    let _y = this.position.y + _m.y;

    let _x_padding = 10;
    let _y_padding = 3;
    let _tx = _w > 0 ? _x + _x_padding : _x + _w - _x_padding + 15;
    let _ty = _h > 0 ? _y + _y_padding : _y + _h - _y_padding + 5;

    if (this.showInfo > 0) {
      this.showInfo--;
      fill(color(60, this.showInfo));
      stroke(red(c), green(c), blue(c), this.showInfo);
      strokeWeight(2);
      rect(_x, _y, _w, _h, 5);
      line(this.position.x, this.position.y, _x, _y);
      stroke(c);
      strokeWeight(1);
      c.setAlpha(this.showInfo);
      fill(c);
      text(this.getInfo(), _tx, _ty);
    }
  }

  draw() {
    if (this.atHome) return;

    //get color according to health
    let c = this.getHealthColor();
    c.setAlpha(100);
    //draw ellipse
    fill(c);
    stroke(c);

    ellipse(this.position.x, this.position.y, this.size*2, this.size*2)
    this.drawInfo(c)


    //if not dead
    // if (!(this.state == HEALTH.DEAD || this.state == HEALTH.IMMUNE)) {
      //draw infect radius
    c.setAlpha(90);
    fill(c);
    stroke(c);
    ellipse(this.position.x, this.position.y, this.infectRadius, this.infectRadius);

    //draw image
    noFill();
    image(personImage, this.position.x - ((this.size/personImage.height) * personImage.width) * 0.75, this.position.y - this.size * 0.75, ((this.size/personImage.height) * personImage.width)*1.5, this.size*1.5);

    //debug text
    // simulationGraphics.fill(255);
    // simulationGraphics.text(this.state, this.position.x+20, this.position.y);
    // simulationGraphics.text(this.localTimer, this.position.x+20, this.position.y+20);
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
      case HEALTH.SYMPTOMS:
        return color(180, 20, 20) // red
      case HEALTH.DEAD:
        return color(10, 10, 10);     //black
    }
  }

}
