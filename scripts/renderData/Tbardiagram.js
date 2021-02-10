///<reference path="../../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="../Tsketch.ts"/>
function renderBars() {
    if (analData.length % 1 == 0 || stopped) {
        //clear canvas
        background(36);
        var index_1 = 1;
        newImg = createGraphics(analData.length, windowHeight);
        analData.forEach(function (dataPiece) {
            index_1++;
            newImg.strokeWeight(2);
            newImg.stroke(0, 0, 255);
            var deadY = (windowHeight * (dataPiece.DEAD / people.length));
            var immuneY = deadY + (windowHeight * (dataPiece.IMMUNE / people.length));
            var syptomsY = immuneY + (windowHeight * (dataPiece.SYMPTOMS / people.length));
            var infectiousY = syptomsY + (windowHeight * (dataPiece.INFECTIOUS / people.length));
            var infectedY = infectiousY + (windowHeight * (dataPiece.INFECTED / people.length));
            newImg.stroke(10, 10, 10);
            newImg.line(index_1, 0, index_1, deadY);
            newImg.stroke(255, 255, 0);
            newImg.line(index_1, deadY, index_1, immuneY);
            newImg.stroke(180, 20, 20);
            newImg.line(index_1, immuneY, index_1, syptomsY);
            newImg.stroke(0, 255, 0);
            newImg.line(index_1, syptomsY, index_1, infectiousY);
            newImg.stroke(20, 100, 20);
            newImg.line(index_1, infectiousY, index_1, infectedY);
            newImg.stroke(0, 0, 255);
            newImg.line(index_1, windowHeight, index_1, infectedY);
        });
        image(newImg, 0, 0, windowWidth, windowHeight);
    }
}
