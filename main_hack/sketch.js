// let carY = 600

let cars = [];
let laneTypes = ["FASTag", "MANUAL", "FASTag", "MANUAL"];
let densitySlider;
let tempSlider;
let barrierAngles = [0, 0, 0, 0];
let currentAngles = [0, 0, 0, 0]; // For smooth animation
let tollMessages = ["Scanner Error!", "Cash Issue!", "FASTag Invalid!"];

// Native Audio logic (Friend's tip to prevent loading hang)
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

    // --- NEW: PROJECT TITLE ---
    fill(255);
    noStroke();
    textSize(32);
    textAlign(CENTER);
    textStyle(BOLD);
    text("Indore - Ujjain Toll Plaza", width/2, 45);
    textStyle(NORMAL); // Reset style for other text

    drawRoads();

    // drawCar()  <-- Purana comment as it is

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

    // --- NEW: SIDE INSTRUCTIONS & DRAMA KEY ---
    fill(255, 255, 0);
    textSize(14);
    textAlign(RIGHT);
    text("TIP: Click on hoarding (FASTag/MANUAL)\nto switch lane type!", 980, 565);
    
    textAlign(CENTER);
    fill(255, 100, 100);
    text("Press 'S' for VIP Convoy Drama (Manual Lane)", 650, 590);

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

  // Structural pillars for hoarding
  fill(100);
  rect(175, 0, 10, 600);
  rect(800, 0, 10, 600);

  fill(15, 107, 62);

  noStroke();

  // making the hording / rectangular heading  of toll 
  fill(10, 70, 40); 
  rect(180, 70, 625, 60); // Adjusted Y to fit Title

  fill(15, 107, 62);
  rect(180, 65, 140, 60);

  rect(340, 65, 140, 60);

  rect(500, 65, 140, 60);

  rect(660, 65, 140, 60);

  //   this will add the text on the hording 

  fill(255);

  textSize(22);

  textAlign(CENTER, CENTER);

  let laneTextX = [250, 410, 570, 730];

  for (let i = 0; i < 4; i++) {
    if(laneTypes[i] === "FASTag") fill(100, 255, 255);
    else fill(255, 255, 100);
    text(laneTypes[i], laneTextX[i], 95);
  }

  //  Barrier 

  let barrierPivotX = [185, 345, 505, 665];

  for (let i = 0; i < 4; i++) {
    currentAngles[i] = lerp(currentAngles[i], barrierAngles[i], 0.1);
    push();
    translate(barrierPivotX[i], 145); // Niche shift for new layout
    fill(50);
    noStroke();
    rect(-5, -5, 10, 15);
    rotate(radians(currentAngles[i]));
    strokeWeight(6);
    stroke(255);
    line(0, 0, 130, 0);
    stroke(200, 0, 0);
    drawingContext.setLineDash([15, 15]);
    line(10, 0, 120, 0);
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

function keyPressed() {
    // TRIGGER: Press 'S' for VIP Convoy
    if (key === 's' || key === 'S') {
        triggerVIPDrama();
    }
}

function triggerVIPDrama() {
    let laneX = 410; // Lane 1 (Manual)
    // REMOVED: "Baap" dialogue as requested
    let dialogues = ["Netaji ki gaadi hai!", "Local hai bhai!", "Chutta nahi hai!", "Scanner check karo!"];
    
    // 1. Escort Truck (Black)
    spawnSpecialCar(laneX, color(20), "TRUCK", 0); 
    
    // 2. VIP Car (White) - The Troublemaker
    setTimeout(() => {
        spawnSpecialCar(laneX, color(255), "CAR", 450, random(dialogues));
    }, 1200);
    
    // 3. Follower Truck (Black)
    setTimeout(() => {
        spawnSpecialCar(laneX, color(20), "TRUCK", 0);
    }, 2400);
}

function spawnSpecialCar(x, col, type, extraWait, msg = "") {
    let vW = (type === "TRUCK") ? 75 : 60;
    let vH = (type === "TRUCK") ? 160 : 100;
    
    cars.push({
        x: x - vW/2, 
        y: 650, 
        speed: 4, 
        lane: 1, 
        waitTimer: 0, 
        emoji: "🙂", 
        type: type, 
        w: vW, h: vH, 
        col: col, 
        specialWait: extraWait, 
        dramaText: msg
    });
}

function spawnCars() {
  let spawnRate = map(densitySlider.value(), 20, 100, 70, 15);
  
  if (frameCount % floor(spawnRate) === 0) {
    let laneData = [{x: 250, lane: 0}, {x: 410, lane: 1}, {x: 570, lane: 2}, {x: 730, lane: 3}];
    let randomLane = random(laneData);
    let canSpawn = true;
    
    for (let car of cars) {
      if (car.lane === randomLane.lane && car.y > 450) canSpawn = false;
    }
    
    if (canSpawn) {
      let typeRoll = random(1);
      let vW = 60, vH = 100, vCol = color(255, 140, 0), vType = "CAR";
      if(typeRoll < 0.2) { vW = 75; vH = 160; vCol = color(80, 80, 90); vType = "TRUCK"; }
      else if(typeRoll < 0.4) { vW = 70; vH = 140; vCol = color(40, 100, 200); vType = "BUS"; }

      cars.push({
        x: randomLane.x - vW/2, y: 650, speed: random(3, 5),
        lane: randomLane.lane, waitTimer: 0, emoji: "🙂",
        type: vType, w: vW, h: vH, col: vCol
      });
    }
  }
}

function moveCars() {
  for (let i = 0; i < cars.length; i++) {
    let car = cars[i];
    let laneType = laneTypes[car.lane];
    let targetSpeed = car.speed;
    let isBlocked = false;

    // Queue system
    for (let j = 0; j < cars.length; j++) {
      let other = cars[j];
      if (car !== other && car.lane === other.lane && other.y < car.y && car.y - other.y < (car.h + 30)) {
        targetSpeed = 0;
        isBlocked = true;

        // CHAOS: Honk repeatedly if stuck behind VIP Drama
        if (other.specialWait > 0 && car.waitTimer % 45 === 0) {
            horn1.play().catch(e => {});
            car.emoji = "🤬";
        }
      }
    }

    // TOLL STOPPING LOGIC 
    if (laneType === "MANUAL") {
      if (car.y < 250 && car.y > 150) { // Adjusted stop zone for new UI
        targetSpeed = 0;
        car.waitTimer++;
        
        let waitLimit = car.specialWait ? car.specialWait : 80;

        if (car.waitTimer === 45) {
            horn1.play().catch(e => {});
        }

        if (car.waitTimer > waitLimit) {
          targetSpeed = 2;
          if (barrierAngles[car.lane] !== -90) {
              horn2.play().catch(e => {});
          }
          barrierAngles[car.lane] = -90; 
        } else {
          barrierAngles[car.lane] = 0; 
        }
      } else if (car.y <= 150) {
          barrierAngles[car.lane] = 0;
      }
    }
    else if (laneType === "FASTag") {
      if (car.y < 280 && car.y > 150) {
        targetSpeed = 2.5;
        if (barrierAngles[car.lane] !== -90) {
            horn2.play().catch(e => {});
        }
        barrierAngles[car.lane] = -90; 
      } else if (car.y <= 150) {
        barrierAngles[car.lane] = 0;
      }
    }

    // Temperature frustration logic
    let temp = tempSlider.value();
    let angryLimit = map(temp, 20, 50, 150, 70);

    if (!isBlocked) {
        if (car.waitTimer > angryLimit) car.emoji = "🤬";
        else if (car.waitTimer > 30) car.emoji = "😡";
        else car.emoji = "🙂";
    }

    car.y -= targetSpeed;
  }
  cars = cars.filter(car => car.y > -200);
}

function displayCars() {
  for (let car of cars) {
    push();
    translate(car.x, car.y);
    
    // Wheels
    fill(20);
    rect(-5, 15, 10, 25); rect(car.w - 5, 15, 10, 25); 
    rect(-5, car.h - 40, 10, 25); rect(car.w - 5, car.h - 40, 10, 25);

    // Body
    fill(car.col);
    stroke(0, 50);
    rect(0, 0, car.w, car.h, 12);

    // Windshield
    fill(180, 220, 255, 200);
    rect(5, 10, car.w - 10, 25, 5); 

    // DRAMA DIALOGUE BOX
    if (car.dramaText && car.waitTimer > 10 && car.waitTimer < car.specialWait) {
        fill(255, 255, 100);
        rect(-20, -60, 140, 30, 5);
        fill(0);
        textSize(14);
        textAlign(CENTER, CENTER);
        text(car.dramaText, car.w/2, -45);
    }

    pop();

    textSize(24);
    textAlign(CENTER);
    fill(255);
    text(car.emoji, car.x + car.w/2, car.y - 15);
  }
} 

function mousePressed() {
  // Audio context resume
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  let laneStartX = [180, 340, 500, 660];
  // Detection for Hoarding Click
  for (let i = 0; i < 4; i++) {
    if (mouseX > laneStartX[i] && mouseX < laneStartX[i] + 140 && mouseY > 65 && mouseY < 125) {
      toggleLane(i);
    }
  }
}

function toggleLane(laneIndex) {
  laneTypes[laneIndex] = (laneTypes[laneIndex] === "FASTag") ? "MANUAL" : "FASTag";
}