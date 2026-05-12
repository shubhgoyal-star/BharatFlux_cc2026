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
//   line to divide the road 
  stroke(255);
  strokeWeight(5);

  line(340, 0, 340, 600);
  line(500, 0, 500, 600);
  line(660, 0, 660, 600);
  fill(15, 107, 62);
  noStroke();
// making the hording / rectangular heading  of toll 
  rect(180, 0, 140, 60);
  rect(340, 0, 140, 60);
  rect(500, 0, 140, 60);
  rect(660, 0, 140, 60);

  //   this will add the text on the hording 
  fill(255);
  textSize(22);
  textAlign(CENTER, CENTER);
  
  text("FASTag", 250, 30);


}