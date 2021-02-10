///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
class Virus {
    rLetalitaet: number;
    pInfection: number;
    tRekonvaleszenz: number;
    tIncubation: number;
    tLatenz: number;
    symptoms: { SNEEZING: number; COUGHING: number; SPONTANIOUS_EYE_BLEEDING: number; toString(): string;clone()};
    mutation: {rLetalitaet: number; pInfection: number; tRekonvaleszenz: number; tIncubation: number; tLatenz: number; SNEEZING: number; COUGHING: number; SPONTANIOUS_EYE_BLEEDING: number}

    constructor() {
        this.rLetalitaet = 0.5;
        this.tRekonvaleszenz = 700;
        this.tIncubation = 99999999;
        this.tLatenz = 500;
        this.pInfection = 0.5;
        this.mutation = {rLetalitaet: 0.5, pInfection: 0.5, tRekonvaleszenz: 0.5, tIncubation: 0.5, tLatenz: 0.5, SNEEZING: 0.5, COUGHING: 0.5, SPONTANIOUS_EYE_BLEEDING: 0.5}
        this.symptoms = {
            SNEEZING: 0.001,
            COUGHING: 0.002,
            SPONTANIOUS_EYE_BLEEDING: 0.001,
            toString(): string {
                let returnString = "";
                if (this.SNEEZING > 0.0005) returnString += "    - Sneezing: " + this.SNEEZING.toFixed(4) + "\n"
                if (this.COUGHING > 0.0005) returnString += "    - Coughing: " + this.COUGHING.toFixed(4) + "\n"
                if (this.SPONTANIOUS_EYE_BLEEDING > 0.0005) returnString += "    - Eye: " + this.SPONTANIOUS_EYE_BLEEDING.toFixed(3)
                return returnString;
            },
            clone() {
                return this;
            }
        };
  }

  isNotSimilarEnough(v: Virus){
        let toleranceLetalitaet = 0.001;
        let toleranceRekonvaleszenz = 0.001;
        let toleranceIncubation = 0.001;
        let toleranceLatenz = 0.001;
        let toleranceSneezing = 0.50;
        let toleranceCoughing = 0.50;
        let toleranceSpontaniousEyeBleeding = 0.50;

        return (
            1-min([this.rLetalitaet, v.rLetalitaet])/max([this.rLetalitaet, v.rLetalitaet]) > toleranceLetalitaet
            || 1-min([this.tRekonvaleszenz, v.tRekonvaleszenz])/max([this.tRekonvaleszenz, v.tRekonvaleszenz]) > toleranceRekonvaleszenz
            || 1-min([this.tIncubation, v.tIncubation])/max([this.tIncubation, v.tIncubation]) > toleranceIncubation
            || 1-min([this.tLatenz, v.tLatenz])/max([this.tLatenz, v.tLatenz]) > toleranceLatenz
            || 1-min([this.symptoms.COUGHING, v.symptoms.COUGHING])/max([this.symptoms.COUGHING, v.symptoms.COUGHING]) > toleranceCoughing
            || 1-min([this.symptoms.SNEEZING, v.symptoms.SNEEZING])/max([this.symptoms.SNEEZING, v.symptoms.SNEEZING]) > toleranceSneezing
            || 1-min([this.symptoms.SPONTANIOUS_EYE_BLEEDING, v.symptoms.SPONTANIOUS_EYE_BLEEDING])/max([this.symptoms.SPONTANIOUS_EYE_BLEEDING, v.symptoms.SPONTANIOUS_EYE_BLEEDING]) > toleranceSpontaniousEyeBleeding
        );
  }

  //return mutated version of the Virus
  get() {
      let _v = new Virus();
      _v.rLetalitaet = this.rLetalitaet;
      _v.tRekonvaleszenz = this.tRekonvaleszenz * random(1-this.mutation.tRekonvaleszenz, 1+this.mutation.tRekonvaleszenz);
      _v.tIncubation = this.tIncubation * random(1-this.mutation.tIncubation, 1+this.mutation.tIncubation);
      _v.tLatenz = this.tLatenz * random(1-this.mutation.tLatenz, 1+this.mutation.tLatenz);
      _v.pInfection = this.pInfection * random(1-this.mutation.pInfection, 1+this.mutation.pInfection);

      _v.symptoms = {
          SNEEZING: this.symptoms.SNEEZING * random(1-this.mutation.SNEEZING, 1+this.mutation.SNEEZING),
          COUGHING: this.symptoms.COUGHING * random(1-this.mutation.COUGHING, 1+this.mutation.COUGHING),
          SPONTANIOUS_EYE_BLEEDING: this.symptoms.SPONTANIOUS_EYE_BLEEDING * random(1-this.mutation.SPONTANIOUS_EYE_BLEEDING, 1+this.mutation.SPONTANIOUS_EYE_BLEEDING),
          toString(): string {
              let returnString = "";
              if (this.SNEEZING > 0.0005) returnString += "    Sneezing: " + this.SNEEZING.toFixed(4) + "\n"
              if (this.COUGHING > 0.0005) returnString += "    Coughing: " + this.COUGHING.toFixed(4) + "\n"
              if (this.SPONTANIOUS_EYE_BLEEDING > 0.0005) returnString += "    Eye: " + this.SPONTANIOUS_EYE_BLEEDING.toFixed(3)
              return returnString;
          },
          clone() {
              return this;
          }
      };

      return _v;
  }
}
