function setup() {
    createCanvas(1000, 600);
}

function draw() {
    background(30);
    drawRoads()

}
// function to make the roads
function drawRoads() {

  // Background of road 
  fill(50);
  noStroke();

  // Highway with 4 lanes 
  rect(180, 0, 140, 600);
  rect(340, 0, 140, 600);
  rect(500, 0, 140, 600);
  rect(660, 0, 140, 600);
}
