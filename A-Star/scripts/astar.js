class Node {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.g = Number.MAX_SAFE_INTEGER*0.99;
    this.isGood = true;
    this.daddy;
  }
}
let openlist = [];
let closedList = [];
let currentNode;

let startNode;
let endNode;

function getMin() {
  let min = openlist[0];
  openlist.forEach(n => {
    if (f(n) < f(min)) min = n;
  });
  openlist.splice(openlist.indexOf(min), 1);
  return min;

}

function h(n) {
  if (endNode) {
    return dist(endNode.x, endNode.y, n.x, n.y);
  }
  return 0;
}

function f(n) {
  return n.g + h(n);
}

function expandNode(n, ns) {
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
    // console.log(neighbours, ne);
    if (!closedList.includes(ne) && ne.isGood) {
      let newG = n.g + dist(n.x, n.y, ne.x, ne.y);
      if (!(openlist.includes(ne) && newG >= ne.g)) {
        ne.daddy = n;
        ne.g = newG;
        ne.f = ne.g + h(ne);
        openlist.push(ne);
      }
    }
  });

}

function getPath(_ns) {
  openlist = [];
  closedList = [];


  if (!startNode || !endNode) return false;

  openlist.push(startNode)

  while (openlist.length > 0) {
    currentNode = getMin();
    if (currentNode === endNode) return true;
    closedList.push(currentNode);
    expandNode(currentNode, _ns);
  }
  return false;
}
