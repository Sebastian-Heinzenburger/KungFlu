///<reference path="../../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="../Tsketch.ts"/>
function renderCircle() {
    background(60);
    stroke(0);
    var size = (windowWidth < windowHeight ? windowWidth : windowHeight) - 100;
    //keep track of current degree for drawing the portion of the circle
    var currentDeg = {
        last: 0,
        next: 0
    };
    //draw the healty portion
    fill(0, 0, 255); //in blue
    currentDeg.next = currentDeg.last + (currentAnalData.HEALTHY / people.length) * 360;
    arc(windowWidth / 2, windowHeight / 2, size, size, radians(currentDeg.last), radians(currentDeg.next));
    currentDeg.last = currentDeg.next;
    //draw the infected
    fill(20, 100, 20); // in light green
    currentDeg.next = currentDeg.last + (currentAnalData.INFECTED / people.length) * 360;
    arc(windowWidth / 2, windowHeight / 2, size, size, radians(currentDeg.last), radians(currentDeg.next));
    currentDeg.last = currentDeg.next;
    //draw the infectious
    fill(0, 255, 0); // in dark green
    currentDeg.next = currentDeg.last + (currentAnalData.INFECTIOUS / people.length) * 360;
    arc(windowWidth / 2, windowHeight / 2, size, size, radians(currentDeg.last), radians(currentDeg.next));
    currentDeg.last = currentDeg.next;
    //draw the symptoms
    fill(180, 20, 20); // in dark green
    currentDeg.next = currentDeg.last + (currentAnalData.SYMPTOMS / people.length) * 360;
    arc(windowWidth / 2, windowHeight / 2, size, size, radians(currentDeg.last), radians(currentDeg.next));
    currentDeg.last = currentDeg.next;
    //draw the immune
    fill(255, 255, 0); //in yellow
    currentDeg.next = currentDeg.last + (currentAnalData.IMMUNE / people.length) * 360;
    arc(windowWidth / 2, windowHeight / 2, size, size, radians(currentDeg.last), radians(currentDeg.next));
    currentDeg.last = currentDeg.next;
    //draw the dead
    fill(10, 10, 10); //in black
    currentDeg.next = currentDeg.last + (currentAnalData.DEAD / people.length) * 360;
    arc(windowWidth / 2, windowHeight / 2, size, size, radians(currentDeg.last), radians(currentDeg.next));
    currentDeg.last = currentDeg.next;
}
