class Virus {
  constructor() {
    this.rLetalitaet = 0.5;
    this.pInfection = 0.7;
    this.tRekonvaleszenz = 700;
    this.tIncubation = 500;
    this.tLatenz = 300;
  }

  //return mutated version of the Virus
  get() {
      let _v = new Virus();
      _v.rLetalitaet = this.rLetalitaet;
      _v.pInfection = parseInt(0.7 * random(0.5, 1,5), 10);
      _v.tRekonvaleszenz = parseInt(5000 * random(0.5, 1,5), 10);
      _v.tIncubation = parseInt(500 * random(0.5, 1,5), 10);
      _v.tLatenz = parseInt(300 * random(0.5, 1,5), 10);
      return _v;
  }
}
