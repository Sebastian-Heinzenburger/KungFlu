let bg, nodes, nodeSize;
function preload() {
  bg = loadImage('../../pictures/Klassenzimmer.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  nodeSize = windowWidth/30;
  nodes = [];
  for (var x = 0; x < windowWidth/nodeSize; x++) {
    nodes.push([]);
    for (var y = 0; y < windowHeight/nodeSize; y++) {
      nodes[x][y] = {x, y, isGood: true};
    }
  }
}

function draw() {
  image(bg, 0, 0, windowWidth, windowHeight);
  for (var x = 0; x < windowWidth/nodeSize; x++) {
    for (var y = 0; y < windowHeight/nodeSize; y++) {
        fill(120, 120, 120, 0);
        if(!nodes[x][y].isGood) fill(20);
        rect(nodes[x][y].x*nodeSize, nodes[x][y].y*nodeSize, nodeSize);
    }
  }
}

function mousePressed(event) {
    nodes[Math.floor(event.x/nodeSize)][Math.floor(event.y/nodeSize)].isGood = false;

    console.clear();
    let l = "nodes:";
    for (var x = 0; x < windowWidth/nodeSize; x++) {
      for (var y = 0; y < windowHeight/nodeSize; y++) {
        if (!nodes[x][y].isGood) l += `nodes[${x}][${y}].isGood = false\n`;
      }
    }
    console.log(l);
}
