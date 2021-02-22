///<reference path="Tsketch.ts"/>
class AStar {

  //our goal and end
  endNode: PathFinderNode;
  startNode: PathFinderNode;

  //the note we currently examen
  nodes: PathFinderNode[];

  //the last end node
  lEndNode: PathFinderNode;

  //the first node from the startpoint
  nextN: PathFinderNode;

  //keep track of the node states
  openlist: PathFinderNode[];
  closedList: PathFinderNode[];
  currentNode: PathFinderNode;

  constructor() {
    //nodes that are under consideration
    this.openlist = [];
    //nodes that we already dislike
    this.closedList = [];
    //the note we currently examen
    this.nodes = [];
  }

  //find the open node with the least f cost
  getMin() {
    let min = this.openlist[0];
    this.openlist.forEach(n => {
      if (this.f(n) < this.f(min)) min = n;
    });
    //pop it out of the openlist
    this.openlist.splice(this.openlist.indexOf(min), 1);
    return min;
  }

  //returns the estimated distance to the end
  h(n) {
    return (this.endNode ? dist(this.endNode.x, this.endNode.y, n.x, n.y) : 0);
  }

  f(n) {
    return n.g + this.h(n);
  }

  //get all the neighbouring nodes
  getNeighbors(n, ns) {
    let neighbours = [];

    try {
      //top row
      if (n.y > 0) {

        //left
        if (n.x > 0 && ns[n.x][n.y-1].isGood && ns[n.x-1][n.y].isGood)
        { neighbours.push(ns[n.x-1][n.y-1]); }

        //middle
        neighbours.push(ns[n.x][n.y-1]);

        //right
        if (n.x < ns.length-1 && ns[n.x][n.y-1].isGood && ns[n.x+1][n.y].isGood)
        { neighbours.push(ns[n.x+1][n.y-1]); }
      }

      //middle row
      if (n.x > 0) { neighbours.push(ns[n.x-1][n.y]); }
      if (n.x < ns.length-1) { neighbours.push(ns[n.x+1][n.y]); }

      //lower row
      if (n.y < ns[0].length-1) {

        //left
        if (n.x > 0 && ns[n.x][n.y+1].isGood && ns[n.x-1][n.y].isGood)
        { neighbours.push(ns[n.x-1][n.y+1]); }

        //middle
        neighbours.push(ns[n.x][n.y+1]);

        //right
        if (n.x < ns.length-1 && ns[n.x+1][n.y].isGood && ns[n.x][n.y+1].isGood)
        { neighbours.push(ns[n.x+1][n.y+1]); }
      }
    } catch {
      throw(TypeError);
    }

    return neighbours;
  }

  expandNode(n, ns) {

    //get all the neighboring nodes
    let neighbours = this.getNeighbors(n, ns);

    //go through each neighbor
    neighbours.forEach(ne => {
      //if we hadn't already been there
      // + obstacle check
      // @ts-ignore
      if (!this.closedList.includes(ne)) {
        //if the node isn't an obstacle
        if (ne.isGood) {
          //estimate new g cost
          let newG = n.g + dist(n.x, n.y, ne.x, ne.y);
          //if node is new or the new g cost is better than the current
          // @ts-ignore
          if (!(this.openlist.includes(ne) && newG >= ne.g)) {
            //overwrite g cost and set self as parent
            ne.daddy = n;
            ne.g = newG;
            ne.f = ne.g + this.h(ne);
            //and add to openlist
            this.openlist.push(ne);
          }
        }
      }
    });

  }

  //return true if path is possible
  getPath(_ns) {

    //stop if there is no endNode or startNode
    if (!this.startNode || !this.endNode) return false;

    //stop if it makes no sense to search
    if (this.startNode === this.endNode || !this.endNode.isGood) return false;

    //clean out lists
    this.openlist = [];
    this.closedList = [];

    _ns.forEach(_n => {
      // @ts-ignore
      _n.g = Number.MAX_SAFE_INTEGER*0.99;
      _n.daddy = null;
    });

    //we dont have to travel to were we already are. so the g-cost is 0
    this.startNode.g = 0;

    //first there is just the start in the openlist
    this.openlist.push(this.startNode)

    //while we have options
    while (this.openlist.length > 0) {

      //look at the most promising node
      this.currentNode = this.getMin();

      //are we there yet?
      if (this.currentNode === this.endNode){
        return true;
      }

      //nope? then were done with you
      this.closedList.push(this.currentNode);

      //look for someone hotter
      this.expandNode(this.currentNode, _ns);
    }

    return false;
  }
}


class PathFinderNode {

  x: number;
  y: number;
  g: number;
  isGood: boolean;
  daddy: PathFinderNode;
  aerosol: number;
  infector: Person;

  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    // @ts-ignore
    this.g = Number.MAX_SAFE_INTEGER*0.99;
    this.isGood = true;
    this.daddy = null;
    this.aerosol = 0;
  }

  //depreciated
  copy() : PathFinderNode{
    let _n = new PathFinderNode(this.x, this.y);
    _n.g = this.g;
    _n.isGood = this.isGood;
    _n.daddy = this.daddy;
    return _n
  }
}
