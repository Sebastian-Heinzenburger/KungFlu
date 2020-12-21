class Node {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.g = Number.MAX_SAFE_INTEGER*0.99;
    this.isGood = true;
    this.daddy;
  }
}

//nodes that are under consideration
let openlist = [];
//nodes that we already dislike
let closedList = [];
//the note we currently examen
let currentNode;

//our goal and end
let startNode;
let endNode;

//find the open node with the least f cost
function getMin() {
  let min = openlist[0];
  openlist.forEach(n => {
    if (f(n) < f(min)) min = n;
  });
  //pop it out of the openlist
  openlist.splice(openlist.indexOf(min), 1);
  return min;
}

//returns the estimated distance to the end
function h(n) {
  return (endNode ? dist(endNode.x, endNode.y, n.x, n.y) : 0);
}

function f(n) {
  return n.g + h(n);
}

//
function expandNode(n, ns) {

  //get all the neighbouring nodes
  let neighbours = [];

  //top row
  if (n.y != 0) {
    if (n.x != 0) { neighbours.push(ns[n.x-1][n.y-1]); }
    neighbours.push(ns[n.x][n.y-1]);
    if (n.x != Math.floor(windowWidth/nodeSize)) { neighbours.push(ns[n.x+1][n.y-1]); }
  }

  //middle row
  if (n.x != 0) { neighbours.push(ns[n.x-1][n.y]); }
  if (n.x != Math.floor(windowWidth/nodeSize)) { neighbours.push(ns[n.x+1][n.y]); }

  //lower row
  if (n.y != Math.floor(windowHeight/nodeSize)) {
    if (n.x != 0) { neighbours.push(ns[n.x-1][n.y+1]); }
    neighbours.push(ns[n.x][n.y+1]);
    if (n.x != Math.floor(windowWidth/nodeSize)) { neighbours.push(ns[n.x+1][n.y+1]); }
  }


  neighbours.forEach(ne => {
    //if we were not already there
    // + obstacle check
    if (!closedList.includes(ne) && ne.isGood) {
      //estimate new g cost
      let newG = n.g + dist(n.x, n.y, ne.x, ne.y);
      //if node is new or the new g cost is better than the current
      if (!(openlist.includes(ne) && newG >= ne.g)) {
        //overwrite g cost and set self as parent
        ne.daddy = n;
        ne.g = newG;
        ne.f = ne.g + h(ne);
        //and add to openlist
        openlist.push(ne);
      }
    }
  });

}

//return true if path is possible
function getPath(_ns) {

  //stop if there is no endNode or startNode
  if (!startNode || !endNode) return false;

  //do housekeeping
  openlist = [];
  closedList = [];

  _ns.forEach(_n => {
    _n.g = Number.MAX_SAFE_INTEGER*0.99;
    delete _n.daddy;
  });

  //first there is just the start in the openlist
  openlist.push(startNode)

  //while we have options
  while (openlist.length > 0) {
    currentNode = getMin();
    //are we there yet?
    if (currentNode === endNode) return true;
    //nope? then were done with you
    closedList.push(currentNode);
    //look for someone hotter
    expandNode(currentNode, _ns);
  }

  return false;
}
