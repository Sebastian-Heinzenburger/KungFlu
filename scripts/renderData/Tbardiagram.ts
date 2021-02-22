///<reference path="../Tsketch.ts"/>
///<reference path="../../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>


function renderBars() {
    if(analData.length % 1 == 0 || stopped) {

      //clear canvas
      background(36);

      let index = 1;
      experimentalGraphImage = createGraphics(analData.length, windowHeight);

      analData.forEach(dataPiece => {
        index++;

        experimentalGraphImage.strokeWeight(2);
        experimentalGraphImage.stroke(0, 0, 255);

        let deadY = (windowHeight*(dataPiece.DEAD/people.length));
        let immuneY = deadY + (windowHeight*(dataPiece.IMMUNE/people.length));
        let syptomsY = immuneY + (windowHeight*(dataPiece.SYMPTOMS/people.length));
        let infectiousY = syptomsY + (windowHeight*(dataPiece.INFECTIOUS/people.length));
        let infectedY = infectiousY + (windowHeight*(dataPiece.INFECTED/people.length));

        experimentalGraphImage.stroke(10, 10, 10);
        experimentalGraphImage.line(index, 0, index, deadY);

        experimentalGraphImage.stroke(255, 255, 0);
        experimentalGraphImage.line(index, deadY, index, immuneY);

        experimentalGraphImage.stroke(180, 20, 20);
        experimentalGraphImage.line(index, immuneY, index, syptomsY);

        experimentalGraphImage.stroke(0, 255, 0);
        experimentalGraphImage.line(index, syptomsY, index, infectiousY);

        experimentalGraphImage.stroke(20, 100, 20);
        experimentalGraphImage.line(index, infectiousY, index, infectedY);

        experimentalGraphImage.stroke(0, 0, 255);
        experimentalGraphImage.line(index, windowHeight, index, infectedY);

      });
      image(experimentalGraphImage, 0, 0, windowWidth, windowHeight);
    }
}
