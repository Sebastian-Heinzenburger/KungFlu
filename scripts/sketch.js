let people = [];
let analiticalView = false;
var stopped = false;
let analData = [];
let currentAnalData = {
      HEALTHY: 0,
      INFECTED: 0,
      INFECTIOUS: 0,
      IMMUNE: 0,
      DEAD: 0
};

let frame = 0;

let simulationGRaphics;

function setup() {
    //create 15 Persons and store them in a people array
    for (let i = 0; i < 40; i++) { people.push(new Person()); }
    createCanvas(windowWidth, windowHeight);
    simulationGRaphics = createGraphics(windowWidth, windowHeight);
}

function mousePressed(event) {
    //cycle through every person...
    people.forEach(person => {
        //...and check if its under the mousePointer
        if (dist(person.position.x, person.position.y, event.x, event.y) < 30) {
            //if so, then sneeze in his face!
            person.infectWith(new Virus());
        }
    });
    return false;
}

function keyPressed() {
  console.log("pressed");
  if (key === 'A' || key === 'a') {
    analiticalView = !analiticalView;
  }
  if (!(keyCode==123 || keyCode==116)) return false;
}

function draw() {
    // if (!focused) return;
    let startTime = new Date().getTime();

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

    //if simulation
    if (!analiticalView) {
      simulationGRaphics.background(36);

      //...and draw each person
      people.forEach(person => {
        person.draw();
      });

      //clear canvas
      background(36);
      image(simulationGRaphics, 0, 0);

      fill(255);
      text(`${((((new Date().getTime()) - startTime))).toFixed()} ms per frame`, 5, 15);
    }

    //if analiticalView
    else {
      if(analData.length % 1 == 0) {

        //clear canvas
        background(36);

        var index = 1;
        var newImg = createGraphics(analData.length, windowHeight);

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


          if (analData[analData.length-1].IMMUNE + analData[analData.length-1].DEAD == people.length && !stopped) {
            stopped = true;
            console.log(JSON.stringify(analData));
          }

        });
        newImg.fill(255, 255, 255);
        newImg.noStroke();
        text(""+ analData[analData.length-1].DEAD, 10, 10);
        image(newImg, 0, 0, windowWidth, windowHeight);
      }
    }
    analData.push(currentAnalData);
}
