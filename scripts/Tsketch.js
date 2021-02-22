///<reference path="Tutils.ts"/>
///<reference path="renderData/Tcirclediagram.ts"/>
///<reference path="renderData/TexperimentalGraph.ts"/>
///<reference path="TVirus.ts"/>
///<reference path="Tobstacles.ts"/>
///<reference path="renderData/Tbardiagram.ts"/>
///<reference path="TastarLib.ts"/>
///<reference path="TimeTables.ts"/>
///<reference path="TPerson.ts"/>
// @ts-ignore
p5.disableFriendlyErrors = true;
// @ts-ignore
var canvas;
// @ts-ignore
var experimentalGraphImage;
// @ts-ignore
var personImage;
var people = [];
var nodeSize;
var globalNodes = [];
var analData = [];
var currentAnalData = {
    HEALTHY: 0,
    INFECTED: 0,
    INFECTIOUS: 0,
    SYMPTOMS: 0,
    IMMUNE: 0,
    DEAD: 0,
    R: 0,
};
var view = VIEWS.SIMULATION;
var stopped = false;
var paused = true;
var mask, oneWayMask, aerosols, openWindows, stayAtHomeWhenSick;
var maskProtection;
var humidity;
//load the player image from the server
function preload() {
    personImage = loadImage('pictures/person.jpg');
}
//fill the array of all the waypoints
function initializeGlobalNodes() {
    for (var x = 0; x <= windowWidth / nodeSize; x++) {
        globalNodes.push([]);
        for (var y = 0; y < windowHeight / nodeSize; y++) {
            globalNodes[x][y] = new PathFinderNode(x, y);
        }
    }
}
function setup() {
    //handle window rotation dynamically
    nodeSize = windowWidth > windowHeight ? windowHeight / 22 : windowWidth / 39;
    showSliders();
    initializeGlobalNodes();
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.hide();
    frameRate(60);
    setupBackground();
    initTimetables();
    //create 15 Persons and store them in a people array
    for (var i = 0; i < 24; i++) {
        people.push(new Person());
    }
    people[0].infectWith(new Virus());
}
//handle mouse input in order to show information about the students
function mousePressed(event) {
    if (areSettingsVisible())
        return true;
    //cycle through every person...
    people.forEach(function (person) {
        //...and check if its under the mousePointer
        if (dist(person.position.x, person.position.y, event.x, event.y) < 30) {
            //then showInfo
            person.showInfo = Config.fadeTime;
            person.drawInfo(person.getHealthColor());
        }
    });
    redraw();
    return true;
}
//handle keyboard input in order to switch views
function keyPressed() {
    switch (key) {
        //just because I got used to pressing a
        case 'a':
        case 'A':
            paused = false;
            toggleSettingScreen();
            break;
        case 'B':
        case 'b':
            view = view === VIEWS.BARS ? VIEWS.SIMULATION : VIEWS.BARS;
            break;
        //switch back to the simulation from wherever you are
        case 'S':
        case 's':
            hideSliders();
            canvas.show();
            view = VIEWS.SIMULATION;
            break;
        //Draw the nice circle - Pie Chart
        case 'C':
        case 'c':
            view = view === VIEWS.CIRCLE ? VIEWS.SIMULATION : VIEWS.CIRCLE;
            break;
        //pause the simulation - stop it now!!!
        case 'P':
        case ' ':
        case 'p':
            paused = !paused;
            break;
        //zapp between smooth graph, exact graph and back to the simulation
        case 'F':
        case 'f':
            if (view === VIEWS.FANCY2) {
                view = VIEWS.FANCY;
            }
            else {
                view = view === VIEWS.SIMULATION ? VIEWS.FANCY2 : VIEWS.SIMULATION;
            }
            break;
        default:
            return true;
    }
    return true;
}
//reset all the blockades
function clearNodes() {
    globalNodes.forEach(function (_gL) {
        _gL.forEach(function (_gN) {
            _gN.isGood = true;
        });
    });
}
//step through the lessons to find out where we are now
//gets worse the longer it runs, but isn't so expensive to calculate
function getCurrentLessonIndex() {
    var _t = [
        lessonDuration,
        shortBreakDuration,
        lessonDuration,
        shortBreakDuration,
        lessonDuration,
        BreakDuration,
        shortBreakDuration,
        lessonDuration,
        shortBreakDuration,
        lessonDuration,
        lessonDuration,
        homeDuration
    ];
    var tNow = 0;
    var lessonsSince0 = 0;
    while (tNow < frameCount) {
        tNow += _t[lessonsSince0 % _t.length];
        lessonsSince0++;
    }
    return (lessonsSince0 - 1) % _t.length;
}
function draw() {
    if (paused)
        return;
    updateSliderValues();
    for (var i = 0; i < Config.speed; i++) {
        //initialize data piece that is updated by every person according to their health
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
        //set all the nodes as good (this is used for the Mindestabstand later... maybe...)
        clearNodes();
        //set nodes with obstacles as "not  good"
        baseNodeIndexes.forEach(function (_bNI) {
            try {
                globalNodes[_bNI[0]][_bNI[1]].isGood = false;
            }
            catch (_a) { }
        });
        //update the aerosole
        globalNodes.forEach(function (ns) {
            ns.forEach(function (n) {
                if (n.aerosol > 0)
                    n.aerosol--;
                // @ts-ignore
                if (openWindows && [1, 3, 5, 6, 7].includes(getCurrentLessonIndex())) {
                    n.aerosol = 0;
                }
            });
        });
        people.forEach(function (person) {
            person.update();
        });
        if (!stopped && currentAnalData.INFECTIOUS + currentAnalData.SYMPTOMS + currentAnalData.INFECTED >= 1) {
            if (frameCount % 2 === 0)
                analData.push(currentAnalData);
        }
        else {
            if (!stopped)
                console.warn(JSON.stringify(analData));
            // analData.push(currentAnalData)
            stopped = true;
        }
        frameCount++;
    }
    frameCount--;
    //draw
    switch (view) {
        case VIEWS.SIMULATION:
            renderSimulation();
            break;
        case VIEWS.FANCY2:
            renderFancy2();
            break;
        case VIEWS.BARS:
            if (stopped && experimentalGraphImage !== undefined) {
                image(experimentalGraphImage, 0, 0, windowWidth, windowHeight);
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
    globalNodes.forEach(function (ns) {
        ns.forEach(function (n) {
            noStroke();
            fill(0, 255, 0, n.aerosol);
            rect(n.x * nodeSize, n.y * nodeSize, nodeSize, nodeSize);
        });
    });
    // @ts-ignore
    if (openWindows && [1, 3, 5, 6, 8].includes(getCurrentLessonIndex())) {
        fill(7, 199, 247, 30);
        rect(nodeSize, nodeSize, nodeSize * 31, nodeSize * 20, 5);
    }
    //...and draw each person
    people.forEach(function (person) {
        person.draw();
    });
    strokeWeight(1);
    fill(255);
    noStroke();
    text(deltaTime.toFixed() + " ms per frame", 5, 15);
    text(people.length + " Sch\u00FCler\n" + Math.floor(windowWidth / nodeSize) + "x" + Math.floor(windowHeight / nodeSize) + " Wegpunkte\naktueller R-Wert: " + getR().toFixed(2) + " (max.: " + getR(true) + ")\n------------------------------------------\nF - Graph\nC - Kreisdiagramm\nB - Experimentelles\n      Diagramm\nA - Einstellungen\n", 5, 35);
    strokeWeight(1);
    stroke(255);
    fill(255);
}
