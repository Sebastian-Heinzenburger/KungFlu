///<reference path="../Tsketch.ts"/>
///<reference path="../../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
function renderBars() {
    if (analData.length % 1 === 0 || stopped) {
        //clear canvas
        background(36);
        var index_1 = 1;
        experimentalGraphImage = createGraphics(analData.length, windowHeight);
        analData.forEach(function (dataPiece) {
            index_1++;
            experimentalGraphImage.strokeWeight(2);
            experimentalGraphImage.stroke(0, 0, 255);
            var deadY = (windowHeight * (dataPiece.DEAD / people.length));
            var immuneY = deadY + (windowHeight * (dataPiece.IMMUNE / people.length));
            var syptomsY = immuneY + (windowHeight * (dataPiece.SYMPTOMS / people.length));
            var infectiousY = syptomsY + (windowHeight * (dataPiece.INFECTIOUS / people.length));
            var infectedY = infectiousY + (windowHeight * (dataPiece.INFECTED / people.length));
            experimentalGraphImage.stroke(10, 10, 10);
            experimentalGraphImage.line(index_1, 0, index_1, deadY);
            experimentalGraphImage.stroke(255, 255, 0);
            experimentalGraphImage.line(index_1, deadY, index_1, immuneY);
            experimentalGraphImage.stroke(180, 20, 20);
            experimentalGraphImage.line(index_1, immuneY, index_1, syptomsY);
            experimentalGraphImage.stroke(0, 255, 0);
            experimentalGraphImage.line(index_1, syptomsY, index_1, infectiousY);
            experimentalGraphImage.stroke(20, 100, 20);
            experimentalGraphImage.line(index_1, infectiousY, index_1, infectedY);
            experimentalGraphImage.stroke(0, 0, 255);
            experimentalGraphImage.line(index_1, windowHeight, index_1, infectedY);
        });
        image(experimentalGraphImage, 0, 0, windowWidth, windowHeight);
    }
}
