class Virus {
    constructor() {
        this.rLetalitaet = 0.5;
        this.pInfection = 0.7;
        this.tRekonvaleszenz = 5000;
        this.tIncubation = 500;
        this.tLatenz = 300;
    }
    get() {
        let _v = new Virus();
        // _v.mortalityRate = this.mortalityRate * random(0.5, 1.5);
        _v.mortalityRate = mo;
        _v.pInfection = this.pInfection * random(0.5, 1.5);
        _v.tToDie = this.tToDie * random(0.5, 1.5);
        _v.tToInfectious = this.tToInfectious * random(0.5, 1.5);
        return _v;
    }
}
