var nodeSize;
let globalNodes = [];
let people = [];
let analData = [];
let currentAnalData = {
      HEALTHY: 0,
      INFECTED: 0,
      INFECTIOUS: 0,
      IMMUNE: 0,
      DEAD: 0
};
let view, stopped = false;
var simulationGraphics, newImg, bg;

function preload() {
  bg = loadImage('pictures/Klassenzimmer.png');
}

function setup() {
    view = VIEWS.SIMULATION;
    nodeSize = windowWidth/30;

    for (var x = 0; x < windowWidth/nodeSize; x++) {
      globalNodes.push([]);
      for (var y = 0; y < windowHeight/nodeSize; y++) {
        globalNodes[x][y] = new Node(x, y);
      }
    }

    setupBackground();
    //create 15 Persons and store them in a people array
    for (let i = 0; i < 24; i++) { people.push(new Person()); }
    people[1].infectWith(new Virus());
    createCanvas(windowWidth, windowHeight);
    simulationGraphics = createGraphics(windowWidth, windowHeight);


}

function mousePressed(event) {
 //cycle through every person...
    people.forEach(person => {
        //...and check if its under the mousePointer
        if (dist(person.position.x, person.position.y, event.x, event.y) < 30) {
            //if so, then sneeze in his face!
            // person.infectWith(new Virus());
            console.log(person);
        }
    });
    return false;
}

function keyPressed() {

  switch (key) {
    //just because I got used to pressing a
    case 'a':
    case 'A':
    //////////////////////////////////////
    case 'B':
    case 'b':
      view = view == VIEWS.BARS ? VIEWS.SIMULATION : VIEWS.BARS;
      break;
    case 'S':
    case 's':
      view = VIEWS.SIMULATION;
      break;
    case 'C':
    case 'c':
      view = view == VIEWS.CIRCLE ? VIEWS.SIMULATION : VIEWS.CIRCLE;
      break;
      break;
    case 'F':
    case 'f':
      view = view == VIEWS.FANCY ? VIEWS.SIMULATION : VIEWS.FANCY;
      break;
  }

  if (!(keyCode==123 || keyCode==116)) return false;
}

function draw() {
    //update...
    for (let i = 0; i < Config.speed; i++) {
          currentAnalData = {
                HEALTHY: 0,
                INFECTED: 0,
                INFECTIOUS: 0,
                IMMUNE: 0,
                DEAD: 0
          };
        people.forEach(person => {
          person.update();
        });
    }

    //draw
    switch(view) {
      case VIEWS.SIMULATION:
        renderSimulation();
        break;
      case VIEWS.BARS:
        if (stopped && newImg!=undefined) {
          image(newImg, 0, 0, windowWidth, windowHeight);
          return;
        }
        renderBars();
        break;
      case VIEWS.CIRCLE:
        renderCircle();
        break;
      case VIEWS.FANCY:
        renderFancy();
        break;
    }
    if (currentAnalData.IMMUNE + currentAnalData.DEAD < people.length) {
      if (frameCount % 2 == 0) analData.push(currentAnalData);
    } else {
      if (!stopped)
        console.log(JSON.stringify(analData));
      stopped=true;
    }
}

function renderSimulation() {
    simulationGraphics.background(36);
    drawBackground();
    // simulationGraphics.image(bg, 0, 0, windowWidth, windowHeight);

    //...and draw each person
    people.forEach(person => {
      person.draw();
    });

    //clear canvas
    // background(36);
    image(simulationGraphics, 0, 0);

    strokeWeight(1);
    fill(255);
    noStroke();
    text(`${deltaTime.toFixed()} ms per frame`, 5, 15);
    text(`${Math.floor(mouseX/nodeSize)}, ${Math.floor(mouseY/nodeSize)}`, mouseX, mouseY);
    text(`${people.length} people\n${Math.floor(windowWidth/nodeSize)}x${Math.floor(windowHeight/nodeSize)} path nodes`, 5, 35);
}

function renderBars() {
    if(analData.length % 1 == 0 || stopped) {

      //clear canvas
      background(36);

      var index = 1;
      newImg = createGraphics(analData.length, windowHeight);

      analData.forEach(dataPiece => {
        index++;

        newImg.strokeWeight(2);
        newImg.stroke(0, 0, 255);

        let deadY = (windowHeight*(dataPiece.DEAD/people.length));
        let immuneY = deadY + (windowHeight*(dataPiece.IMMUNE/people.length));
        let infectiousY = immuneY + (windowHeight*(dataPiece.INFECTIOUS/people.length));
        let infectedY = infectiousY + (windowHeight*(dataPiece.INFECTED/people.length));

        newImg.stroke(10, 10, 10);
        newImg.line(index, 0, index, deadY);

        newImg.stroke(255, 255, 0);
        newImg.line(index, deadY, index, immuneY);

        newImg.stroke(0, 255, 0);
        newImg.line(index, immuneY, index, infectiousY);

        newImg.stroke(20, 100, 20);
        newImg.line(index, infectiousY, index, infectedY);

        newImg.stroke(0, 0, 255);
        newImg.line(index, windowHeight, index, infectedY);

      });
      image(newImg, 0, 0, windowWidth, windowHeight);
    }
}

function renderCircle() {
  background(60);
  let size = (windowWidth < windowHeight ? windowWidth : windowHeight) - 100;
  let currentDeg = {
    last: 0,
    next: 0
  };
  fill(0, 0, 255);
  currentDeg.next = currentDeg.last + (currentAnalData.HEALTHY / people.length)*360;
  arc(windowWidth/2, windowHeight/2, size, size, radians(currentDeg.last), radians(currentDeg.next));
  currentDeg.last = currentDeg.next;
  fill(20, 100, 20);
  currentDeg.next = currentDeg.last + (currentAnalData.INFECTED / people.length)*360;
  arc(windowWidth/2, windowHeight/2, size, size, radians(currentDeg.last), radians(currentDeg.next));
  currentDeg.last = currentDeg.next;
  fill(0, 255, 0);
  currentDeg.next = currentDeg.last + (currentAnalData.INFECTIOUS / people.length)*360;
  arc(windowWidth/2, windowHeight/2, size, size, radians(currentDeg.last), radians(currentDeg.next));
  currentDeg.last = currentDeg.next;
  fill(255, 255, 0);
  currentDeg.next = currentDeg.last + (currentAnalData.IMMUNE / people.length)*360;
  arc(windowWidth/2, windowHeight/2, size, size, radians(currentDeg.last), radians(currentDeg.next));
  currentDeg.last = currentDeg.next;
  fill(10, 10, 10);
  currentDeg.next = currentDeg.last + (currentAnalData.DEAD / people.length)*360;
  arc(windowWidth/2, windowHeight/2, size, size, radians(currentDeg.last), radians(currentDeg.next));
  currentDeg.last = currentDeg.next;
}

function renderFancy() {
  background(60);
  noFill();
  strokeWeight(3);
  stroke(0, 0, 255);
  drawCurve("HEALTHY");
  stroke(20, 100, 20);
  drawCurve("INFECTED");
  stroke(0, 255, 0);
  drawCurve("INFECTIOUS");
  stroke(255, 255, 0);
  drawCurve("IMMUNE");
  stroke(10, 10, 10);
  drawCurve("DEAD");
  noStroke();
  fill(255);
  text(deltaTime, 10, 10)
}
