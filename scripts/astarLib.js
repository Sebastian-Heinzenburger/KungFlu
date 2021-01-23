class AStar {

  constructor() {
    //nodes that are under consideration
    this.openlist = [];
    //nodes that we already dislike
    this.closedList = [];
    //the note we currently examen
    this.currentNode;

    this.nodes;
    this.nNode;
    this.lEndNode;
    this.position = {
      x: 0,
      y: 0
    };

    //our goal and end
    this.startNode;
    this.endNode;
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

  expandNode(n, ns) {

    //get all the neighbouring nodes
    let neighbours = [];

    try {

      //top row
      if (n.y > 0) {
        // if (n.x > 0) { neighbours.push(ns[n.x-1][n.y-1]); }
        neighbours.push(ns[n.x][n.y-1]);
        // if (n.x < ns.length-1) { neighbours.push(ns[n.x+1][n.y-1]); }
      }

      //middle row
      if (n.x > 0) { neighbours.push(ns[n.x-1][n.y]); }
      if (n.x < ns.length-1) { neighbours.push(ns[n.x+1][n.y]); }

      //lower row
      if (n.y < ns[0].length-1) {
        // if (n.x > 0) { neighbours.push(ns[n.x-1][n.y+1]); }
        neighbours.push(ns[n.x][n.y+1]);
        // if (n.x < ns.length-1) { neighbours.push(ns[n.x+1][n.y+1]); }
      }
    } catch {
      console.log(n);
      console.log(ns);
      throw(TypeError);
    }


    neighbours.forEach(ne => {
      //if we hadn't already been there
      // + obstacle check
      if (!this.closedList.includes(ne) && ne.isGood) {
        //estimate new g cost
        let newG = n.g + dist(n.x, n.y, ne.x, ne.y);
        //if node is new or the new g cost is better than the current
        if (!(this.openlist.includes(ne) && newG >= ne.g)) {
          //overwrite g cost and set self as parent
          ne.daddy = n;
          ne.g = newG;
          ne.f = ne.g + this.h(ne);
          //and add to openlist
          this.openlist.push(ne);
        }
      }
    });

  }

  //return true if path is possible
  getPath(_ns) {

    //stop if there is no endNode or startNode
    if (!this.startNode || !this.endNode) return false;

    if (this.startNode === this.endNode || !this.endNode.isGood) return false;

    //do housekeeping
    this.openlist = [];
    this.closedList = [];

    _ns.forEach(_n => {
      _n.g = Number.MAX_SAFE_INTEGER*0.99;
      _n.daddy = null;
    });

    this.startNode.g = 0;

    //first there is just the start in the openlist
    this.openlist.push(this.startNode)

    //while we have options
    while (this.openlist.length > 0) {
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


class Node {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.g = Number.MAX_SAFE_INTEGER*0.99;
    this.isGood = true;
    this.daddy = null;
  }
}
