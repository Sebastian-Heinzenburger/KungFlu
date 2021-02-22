///<reference path="Tsketch.ts"/>
enum HEALTH {
    HEALTHY,
    INFECTED,
    INFECTIOUS,
    SYMPTOMS,
    IMMUNE,
    DEAD
}



// let Tables = [
//
//     [globalNodes[2][5],
//     globalNodes[5][5],
//     globalNodes[2][7],
//     globalNodes[7][7],
//     globalNodes[3][9],
//     globalNodes[6][9]],
//
//     [globalNodes[23][4],
//     globalNodes[23][7],
//     globalNodes[30][4],
//     globalNodes[30][8]],
//
// ]
let timeTables = []

function areSettingsVisible() {
    return canvas.style("display") == "none";
}

function hideSliders() {
    select("#sliderD").hide();
}

function turnSettingsOn(): void {
    canvas.hide();
    showSliders()
}

function turnSettingsOff(): void {
    hideSliders();
    canvas.show();
}

//switch the settingScreen automatically on or off
function toggleSettingScreen() : void {
    if (areSettingsVisible()) {
        turnSettingsOff();
    } else {
        turnSettingsOn()
    }
}

function showSliders() {
    select("#sliderD").show();
}

function updateSliderValues() {
    Config.speed = <number>select("#speedSlider").value();
    Config.fadeTime = <number>select("#fadeoutSlider").value();

    shortBreakDuration = <number>select("#sbreakd").value();
    BreakDuration = <number>select("#breakd").value();
    lessonDuration = <number>select("#lessond").value();
    homeDuration = <number>select("#homed").value();

    // @ts-ignore
    mask = <boolean>select("#mask").checked();
    // @ts-ignore
    aerosols = <boolean>select("#aerosols").checked();
    // @ts-ignore
    oneWayMask = <boolean>select("#ffp2").checked();
    maskProtection = mask ? maskProtection = <number>select("#maskprotection").value()/100 : 0;
    humidity = <number>select("#humidity").value()/100
    // @ts-ignore
    openWindows = <boolean>select("#freshAir").checked();

    // @ts-ignore
    stayAtHomeWhenSick = <boolean>select("#stayAtHomeWhenSick").checked();

    while (people.length > select("#people").value()) {
        people.pop()
    }
    while (people.length < select("#people").value()) {
        people.push(new Person());
    }

    // @ts-ignore
    if (select("#override").checked()) {
        people.forEach(person => {
            if (person.virus) {
                person.virus.tLatenz = <number>select("#latenz").value()
                person.virus.tIncubation = <number>select("#incubation").value()
                if (person.virus.tLatenz>person.virus.tIncubation) {
                    person.virus.tIncubation = person.virus.tLatenz;
                    select("#incubation").value(person.virus.tIncubation);
                }
                person.virus.tRekonvaleszenz = <number>select("#recon").value()
                person.virus.rLetalitaet = <number>select("#letalitaet").value()/100
                person.virus.pInfection = <number>select("#pInfection").value()/100
                person.virus.symptoms.SNEEZING = <number>select("#sneez").value()/10000;
                person.virus.symptoms.COUGHING = <number>select("#cough").value()/10000;
                person.virus.symptoms.SPONTANIOUS_EYE_BLEEDING = <number>select("#eye").value()/10000;

                person.virus.mutation.tLatenz = <number>select("#mlatenz").value()/100
                person.virus.mutation.tIncubation = <number>select("#mincubation").value()/100
                person.virus.mutation.tRekonvaleszenz = <number>select("#mrecon").value()/100
                person.virus.mutation.rLetalitaet = <number>select("#mletalitaet").value()/100
                person.virus.mutation.pInfection = <number>select("#mpInfection").value()/100
                person.virus.mutation.SNEEZING = <number>select("#msneez").value()/100
                person.virus.mutation.COUGHING = <number>select("#mcough").value()/100
                person.virus.mutation.SPONTANIOUS_EYE_BLEEDING = <number>select("#meye").value()/100


            }



        });
    } else {
        people[0].virus.tLatenz = <number>select("#latenz").value()
        people[0].virus.tIncubation = <number>select("#incubation").value()
        if (people[0].virus.tLatenz>people[0].virus.tIncubation) {
            people[0].virus.tIncubation = people[0].virus.tLatenz;
            select("#incubation").value(people[0].virus.tIncubation);
        }
        people[0].virus.tRekonvaleszenz = <number>select("#recon").value()
        people[0].virus.rLetalitaet = <number>select("#letalitaet").value()/100
        people[0].virus.pInfection = <number>select("#pInfection").value()/100
        people[0].virus.symptoms.SNEEZING = <number>select("#sneez").value()/10000;
        people[0].virus.symptoms.COUGHING = <number>select("#cough").value()/10000;
        people[0].virus.symptoms.SPONTANIOUS_EYE_BLEEDING = <number>select("#eye").value()/10000;

        people[0].virus.mutation.tLatenz = <number>select("#mlatenz").value()/100
        people[0].virus.mutation.tIncubation = <number>select("#mincubation").value()/100
        people[0].virus.mutation.tRekonvaleszenz = <number>select("#mrecon").value()/100
        people[0].virus.mutation.rLetalitaet = <number>select("#mletalitaet").value()/100
        people[0].virus.mutation.pInfection = <number>select("#mpInfection").value()/100
        people[0].virus.mutation.SNEEZING = <number>select("#msneez").value()/100
        people[0].virus.mutation.COUGHING = <number>select("#mcough").value()/100
        people[0].virus.mutation.SPONTANIOUS_EYE_BLEEDING = <number>select("#meye").value()/100

    }
}



