const HEALTH = {
    HEALTHY: 1,
    INFECTED: 2,
    INFECTIOUS: 3,
    IMMUNE: 4,
    DEAD: 5
};
Object.freeze(HEALTH);

const VIEWS = {
    SIMULATION: 1,
    BARS: 2,
    CIRCLE: 3,
    FANCY: 4
};
Object.freeze(VIEWS);

 const Config = {
  speed:  3
 }

 function neq(o, t) {
   if (!o || !t) return true;
    if (o.x != t.x) {
        return true;
    }
    if (o.y != t.y) {
        return true;
    }
    return false;
 }
