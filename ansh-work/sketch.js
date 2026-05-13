// let carY = 600

let cars = [];
let laneTypes = ["FASTag", "MANUAL", "FASTag", "MANUAL"];
let densitySlider;
let tempSlider;
let barrierAngles = [0, 0, 0, 0];
let currentAngles = [0, 0, 0, 0]; // For smooth animation
let tollMessages = ["Scanner Error!", "Cash Issue!", "FASTag Invalid!"];

// New Audio assignment (Friend's logic to prevent loading hang)
let horn1 = new Audio('horn1.mp3'); 
let horn2 = new Audio('horn2.mp3');

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

  // Added structural pillars for UI
  fill(100);
  rect(175, 0, 10, 600);
  rect(800, 0, 10, 600);

  fill(15, 107, 62);

  noStroke();

  // making the hording / rectangular heading  of toll 
  fill(10, 70, 40); // Depth shadow for UI
  rect(180, 5, 625, 60);

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
  
    if(laneTypes[i] === "FASTag") fill(100, 255, 255);
    else fill(255, 255, 100);

    text(laneTypes[i], laneTextX[i], 30);
  
  }

  //  Barrier 

  // CHANGED: Pivot points for realistic side rotation
  let barrierPivotX = [185, 345, 505, 665];

  for (let i = 0; i < 4; i++) {

  currentAngles[i] = lerp(currentAngles[i], barrierAngles[i], 0.1);

  push();

  translate(barrierPivotX[i], 80);

  rotate(radians(currentAngles[i]));

  stroke(255);

  strokeWeight(6);

  line(0, 0, 130, 0); // Barrier Arm
  
  stroke(200, 0, 0);
  drawingContext.setLineDash([15, 15]);
  line(10, 0, 120, 0); // Stripes
  drawingContext.setLineDash([]);

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

      { x: 250, lane: 0 },

      { x: 410, lane: 1 },

      { x: 570, lane: 2 },

      { x: 730, lane: 3 }

    ];

    let randomLane = random(laneData);

    let canSpawn = true;

    for (let car of cars) {

      if (
        car.lane === randomLane.lane &&
        car.y > 450
      ) {

        canSpawn = false;

      }

    }

    if (canSpawn) {
      // VEHICLE TYPE LOGIC
      let typeRoll = random(1);
      let vW = 60, vH = 100, vCol = color(255, 140, 0), vType = "CAR";

      if(typeRoll < 0.2) {
        vW = 75; vH = 160; vCol = color(80, 80, 90); vType = "TRUCK";
      } else if(typeRoll < 0.4) {
        vW = 70; vH = 140; vCol = color(40, 100, 200); vType = "BUS";
      }

      let car = {

        x: randomLane.x - vW/2,

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
        car.y - other.y < (car.h + 30)
      ) {

        targetSpeed = 0;

      }

    }

    // TOLL STOPPING LOGIC 

    // MANUAL lanes

    if (laneType === "MANUAL") {

      // Stop near barrier

      if (car.y < 180 && car.y > 90) {

        targetSpeed = 0;
        
        // Wait longer

        car.waitTimer++;
        
        // NEW SOUND: Horn play logic
        if (car.waitTimer === 45) {
            horn1.play().catch(e => console.log("Click to enable sound"));
        }

        // After waiting enough

        if (car.waitTimer > 80) {

          targetSpeed = 2;
          
          // NEW SOUND: Barrier open sound
          if (barrierAngles[car.lane] !== -90) {
              horn2.play().catch(e => {});
          }
          barrierAngles[car.lane] = -90;

        } else {
          barrierAngles[car.lane] = 0;
        }

      } else if (car.y <= 90) {
          barrierAngles[car.lane] = 0;
      }

    }

    // FASTag lanes

    else if (laneType === "FASTag") {

      // Small slow zone

      if (car.y < 200 && car.y > 90) {

        targetSpeed = 2.5;
        
        // NEW SOUND: FASTag barrier open sound
        if (barrierAngles[car.lane] !== -90) {
            horn2.play().catch(e => {});
        }
        barrierAngles[car.lane] = -90;

      } else if (car.y <= 90) {
          barrierAngles[car.lane] = 0;
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

    // SHAPE BETTERMENT (Adding wheels and windows)
    push();
    translate(car.x, car.y);
    
    fill(20);
    rect(-5, 15, 10, 25); rect(car.w - 5, 15, 10, 25); // Front Wheels
    rect(-5, car.h - 40, 10, 25); rect(car.w - 5, car.h - 40, 10, 25); // Back Wheels

    fill(car.col);
    stroke(0, 50);
    rect(0, 0, car.w, car.h, 12);

    fill(180, 220, 255, 200);
    rect(5, 10, car.w - 10, 25, 5); // Windshield

    fill(255, 255, 150);
    ellipse(15, 5, 12, 8); ellipse(car.w - 15, 5, 12, 8); // Headlights
    pop();

    textSize(24);

    textAlign(CENTER);

    text(
      car.emoji,
      car.x + car.w/2,
      car.y - 20
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