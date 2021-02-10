///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="Tutils.ts"/>
///<reference path="TastarLib.ts"/>
///<reference path="TVirus.ts"/>
///<reference path="Tsketch.ts"/>
var Person = /** @class */ (function () {
    function Person() {
        this.infectedPeople = 0;
        this.atHome = false;
        this.position = createVector(15.5 * nodeSize, 21.5 * nodeSize);
        this.velocity = createVector(random(-1, 1), random(-1, 1)).normalize();
        this.state = HEALTH.HEALTHY;
        this.size = nodeSize / 2;
        this.localTimer = 0;
        this.infectRadius = this.size;
        this.virus = null;
        this.pathFinder = new AStar();
        this.myPersonalIndex = people.length;
        this.timeTableIndex = 0;
        this.pathFinder.startNode = globalNodes[Math.floor(this.position.x / nodeSize)][Math.floor(this.position.y / nodeSize) + 1];
    }
    Person.prototype.update = function () {
        this.handleMovement();
        this.handleOthers();
        this.checkTime();
        this.addSelfToAnalytics();
    };
    Person.prototype.addSelfToAnalytics = function () {
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
    };
    // hasSymptoms(): boolean {
    //   if (!this.virus) return false;
    //   return (this.localTimer < this.virus.tLatenz + ())
    // }
    Person.prototype.checkTime = function () {
        //wenn du nicht krank bist, lebe glücklich weiter
        if (this.state !== HEALTH.INFECTIOUS && this.state !== HEALTH.INFECTED && this.state !== HEALTH.SYMPTOMS)
            return;
        //update Timer
        this.localTimer++;
        if (this.virus.tIncubation < this.localTimer)
            this.state = HEALTH.SYMPTOMS;
        //Symptome?
        if (this.state === HEALTH.SYMPTOMS) {
            //für jedes Symptom
            for (var symptom in this.virus.symptoms) {
                if (!mask && random(1) < this.virus.symptoms[symptom]) {
                    this.infectRadius = this.size * 4;
                }
            }
        }
        //update infectRadius
        if (this.infectRadius > this.size * 1.5)
            this.infectRadius -= 0.5;
        //Check if gonna die
        if (round(this.virus.tRekonvaleszenz + this.virus.tIncubation + this.virus.tLatenz) <= this.localTimer) {
            this.infectRadius = 0;
            if (random(1) < this.virus.rLetalitaet) {
                this.state = HEALTH.DEAD;
            }
            else {
                this.state = HEALTH.IMMUNE;
            }
        }
        //check if Latenzzeit is over
        if (this.state === HEALTH.INFECTED) {
            if (this.localTimer > round(this.virus.tLatenz)) {
                this.state = HEALTH.INFECTIOUS;
                this.infectRadius = this.size * 1.5;
            }
        }
    };
    Person.prototype.handleOthers = function () {
        var _this = this;
        if (_this.state === HEALTH.INFECTED)
            return;
        if (!_this.atHome && (_this.state === HEALTH.INFECTIOUS || this.state === HEALTH.SYMPTOMS)) {
            //cycle through every person...
            people.forEach(function (person) {
                //dont spontaneously self-infect
                if (person !== _this) {
                    //if in reach
                    if (dist(person.position.x, person.position.y, _this.position.x, _this.position.y) < _this.infectRadius) {
                        //and not dead
                        if (person.state === HEALTH.HEALTHY || person.state === HEALTH.IMMUNE) {
                            if (random(1) < _this.virus.pInfection * (1 - maskProtection) * (ffp2 ? (1 - maskProtection) : 1)) {
                                person.infectWith(_this.virus.get());
                                _this.infectedPeople++;
                            }
                        }
                    }
                }
            });
        }
    };
    Person.prototype.handleMovement = function () {
        //dont move if ya dead
        if (this.state === HEALTH.DEAD)
            return;
        //if its the first time, pick a random endnote TODO:
        // if (!this.pathFinder.endNode) {
        if (this.timeTableIndex !== 11) {
            //if you haveee to go to schoooool again
            this.pathFinder.endNode = this.getNextNode();
            //and dont feel sick
            this.atHome = (this.state === HEALTH.SYMPTOMS);
            if (!stayAtHomeWhenSick)
                this.atHome = false;
        }
        // }
        //refresh the startNode
        this.pathFinder.startNode = globalNodes[Math.floor(this.position.x / nodeSize)][Math.floor(this.position.y / nodeSize)];
        //
        // this.pathFinder.endNode = globalNodes[Math.floor(mouseX / nodeSize)][Math.floor(mouseY / nodeSize)];
        //
        //falls man den pfad neuberechnen sollte
        if (!this.pathFinder.nextN || ((this.position.x / nodeSize >= this.pathFinder.nextN.x - nodeSize * 0.5)
            && (this.position.x / nodeSize <= this.pathFinder.nextN.x + nodeSize * 0.5)
            &&
                (this.position.y / nodeSize >= this.pathFinder.nextN.y - nodeSize * 0.5)
            && (this.position.y / nodeSize <= this.pathFinder.nextN.y + nodeSize * 0.5)) ||
            this.pathFinder.endNode !== this.pathFinder.lEndNode
        //Math.floor(this.position.y / nodeSize) == this.pathFinder.startNode.y && this.pathFinder.startNode.x + nodeSize * 0.2 <= this.position.x / nodeSize <= this.pathFinder.startNode.x - nodeSize * 0.2
        ) {
            this.pathFinder.lEndNode = this.pathFinder.endNode;
            //berechne den Pfad
            if (this.pathFinder.getPath(globalNodes)) {
                //reconstructing the path:
                //the current node we are looking at
                var n = this.pathFinder.endNode;
                //the node before that
                this.pathFinder.nextN = this.pathFinder.endNode;
                //reconstruct the path and store the nodes
                while (n.daddy != null && n.daddy !== this.pathFinder.startNode) {
                    this.pathFinder.nextN = n;
                    n = n.daddy;
                }
                this.pathFinder.nextN = n;
                //if theres noooo path:
            }
            else {
                this.pathFinder.nextN = this.pathFinder.startNode;
            }
        }
        //if we didnt reached the goal yet
        if (this.pathFinder.startNode !== this.pathFinder.endNode) {
            //move in the direction of the center of the next node!!
            this.velocity = createVector(((this.pathFinder.nextN.x + 0.5) * nodeSize) - this.position.x, ((this.pathFinder.nextN.y + 0.5) * nodeSize) - this.position.y);
            this.velocity.limit(this.velocity.mag());
            this.velocity.setMag((this.velocity.mag() / 200) * (deltaTime / Config.speed));
            if (this.position.x + this.velocity.x > 0 && this.position.x + this.velocity.x < windowWidth &&
                this.position.y + this.velocity.y > 0 && this.position.y + this.velocity.y < windowHeight)
                this.position.add(this.velocity);
        }
        else {
            if (this.timeTableIndex === 11) {
                this.atHome = true;
            }
            this.pathFinder.endNode = this.getNextNode();
        }
    };
    Person.prototype.getNextNode = function () {
        // console.log("--------------------------")
        var _t = [
            Lessonduration,
            shortBreakDuration,
            Lessonduration,
            shortBreakDuration,
            Lessonduration,
            BreakDuration,
            shortBreakDuration,
            Lessonduration,
            shortBreakDuration,
            Lessonduration,
            Lessonduration,
            homeDuration
        ];
        var tNow = 0;
        var lessonsSince0 = 0;
        while (tNow < frameCount) {
            tNow += _t[lessonsSince0 % _t.length];
            lessonsSince0++;
        }
        this.timeTableIndex = (lessonsSince0 - 1) % _t.length;
        return timetables[this.myPersonalIndex % timetables.length][this.timeTableIndex][floor(this.myPersonalIndex / timetables.length)];
    };
    Person.prototype.infectWith = function (virus) {
        if (this.state === HEALTH.HEALTHY || !this.virus.isNotSimilarEnough(virus)) {
            //infect self with given Virus
            this.localTimer = 0;
            this.virus = virus;
            this.state = HEALTH.INFECTED;
        }
    };
    Person.prototype.getInfo = function () {
        if (!this.virus)
            return "\n_____GENERELL_____\n- Gehe zu " + this.pathFinder.endNode.x + "|" + this.pathFinder.endNode.x + "\n  denn es ist #" + this.timeTableIndex + "\n";
        return "\n______Pathogen_______\n- Latenzzeit: " + (this.virus.tLatenz / 60).toFixed(1) + "h\n- Incubationszeit:" + (this.virus.tIncubation / 60).toFixed(1) + "h\n- Rekonvaleszenzzeit:" + (this.virus.tRekonvaleszenz / 60).toFixed(1) + "h\n- Letalit\u00E4t: " + this.virus.rLetalitaet + "%\n- Infektiosit\u00E4t:" + (this.virus.pInfection * 100).toFixed(1) + "%\n- Symptome:\n" + this.virus.symptoms.toString() + "\n- R: " + this.infectedPeople + "\n_____GENERELL_____\n- Gehe zu " + this.pathFinder.endNode.x + "|" + this.pathFinder.endNode.x + "\n  weil es Stunde Nummer #" + this.timeTableIndex + " ist!\n";
    };
    Person.prototype.drawInfo = function (c) {
        var _m = createVector(mouseX - this.position.x, mouseY - this.position.y);
        _m.limit(60);
        var _h = _m.y > 0 ? 220 : -220;
        var _w = _m.x > 0 ? 160 : -160;
        var _x = this.position.x + _m.x;
        var _y = this.position.y + _m.y;
        var _x_padding = 10;
        var _y_padding = 3;
        var _tx = _w > 0 ? _x + _x_padding : _x + _w - _x_padding + 15;
        var _ty = _h > 0 ? _y + _y_padding : _y + _h - _y_padding + 5;
        if (this.showInfo > 0) {
            this.showInfo--;
            fill(color(60, this.showInfo));
            stroke(red(c), green(c), blue(c), this.showInfo);
            strokeWeight(2);
            rect(_x, _y, _w, _h, 5);
            line(this.position.x, this.position.y, _x, _y);
            noStroke();
            c.setAlpha(this.showInfo);
            fill(c);
            text(this.getInfo(), _tx, _ty);
        }
    };
    Person.prototype.draw = function () {
        if (this.atHome)
            return;
        //get color according to health
        var c = this.getHealthColor();
        c.setAlpha(100);
        //draw ellipse
        fill(c);
        ellipse(this.position.x, this.position.y, this.size * 2, this.size * 2);
        this.drawInfo(c);
        //if not dead
        // if (!(this.state == HEALTH.DEAD || this.state == HEALTH.IMMUNE)) {
        //draw infect radius
        c.setAlpha(90);
        fill(c);
        ellipse(this.position.x, this.position.y, this.infectRadius, this.infectRadius);
        //draw image
        noFill();
        image(personImage, this.position.x - ((this.size / personImage.height) * personImage.width) * 0.75, this.position.y - this.size * 0.75, ((this.size / personImage.height) * personImage.width) * 1.5, this.size * 1.5);
        //debug text
        // simulationGraphics.fill(255);
        // simulationGraphics.text(this.state, this.position.x+20, this.position.y);
        // simulationGraphics.text(this.localTimer, this.position.x+20, this.position.y+20);
    };
    //return color according to current health
    Person.prototype.getHealthColor = function () {
        switch (this.state) {
            case HEALTH.HEALTHY:
                return color(0, 0, 255); //blue
            case HEALTH.IMMUNE:
                return color(255, 255, 0); //yellow?
            case HEALTH.INFECTED:
                return color(20, 100, 20); //dark green
            case HEALTH.INFECTIOUS:
                return color(0, 255, 0); //green
            case HEALTH.SYMPTOMS:
                return color(180, 20, 20); // red
            case HEALTH.DEAD:
                return color(10, 10, 10); //black
        }
    };
    return Person;
}());
