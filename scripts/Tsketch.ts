///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="Tutils.ts"/>
///<reference path="renderData/Tcirclediagram.ts"/>
///<reference path="renderData/TexperimentalGraph.ts"/>
///<reference path="TVirus.ts"/>
///<reference path="Tobstacles.ts"/>
///<reference path="renderData/Tbardiagram.ts"/>
///<reference path="TastarLib.ts"/>
///<reference path="TPerson.ts"/>
///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/src/image/p5.Image.d.ts"/>
// @ts-ignore
p5.disableFriendlyErrors = true;
let canvas;
let nodeSize;
let globalNodes = [];
let people: Person[] = [];
let analData = [];
let currentAnalData = {
      HEALTHY: 0,
      INFECTED: 0,
      INFECTIOUS: 0,
      SYMPTOMS: 0,
      IMMUNE: 0,
      DEAD: 0,
      R: 0,
};
let view = VIEWS.SIMULATION;
let stopped: boolean = false;
let paused: boolean = true;
let newImg, bg;
let stayAtHomeWhenSick: boolean;
// @ts-ignore
let personImage: p5.Image;
let mask: boolean;
let ffp2: boolean;
let maskProtection: number;

function preload() {

    personImage = loadImage('pictures/person.jpg')
    // bg = loadImage('pictures/Klassenzimmer.png');
}
0
function setup() {

//     alert(`
// Nachricht für Joni
// ------------------
// Das ganze ist (immernoch nicht) fertig
// z.B. fehlen noch Schutzmaßnahmen
// Hier ist ne Liste mit den Keybindings:
// B: Blockgraph
// F: Fancygraphen
// C: Kreisdiagram
// A: Einstellungen
// P: Pausieren
//
// Außerdem kann man für Informationen auf die Leute klicken :)
//     `)

    // nodeSize = windowWidth/(39 + (windowWidth/(windowHeight/22))/39);
    nodeSize = windowWidth > windowHeight ? windowHeight/22 : windowWidth/39;

    showSliders();


    for (let x = 0; x <= windowWidth/nodeSize; x++) {
      globalNodes.push([]);
      for (let y = 0; y < windowHeight/nodeSize; y++) {
        globalNodes[x][y] = new PathFinderNode(x, y);
      }
    }

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.hide();
    frameRate(60);

    setupBackground();
    initTimetables();

    //create 15 Persons and store them in a people array
    for (let i = 0; i < 24; i++) { people.push(new Person()); }
    people[0].infectWith(new Virus());

    /*
    people[0].virus.tLatenz = <number>select("#latenz").value()
    people[0].virus.tIncubation = <number>select("#incubation").value()
    people[0].virus.tRekonvaleszenz = <number>select("#recon").value()
    people[0].virus.rLetalitaet = <number>select("#letalitaet").value()/100
    people[0].virus.pInfection = <number>select("#pInfection").value()/100

    people[0].virus.symptoms.SNEEZING = <number>select("#sneez").value()/1000;
    people[0].virus.symptoms.COUGHING = <number>select("#cough").value()/1000;
    people[0].virus.symptoms.SPONTANIOUS_EYE_BLEEDING = <number>select("#eye").value()/1000;

    people[0].virus.mutation.tLatenz = <number>select("#mlatenz").value()/100
    people[0].virus.mutation.tIncubation = <number>select("#mincubation").value()/100
    people[0].virus.mutation.tRekonvaleszenz = <number>select("#mrecon").value()/100
    people[0].virus.mutation.rLetalitaet = <number>select("#mletalitaet").value()/100
    people[0].virus.mutation.pInfection = <number>select("#mpInfection").value()/100
    people[0].virus.mutation.SNEEZING = <number>select("#msneez").value()/100
    people[0].virus.mutation.COUGHING = <number>select("#mcough").value()/100
    people[0].virus.mutation.SPONTANIOUS_EYE_BLEEDING = <number>select("#meye").value()/100
    */



}

function mousePressed(event) {
    if (canvas.style("display") == "none") return true;
    //cycle through every person...
    people.forEach(person => {
        //...and check if its under the mousePointer
        if (dist(person.position.x, person.position.y, event.x, event.y) < 30) {
            //if so, then sneeze in his face!
            // person.infectWith(new Virus());
            person.showInfo = Config.fadeTime;
            person.drawInfo(person.getHealthColor());
        }
    });
    redraw();
    return true;
}

function keyPressed() {

  switch (key) {
    //just because I got used to pressing a
    case 'a':
    case 'A':
        if (getR() < 1) paused = false;
        if (canvas.style("display") == "none") {
            hideSliders();
            canvas.show();
        } else {
            canvas.hide();
            showSliders()
        }
        break;
    case 'B':
    case 'b':
      view = view === VIEWS.BARS ? VIEWS.SIMULATION : VIEWS.BARS;
      break;
    case 'S':
    case 's':
      view = VIEWS.SIMULATION;
      break;
    case 'C':
    case 'c':
      view = view === VIEWS.CIRCLE ? VIEWS.SIMULATION : VIEWS.CIRCLE;
      break;
      case 'P':
      case ' ':
      case 'p':
          paused = !paused;
          break;
    case 'F':
    case 'f':
        if (view === VIEWS.FANCY2) {
            view = VIEWS.FANCY
        } else {
            view = view === VIEWS.SIMULATION ? VIEWS.FANCY2 : VIEWS.SIMULATION
        }
      break;
    default:
      return true;
  }

  return true;

}

function draw() {
    if (paused) return;

    updateSliderValues();

    //update...
    for (let i = 0; i < Config.speed; i++) {
        currentAnalData = {
            HEALTHY: 0,
            INFECTED: 0,
            INFECTIOUS: 0,
            SYMPTOMS: 0,
            IMMUNE: 0,
            DEAD: 0,
            // @ts-ignore
            R: parseFloat(getR())
        };
        globalNodes.forEach(_gN => {
            _gN.isGood = true;
        });
        baseNodeIndexes.forEach(_bNI => {
            try{ globalNodes[_bNI[0]][_bNI[1]].isGood = false; } catch {}
        });
        people.forEach(person => {
            person.update();
            // globalNodes[Math.floor(person.position.x/nodeSize)][Math.floor(person.position.y/nodeSize)].isGood = false;
        });
        if (!stopped && currentAnalData.INFECTIOUS + currentAnalData.SYMPTOMS + currentAnalData.INFECTED >= 1) {
            if (frameCount % 2 === 0) analData.push(currentAnalData);
        } else {
            if (!stopped)
                console.warn(JSON.stringify(analData));
            // analData.push(currentAnalData)
            stopped=true;
        }
        frameCount++;
    }
    frameCount--;

    //draw
    switch(view) {
      case VIEWS.SIMULATION:
        renderSimulation();
        break;
      case VIEWS.FANCY2:
          renderFancy2();
        break;
      case VIEWS.BARS:
        if (stopped && newImg !== undefined) {
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

}

function renderSimulation() {
    background(36);
    drawBackground();
    // simulationGraphics.image(bg, 0, 0, windowWidth, windowHeight);

    //...and draw each person
    people.forEach(person => {
      person.draw();
    });

    strokeWeight(1);
    fill(255);
    noStroke();
    text(`${deltaTime.toFixed()} ms per frame`, 5, 15);
    text(`${people.length} Schüler
${Math.floor(windowWidth/nodeSize)}x${Math.floor(windowHeight/nodeSize)} Wegpunkte
aktueller R-Wert: ${getR().toFixed(2)}`,5, 35);
    strokeWeight(1);
    stroke(255);
    fill(255);

}