Object.freeze(HEALTH);

enum VIEWS {
    SIMULATION,
    BARS,
    CIRCLE,
    FANCY,
    FANCY2
}

 const Config = {
    speed:  1,
    fadeTime: 400,

 }

 function neq(o, t) {
   if (!o || !t) return true;
    if (o.x != t.x) {
        return true;
    }
    return o.y != t.y;

 }

 function listCopy(_from: PathFinderNode[][]): PathFinderNode[][] {
     let _new = [];

     for (let x = 0; x < _from.length-1; x++) {
         _new.push([]);
         for (let y = 0; y < _from[x].length-1; y++) {
            _new[x][y] = _from[x][y].copy();
         }
     }
     return _new;
 }


 function getR(max?: boolean): number {
    let _r = 0;
    let _m = 0;
    people.forEach(person => {
        _r += person.infectedPeople;
        if (person.infectedPeople > _m) _m = person.infectedPeople;
    });
    if (max) return _m;
    return (_r/(people.length-currentAnalData.HEALTHY))
 }


// function drawCurve(_healthtype) {
//   beginShape();
//   let o, n;
//   for (let i = 1; i < windowWidth && i < analData.length; i++) {
//     n = windowHeight-analData[Math.floor(i*(analData.length/windowWidth))][_healthtype]*(windowHeight/people.length);
//     console.log(n)
//     if (o && o!= n)
//       vertex(i, o)
//       vertex(i, n);
//     o = n;
//   }
//   endShape();
// }


function drawLines(_healthType) {
    // beginShape()
    let o = analData[0][_healthType];
    let io = 0;
    for (let i = 0; i < analData.length; i++) {
        if (o !== analData[i][_healthType]) {
            line((windowWidth/analData.length)*io, windowHeight-(windowHeight/people.length)*o, (windowWidth/analData.length)*i, windowHeight-(windowHeight/people.length)*analData[i][_healthType])
            o = analData[i][_healthType];
            io = i;
        }
    }
    line((windowWidth/analData.length)*io, windowHeight-(windowHeight/people.length)*o, windowWidth, windowHeight-(windowHeight/people.length)*currentAnalData[_healthType])

}



function drawCurve(_healthType) {
    let o = analData[0][_healthType];
    let io = 0;
    for (let i = 0; i < analData.length; i++) {
        if (o !== analData[i][_healthType]) {
            line((windowWidth/analData.length)*io, windowHeight-(windowHeight/people.length)*o, (windowWidth/analData.length)*i,windowHeight-(windowHeight/people.length)*o)
            line((windowWidth/analData.length)*i, windowHeight-(windowHeight/people.length)*o, (windowWidth/analData.length)*i, windowHeight-(windowHeight/people.length)*analData[i][_healthType])
            o = analData[i][_healthType];
            io = i;
        }
    }
    line((windowWidth/analData.length)*io, windowHeight-(windowHeight/people.length)*o, windowWidth, windowHeight-(windowHeight/people.length)*currentAnalData[_healthType])

}

//
// function drawCurve(_healthType) {
//   var scaleY = (windowHeight/people.length);
//   var n = (analData.length/100)+1;
//   var scaleX = windowWidth/(analData.length/n);
//   for (var i = Math.floor(n); analData.length>i+n+n; i+=Math.floor(n)) {
//     //one
//     var x1 = i-Math.floor(n);
//     var y1 = analData[x1][_healthType] * scaleY;
//     //two
//     var x2 = i;
//     var y2 = analData[x2][_healthType] * scaleY;
//
//     line(x1*scaleX, windowHeight - y1, x2*scaleX, windowHeight - y2);
//     // curve(x1*scaleX, windowHeight-y1, x2*scaleX,windowHeight-y2, x3*scaleX,windowHeight-y3, x4 *scaleX,windowHeight-y4);
//   }
// }




// function drawCurve(_healthType) {
//
//   var scaleY = (windowHeight/people.length);
//   var stepSize = 1;
//   var scaleX = 2;
//   for (var i = stepSize; i < analData.length-stepSize; i+=stepSize) {
//       var x1 = i-stepSize;
//       var y1 = analData[x1][_healthType] * scaleY;
//
//       var x2 = i;
//       var y2 = analData[x2][_healthType] * scaleY;
//
//       line(x1 * scaleX, windowHeight - y1, x2 * scaleX, windowHeight - y2);
//   }
// }


//
// function drawCurve(_healthType) {
//
//   var scaleY = (windowHeight/people.length);
//   var stepSize = analData.length/4;
//   var scaleX = 1;
//   // var scaleX = windowWidth/10;
//
//   var x1;
//   var y1;
//
//   beginShape();
//   for (var i = stepSize; i < analData.length-stepSize; i+=stepSize) {
//       x1 = Math.floor(i);
//       y1 = analData[x1][_healthType] * scaleY;
//
//       vertex((x1) * scaleX, windowHeight - y1);
//       console.log((x1) * scaleX, windowHeight - y1);
//   }
//   // vertex(x1*scaleX, windowHeight);
//   endShape();
// }
