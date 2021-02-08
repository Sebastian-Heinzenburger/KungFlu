var nodeSize;
var nodes = [];
let path = false;
let d;
let bg;

function setup() {
  doFull = false;
  nodeSize = windowWidth > windowHeight ? windowHeight/22 : windowWidth/39;

  let n;
  for (var x = 0; x < windowWidth/nodeSize; x++) {
    nodes.push([]);
    for (var y = 0; y < windowHeight/nodeSize; y++) {
      n = new Node(x, y);
      nodes[x][y] = n;
    }
  }

  createCanvas(windowWidth, windowHeight);
  alert("press S and click to set START\npress E and click to set END\npress SPACE and click to REMOVE OBSTACLES\npress X and drag click to set OBSTACLES");
}

function preload() {
  bg = loadImage('../pictures/Klassenzimmer.png');
}

function draw() {

  background(60);

  if (!path) {
    path = getPath(nodes);
  }

  for (var x = 0; x < windowWidth/nodeSize; x++) {
    for (var y = 0; y < windowHeight/nodeSize; y++) {
        fill(120, 120, 120, 0);
        if(openlist.includes(nodes[x][y])) fill(0, 255, 0);
        if(closedList.includes(nodes[x][y])) fill(0, 100, 0);
        if(startNode === nodes[x][y]) fill(0, 0, 255);
        if(endNode === nodes[x][y]) fill(255, 0, 0);
        if(!nodes[x][y].isGood) fill(20);
        console.log("ok");
        rect(nodes[x][y].x*nodeSize, nodes[x][y].y*nodeSize, nodeSize);
    }
  }

  if (path) {
    fill(255, 255, 255);
    let n = endNode.daddy;
    while (n != startNode && n.daddy) {
      rect(n.x*nodeSize, n.y*nodeSize, nodeSize);
      n = n.daddy;
    }
  }

  fill(255, 0, 0);
  if (!path) { text("no path", 30, 30) }
  fill(255);
  text(''+Math.floor(mouseX/nodeSize) +'|'+Math.floor(mouseY/nodeSize), mouseX, mouseY)

}

function mousePressed(event) {
  mouseDragged(event);
  return false;
}

function mouseDragged(event) {
  switch (key) {
    case 'e':
      endNode = nodes[Math.floor(event.x/nodeSize)][Math.floor(event.y/nodeSize)];
      break;
    case ' ':
      nodes[Math.floor(event.x/nodeSize)][Math.floor(event.y/nodeSize)].isGood = true;
      break;
    case 'x':
    case 'o':
      nodes[Math.floor(event.x/nodeSize)][Math.floor(event.y/nodeSize)].isGood = false;
      break;
    default:
      if (nodes[Math.floor(event.x/nodeSize)][Math.floor(event.y/nodeSize)].isGood) {
        startNode = nodes[Math.floor(event.x/nodeSize)][Math.floor(event.y/nodeSize)];
        startNode.g = 0;
      }
  }
  path = false;
  return false;
}
