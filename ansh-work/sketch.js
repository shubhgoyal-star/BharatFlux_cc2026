// let carY = 600

let cars = [];
let laneTypes = ["FASTag", "MANUAL", "FASTag", "MANUAL"];
let densitySlider;
let tempSlider;

function setup() { 

    createCanvas(1000, 600);

    densitySlider = createSlider(20, 100, 50);
    densitySlider.position(20, 620);
    densitySlider.size(200);
    tempSlider = createSlider(20, 50, 30);

    tempSlider.position(260, 620);

    tempSlider.size(200);
    

}

function draw() {

    let temp = tempSlider.value();

    let skyBlue = map(temp, 20, 50, 220, 120);

    let skyGreen = map(temp, 20, 50, 230, 170);

    let skyRed = map(temp, 20, 50, 135, 255);

    background(skyRed, skyGreen, skyBlue);

    drawRoads();

    // drawCar()

    spawnCars();

    moveCars();

    displayCars();

    fill(255);

    noStroke();

    textSize(18);

    textAlign(LEFT);

    text(
      "Temperature : " + tempSlider.value() + "°C",
      260,
      590
    );

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

  // Lane 1

  let laneTextX = [250, 410, 570, 730];

  for (let i = 0; i < 4; i++) {
  
    text(laneTypes[i], laneTextX[i], 30);
  
  }

  //  Barrier 

  stroke(255, 0, 0);

  strokeWeight(6);

  line(200, 80, 300, 80);

  // Lane 2

  line(360, 80, 460, 80);

  // Lane 3

  line(520, 80, 620, 80);

  // Lane 4

  line(680, 80, 780, 80);

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

  let spawnRate = map(
    densitySlider.value(),
    20,
    100,
    70,
    15
  );

  if (frameCount % floor(spawnRate) === 0) {

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

        lane: randomLane.lane,

        waitTimer: 0

      };

      cars.push(car);

    }

  }

}

function moveCars() {

  for (let i = 0; i < cars.length; i++) {

    let car = cars[i];

    let laneType = laneTypes[car.lane];

    let targetSpeed = car.speed;

    // Queue system

    for (let j = 0; j < cars.length; j++) {

      let other = cars[j];

      if (
        car !== other &&
        car.lane === other.lane &&
        other.y < car.y &&
        car.y - other.y < 120
      ) {

        targetSpeed = 0;

      }

    }

    // ===== TOLL STOPPING LOGIC =====

    // MANUAL lanes

    if (laneType === "MANUAL") {

      // Stop near barrier

      if (car.y < 140 && car.y > 90) {

        targetSpeed = 0;

        // Wait longer

        car.waitTimer++;

        // After waiting enough

        if (car.waitTimer > 80) {

          targetSpeed = 2;

        }

      }

    }

    // FASTag lanes

    else if (laneType === "FASTag") {

      // Small slow zone

      if (car.y < 140 && car.y > 90) {

        targetSpeed = 2;

      }

    }

    car.y -= targetSpeed;

  }

  // Remove cars after leaving screen

  cars = cars.filter(car => car.y > -120);

}

function displayCars() {

  for (let car of cars) {

    fill(255, 140, 0);

    noStroke();

    rect(car.x, car.y, 60, 100, 10);

  }

} 

function mousePressed() {

  let laneStartX = [180, 340, 500, 660];

  for (let i = 0; i < 4; i++) {

    if (
      mouseX > laneStartX[i] &&
      mouseX < laneStartX[i] + 140 &&
      mouseY > 0 &&
      mouseY < 60
    ) {

      toggleLane(i);

    }

  }

}

function toggleLane(laneIndex) {

  if (laneTypes[laneIndex] === "FASTag") {

    laneTypes[laneIndex] = "MANUAL";

  }

  else {

    laneTypes[laneIndex] = "FASTag";

  }

}