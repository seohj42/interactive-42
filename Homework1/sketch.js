// function setup() {
//   createCanvas(windowWidth, windowHeight);
// }

// function draw() {
//   background(240);
//   fill(50, 150, 250);
//   circle(mouseX, mouseY, 50);
// }

const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;

let engine;
let ground;

let ball1, ball2, ball3, ball4, ball5;
let ball6, ball7, ball8, ball9, ball10;
let ball11, ball12, ball13, ball14, ball15;

let rect1, rect2, rect3, rect4, rect5;
let rect6, rect7, rect8, rect9, rect10;
let rect11, rect12, rect13, rect14, rect15;

let gx, gy;
let gw = 400;
let gh = 20;

// 각 팡이 실행됐는지 확인
let leftExploded = false;
let rightExploded = false;
let centerExploded = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  print(Matter);

  engine = Engine.create();

  engine.gravity.y = 1;
  engine.gravity.x = 0;
  engine.gravity.scale = 0.0002;

  //wall

  let margin = 10;

  Composite.add(engine.world, [
    Bodies.rectangle(width / 2, height - margin, width, margin, {
      isStatic: true,
    }),

    Bodies.rectangle(width / 2, margin, width, margin, {
      isStatic: true,
    }),

    Bodies.rectangle(margin, height / 2, margin, height, {
      isStatic: true,
    }),

    Bodies.rectangle(width - margin, height / 2, margin, height, {
      isStatic: true,
    }),
  ]);

  //ground

  ground = Bodies.rectangle(width / 2, height - 40, gw, gh, {
    isStatic: true,
  });

  Composite.add(engine.world, ground);

  // 왼쪽 팡

  ball1 = Bodies.circle(width * 0.2, height * 0.35, 8, {
    restitution: 0.9,
    friction: 0.01,
  });

  ball2 = Bodies.circle(width * 0.2, height * 0.35, 7, {
    restitution: 0.9,
    friction: 0.01,
  });

  ball3 = Bodies.circle(width * 0.2, height * 0.35, 9, {
    restitution: 0.9,
    friction: 0.01,
  });

  ball4 = Bodies.circle(width * 0.2, height * 0.35, 7, {
    restitution: 0.9,
    friction: 0.01,
  });

  ball5 = Bodies.circle(width * 0.2, height * 0.35, 8, {
    restitution: 0.9,
    friction: 0.01,
  });

  rect1 = Bodies.rectangle(width * 0.2, height * 0.35, 20, 10, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect2 = Bodies.rectangle(width * 0.2, height * 0.35, 15, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect3 = Bodies.rectangle(width * 0.2, height * 0.35, 25, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect4 = Bodies.rectangle(width * 0.2, height * 0.35, 18, 10, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect5 = Bodies.rectangle(width * 0.2, height * 0.35, 22, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  // 오른쪽 팡

  ball6 = Bodies.circle(width * 0.8, height * 0.3, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  ball7 = Bodies.circle(width * 0.8, height * 0.3, 7, {
    restitution: 0.8,
    friction: 0.05,
  });

  ball8 = Bodies.circle(width * 0.8, height * 0.3, 9, {
    restitution: 0.8,
    friction: 0.05,
  });

  ball9 = Bodies.circle(width * 0.8, height * 0.3, 7, {
    restitution: 0.8,
    friction: 0.05,
  });

  ball10 = Bodies.circle(width * 0.8, height * 0.3, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect6 = Bodies.rectangle(width * 0.8, height * 0.3, 20, 10, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect7 = Bodies.rectangle(width * 0.8, height * 0.3, 15, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect8 = Bodies.rectangle(width * 0.8, height * 0.3, 25, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect9 = Bodies.rectangle(width * 0.8, height * 0.3, 18, 10, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect10 = Bodies.rectangle(width * 0.8, height * 0.3, 22, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  // 가운데 팡

  ball11 = Bodies.circle(width * 0.5, height * 0.7, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  ball12 = Bodies.circle(width * 0.5, height * 0.7, 7, {
    restitution: 0.8,
    friction: 0.05,
  });

  ball13 = Bodies.circle(width * 0.5, height * 0.7, 9, {
    restitution: 0.8,
    friction: 0.05,
  });

  ball14 = Bodies.circle(width * 0.5, height * 0.7, 7, {
    restitution: 0.8,
    friction: 0.05,
  });

  ball15 = Bodies.circle(width * 0.5, height * 0.7, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect11 = Bodies.rectangle(width * 0.5, height * 0.7, 20, 10, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect12 = Bodies.rectangle(width * 0.5, height * 0.7, 15, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect13 = Bodies.rectangle(width * 0.5, height * 0.7, 25, 8, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect14 = Bodies.rectangle(width * 0.5, height * 0.7, 18, 10, {
    restitution: 0.8,
    friction: 0.05,
  });

  rect15 = Bodies.rectangle(width * 0.5, height * 0.7, 22, 8, {
    restitution: 0.8,
    friction: 0.05,
  });
}

function draw() {
  background("#bcd5ed");

  Engine.update(engine);

  if (frameCount >= 0 && leftExploded == false) {
    leftExploded = true;

    // add
    Composite.add(engine.world, [
      ball1,
      ball2,
      ball3,
      ball4,
      ball5,

      rect1,
      rect2,
      rect3,
      rect4,
      rect5,
    ]);

    Body.setVelocity(ball1, { x: -5, y: -7 });
    Body.setVelocity(ball2, { x: -3, y: -9 });
    Body.setVelocity(ball3, { x: 0, y: -9 });
    Body.setVelocity(ball4, { x: 3, y: -9 });
    Body.setVelocity(ball5, { x: 5, y: -7 });

    Body.setVelocity(rect1, { x: -6, y: -6 });
    Body.setVelocity(rect2, { x: -4, y: -8 });
    Body.setVelocity(rect3, { x: 0, y: -9 });
    Body.setVelocity(rect4, { x: 4, y: -8 });
    Body.setVelocity(rect5, { x: 6, y: -6 });
  }

  // 1초 후

  if (frameCount >= 60 && rightExploded == false) {
    rightExploded = true;

    Composite.add(engine.world, [
      ball6,
      ball7,
      ball8,
      ball9,
      ball10,

      rect6,
      rect7,
      rect8,
      rect9,
      rect10,
    ]);

    Body.setVelocity(ball6, { x: -5, y: -7 });
    Body.setVelocity(ball7, { x: -3, y: -9 });
    Body.setVelocity(ball8, { x: 0, y: -9 });
    Body.setVelocity(ball9, { x: 3, y: -9 });
    Body.setVelocity(ball10, { x: 5, y: -7 });

    Body.setVelocity(rect6, { x: -6, y: -6 });
    Body.setVelocity(rect7, { x: -4, y: -8 });
    Body.setVelocity(rect8, { x: 0, y: -9 });
    Body.setVelocity(rect9, { x: 4, y: -8 });
    Body.setVelocity(rect10, { x: 6, y: -6 });
  }

  // 2초 후

  if (frameCount >= 120 && centerExploded == false) {
    centerExploded = true;

    Composite.add(engine.world, [
      ball11,
      ball12,
      ball13,
      ball14,
      ball15,

      rect11,
      rect12,
      rect13,
      rect14,
      rect15,
    ]);

    Body.setVelocity(ball11, { x: -5, y: -7 });
    Body.setVelocity(ball12, { x: -3, y: -9 });
    Body.setVelocity(ball13, { x: 0, y: -9.5 });
    Body.setVelocity(ball14, { x: 3, y: -9 });
    Body.setVelocity(ball15, { x: 5, y: -7 });

    Body.setVelocity(rect11, { x: -6, y: -6 });
    Body.setVelocity(rect12, { x: -4, y: -8 });
    Body.setVelocity(rect13, { x: 0, y: -9.5 });
    Body.setVelocity(rect14, { x: 4, y: -8 });
    Body.setVelocity(rect15, { x: 6, y: -6 });
  }

  // GROUND

  gx = ground.position.x;
  gy = ground.position.y;

  fill("#ff4800");
  rect(gx, gy, gw, gh);

  // 왼쪽 원

  if (leftExploded == true) {
    fill("#ff74da");
    circle(ball1.position.x, ball1.position.y, 16);

    fill("#ffc9f7");
    circle(ball2.position.x, ball2.position.y, 14);

    fill("#eb68c6");
    circle(ball3.position.x, ball3.position.y, 18);

    fill("#ffa7b9");
    circle(ball4.position.x, ball4.position.y, 14);

    fill("#f222c5");
    circle(ball5.position.x, ball5.position.y, 16);
  }

  // 오른쪽 원

  if (rightExploded == true) {
    fill("#9bff7d");
    circle(ball6.position.x, ball6.position.y, 16);

    fill("#77e356");
    circle(ball7.position.x, ball7.position.y, 14);

    fill("#33dd88");
    circle(ball8.position.x, ball8.position.y, 18);

    fill("#d7fcb6");
    circle(ball9.position.x, ball9.position.y, 14);

    fill("#0b8e2c");
    circle(ball10.position.x, ball10.position.y, 16);
  }

  // 가운데 원

  if (centerExploded == true) {
    fill("#aff3ff");
    circle(ball11.position.x, ball11.position.y, 16);

    fill("#4caae9");
    circle(ball12.position.x, ball12.position.y, 14);

    fill("#2e76f4");
    circle(ball13.position.x, ball13.position.y, 18);

    fill("#3eb4d8");
    circle(ball14.position.x, ball14.position.y, 14);

    fill("#b1e9ff");
    circle(ball15.position.x, ball15.position.y, 16);
  }

  // 왼쪽 사각형

  if (leftExploded == true) {
    fill("#ff9662");
    push();
    translate(rect1.position.x, rect1.position.y);
    rotate(rect1.angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#ff9662");
    push();
    translate(rect2.position.x, rect2.position.y);
    rotate(rect2.angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#ffb894");
    push();
    translate(rect3.position.x, rect3.position.y);
    rotate(rect3.angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#fbb560");
    push();
    translate(rect4.position.x, rect4.position.y);
    rotate(rect4.angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#e84b40");
    push();
    translate(rect5.position.x, rect5.position.y);
    rotate(rect5.angle);
    rect(0, 0, 22, 8);
    pop();
  }

  // 오른쪽 사각형

  if (rightExploded == true) {
    fill("#af6ae0");
    push();
    translate(rect6.position.x, rect6.position.y);
    rotate(rect6.angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#6c62f3");
    push();
    translate(rect7.position.x, rect7.position.y);
    rotate(rect7.angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#d396ff");
    push();
    translate(rect8.position.x, rect8.position.y);
    rotate(rect8.angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#af6ae0");
    push();
    translate(rect9.position.x, rect9.position.y);
    rotate(rect9.angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#841c8c");
    push();
    translate(rect10.position.x, rect10.position.y);
    rotate(rect10.angle);
    rect(0, 0, 22, 8);
    pop();
  }

  // 가운데 사각형

  if (centerExploded == true) {
    fill("#f1ff33");
    push();
    translate(rect11.position.x, rect11.position.y);
    rotate(rect11.angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#f24422");
    push();
    translate(rect12.position.x, rect12.position.y);
    rotate(rect12.angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#22d6f2");
    push();
    translate(rect13.position.x, rect13.position.y);
    rotate(rect13.angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#f1ff33");
    push();
    translate(rect14.position.x, rect14.position.y);
    rotate(rect14.angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#f8ff9c");
    push();
    translate(rect15.position.x, rect15.position.y);
    rotate(rect15.angle);
    rect(0, 0, 22, 8);
    pop();
  }
}
