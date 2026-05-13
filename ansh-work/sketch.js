// let carY = 600

let cars = [];
let laneTypes = ["FASTag", "MANUAL", "FASTag", "MANUAL"];
let densitySlider;
let tempSlider;
let barrierAngles = [0, 0, 0, 0];
let currentAngles = [0, 0, 0, 0]; // For smooth animation
let tollMessages = ["Scanner Error!", "Cash Issue!", "FASTag Invalid!"];

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
      "Traffic Density : " + densitySlider.value(),
      20,
      590
    );

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

  // BETTER UI: Main structural hoarding support
  fill(80);
  rect(170, 0, 10, 600); // Left pillar
  rect(800, 0, 10, 600); // Right pillar

  fill(15, 107, 62);

  noStroke();

  // making the hording / rectangular heading  of toll 

  // Visual improvement: Adding a shadow/depth effect to hoarding
  fill(10, 70, 40);
  rect(180, 5, 620, 60); 

  fill(15, 107, 62);
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
    // Styling the labels
    if(laneTypes[i] === "FASTag") fill(0, 255, 255);
    else fill(255, 255, 0);
    
    text(laneTypes[i], laneTextX[i], 30);
  
  }

  //  Barrier 

  let barrierX = [250, 410, 570, 730];

  for (let i = 0; i < 4; i++) {
    // Smooth animation logic
    currentAngles[i] = lerp(currentAngles[i], barrierAngles[i], 0.1);

    push();
    translate(barrierX[i], 80);
    
    // Barrier Base/Post
    fill(100);
    noStroke();
    rect(-10, -10, 20, 20);

    rotate(radians(currentAngles[i]));

    // Barrier Arm (Striped look)
    strokeWeight(8);
    stroke(255);
    line(0, 0, 75, 0);
    stroke(255, 0, 0);
    drawingContext.setLineDash([10, 10]);
    line(5, 0, 70, 0);
    drawingContext.setLineDash([]); // reset dash

    pop();
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
      // VEHICLE VARIETY LOGIC
      let typeRoll = random(1);
      let vType = "CAR";
      let vW = 60;
      let vH = 100;
      let vCol = color(255, 140, 0);

      if(typeRoll < 0.2) { 
        vType = "TRUCK"; vW = 70; vH = 150; vCol = color(100); 
      } else if(typeRoll < 0.4) {
        vType = "BUS"; vW = 65; vH = 130; vCol = color(50, 100, 200);
      }

      let car = {

        x: randomLane.x - (vW-60)/2, // Centering variety

        y: 650,

        speed: random(3, 5),

        lane: randomLane.lane,

        waitTimer: 0,

        emoji: "🙂",
        
        type: vType,
        w: vW,
        h: vH,
        col: vCol

      };

      cars.push(car);

    }

  }

}

function moveCars() {
  
  // Reset barriers if no car is near
  for(let i=0; i<4; i++) {
     barrierAngles[i] = 0; 
  }

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
        car.y - other.y < (car.h + 20) // Dynamic distance based on vehicle height
      ) {

        targetSpeed = 0;

      }

    }

    // TOLL STOPPING LOGIC 

    // MANUAL lanes

    if (laneType === "MANUAL") {

      // Stop near barrier

      if (car.y < 160 && car.y > 90) {

        targetSpeed = 0;
        // barrierAngles controlled by wait timer below

        // Wait longer

        car.waitTimer++;

        // After waiting enough

        if (car.waitTimer > 80) {

          targetSpeed = 2;
          barrierAngles[car.lane] = -80; // Fully open

        } else {
          barrierAngles[car.lane] = 0; // Keep closed while waiting
        }

      }

    }

    // FASTag lanes

    else if (laneType === "FASTag") {

      // Small slow zone

      if (car.y < 160 && car.y > 90) {

        targetSpeed = 2;
        barrierAngles[car.lane] = -80; // Open for FASTag

      }

    }

    // Emotional reactions

    // Emotional reactions affected by temperature

    let temp = tempSlider.value();

    // Heat increases frustration faster

    let angryLimit = map(temp, 20, 50, 150, 70);

    let annoyedLimit = map(temp, 20, 50, 100, 40);

    let neutralLimit = map(temp, 20, 50, 50, 20);

    if (laneType === "FASTag" && car.waitTimer < 20) {

      car.emoji = "🙂";

    }

    else if (car.waitTimer > angryLimit) {

      car.emoji = "🤬";

    }

    else if (car.waitTimer > annoyedLimit) {

      car.emoji = "😡";

    }

    else if (car.waitTimer > neutralLimit) {

      car.emoji = "😐";

    }

    else {

      car.emoji = "🙂";

    }

    car.y -= targetSpeed;

  }

  // Remove cars after leaving screen

  cars = cars.filter(car => car.y > -200);

}

function displayCars() {

  for (let car of cars) {

    fill(car.col);

    stroke(0, 50);
    strokeWeight(2);

    rect(car.x, car.y, car.w, car.h, 8);
    
    // Adding windows/details to vehicles
    fill(200, 230, 255, 200);
    rect(car.x + 5, car.y + 10, car.w - 10, 20, 2); // Front windshield

    textSize(24);

    textAlign(CENTER);
    
    noStroke();
    fill(255);
    text(
      car.emoji,
      car.x + car.w/2,
      car.y - 15
    );

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