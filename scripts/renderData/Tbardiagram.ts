///<reference path="../../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="../Tsketch.ts"/>

function renderBars() {
    if(analData.length % 1 == 0 || stopped) {

      //clear canvas
      background(36);

      let index = 1;
      newImg = createGraphics(analData.length, windowHeight);

      analData.forEach(dataPiece => {
        index++;

        newImg.strokeWeight(2);
        newImg.stroke(0, 0, 255);

        let deadY = (windowHeight*(dataPiece.DEAD/people.length));
        let immuneY = deadY + (windowHeight*(dataPiece.IMMUNE/people.length));
        let syptomsY = immuneY + (windowHeight*(dataPiece.SYMPTOMS/people.length));
        let infectiousY = syptomsY + (windowHeight*(dataPiece.INFECTIOUS/people.length));
        let infectedY = infectiousY + (windowHeight*(dataPiece.INFECTED/people.length));

        newImg.stroke(10, 10, 10);
        newImg.line(index, 0, index, deadY);

        newImg.stroke(255, 255, 0);
        newImg.line(index, deadY, index, immuneY);

        newImg.stroke(180, 20, 20);
        newImg.line(index, immuneY, index, syptomsY);

        newImg.stroke(0, 255, 0);
        newImg.line(index, syptomsY, index, infectiousY);

        newImg.stroke(20, 100, 20);
        newImg.line(index, infectiousY, index, infectedY);

        newImg.stroke(0, 0, 255);
        newImg.line(index, windowHeight, index, infectedY);

      });
      image(newImg, 0, 0, windowWidth, windowHeight);
    }
}
