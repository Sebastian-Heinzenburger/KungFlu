let people = [];

function setup() {
    //create 15 Persons and store them in a people array
    for (let i = 0; i < 15; i++) { people.push(new Person()); }
    createCanvas(windowWidth, windowHeight);
}

function mousePressed(event) {
    //cycle through every person...
    people.forEach(person => {
        //...and check if its under the mousePointer
        if (dist(person.position.x, person.position.y, event.x, event.y) < 30) {
            //if so, then sneeze in his face!
            person.state = HEALTH.INFECTIOUS;
        }
    });
    return false;
}

function draw() {
    let startTime = new Date().getTime();

    background(36);

    //update and draw each person
    people.forEach(person => {
        person.update();
        person.draw();
    });
    
    fill(255);
    text(`${((((new Date().getTime()) - startTime))).toFixed()} ms per frame`, 5, 15);
}