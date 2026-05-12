// let carY = 600
let cars = [];
let laneTypes = ["FASTag", "MANUAL", "FASTag", "MANUAL"];
function setup() { 
    createCanvas(1000, 600);
}

function draw() {
    background(30);
    drawRoads()
    // drawCar()
    spawnCars();
    moveCars();
    displayCars();

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
  
//   text("FASTag", 250, 30);
//   text("MANUAL", 410, 30);
//   text("FASTag", 570, 30);
//   text("MANUAL", 730, 30);

//  Barrier 
stroke(255, 0, 0);
strokeWeight(6);

// Lane 1
line(200, 80, 300, 80);

// Lane 2
line(360, 80, 460, 80);

// Lane 3
line(520, 80, 620, 80);

// Lane 4
line(680, 80, 780, 80);
let laneTextX = [250, 410, 570, 730];

for (let i = 0; i < 4; i++) {

text(laneTypes[i], laneTextX[i], 30);

}

}

// Function to make car 

// function drawCar(){
//   fill(255, 140, 0);
//   noStroke();

//   rect(220, carY, 60, 100, 10);
// //   Condition to move the car 
//   carY = carY-3;

// // Condition to start the car from 600 again 
//     if(carY<-100){
//         carY = 600
//     }
// }

function spawnCars() {

  if (frameCount % 40 === 0) {

    let laneData = [
      { x: 220, lane: 0 },
      { x: 380, lane: 1 },
      { x: 540, lane: 2 },
      { x: 700, lane: 3 }
    ];

    let randomLane = random(laneData);

    let canSpawn = true;

    for (let car of cars) {

      if (
        car.lane === randomLane.lane &&
        car.y > 500
      ) {
        canSpawn = false;
      }

    }

    if (canSpawn) {

      let car = {
        x: randomLane.x,
        y: 650,
        speed: random(3, 5),
        lane: randomLane.lane
      };

      cars.push(car);

    }

  }

}
function moveCars() {

  for (let car of cars) {

    let laneType = laneTypes[car.lane];

    // Manual lanes slow more near toll
    if (laneType === "MANUAL" && car.y < 140) {

      car.y -= 1;

    }

    // FASTag lanes smoother
    else if (laneType === "FASTag" && car.y < 140) {

      car.y -= 3;

    }

    // Normal movement
    else {

      car.y -= car.speed;

    }

  }

}
function displayCars() {

  for (let car of cars) {

    fill(255, 140, 0);
    noStroke();

    rect(car.x, car.y, 60, 100, 10);

  }

}