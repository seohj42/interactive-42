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
const Composites = Matter.Composites;
const Constraint = Matter.Constraint;

let engine;
let ground;

let bridge;
let bw = 50;
let bh = 20;
let bridgeCount = 15;
let bridgeGroup;

let leftExploded = false;
let rightExploded = false;
let centerExploded = false;

let leftBalls = [];
let rightBalls = [];
let centerBalls = [];

let leftRects = [];
let rightRects = [];
let centerRects = [];

let ballSizes = [11, 7, 9, 7, 8, 11, 7, 9, 7, 8];

let rectSizes = [
  { w: 20, h: 10 },
  { w: 15, h: 8 },
  { w: 25, h: 8 },
  { w: 18, h: 10 },
  { w: 22, h: 8 },

  { w: 20, h: 10 },
  { w: 15, h: 8 },
  { w: 25, h: 8 },
  { w: 18, h: 10 },
  { w: 22, h: 8 },
];

let upperVelocities = [
  { x: -5, y: -7 },
  { x: -3, y: -9 },
  { x: 0, y: -9 },
  { x: 3, y: -9 },
  { x: 5, y: -7 },
];

let lowerVelocities = [
  { x: -7.5, y: 1.0 },
  { x: -5.5, y: 4.0 },
  { x: 0.5, y: 3.5 },
  { x: 4.5, y: 4.0 },
  { x: 7.5, y: 1.5 },
];

let velocities = [
  upperVelocities[0],
  upperVelocities[1],
  upperVelocities[2],
  upperVelocities[3],
  upperVelocities[4],

  lowerVelocities[0],
  lowerVelocities[1],
  lowerVelocities[2],
  lowerVelocities[3],
  lowerVelocities[4],
];

function setup() {
  createCanvas(windowWidth, windowHeight);

  rectMode(CENTER);

  print(Matter);

  engine = Engine.create();

  engine.gravity.y = 1;
  engine.gravity.x = 0;
  engine.gravity.scale = 0.00045;

  // Walls

  let margin = 10;

  Composite.add(engine.world, [
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

  // Bridge

  bridgeGroup = Body.nextGroup(true);

  let bridgeStartX = (width - bw * bridgeCount) / 2;

  bridge = Composites.stack(
    bridgeStartX,
    height - 130,
    bridgeCount,
    1,
    0,
    0,
    function (x, y) {
      return Bodies.rectangle(x, y, bw, bh, {
        collisionFilter: {
          group: bridgeGroup,
        },

        chamfer: 5,

        density: 0.005,

        frictionAir: 0.05,
      });
    },
  );

  Composites.chain(bridge, 0.3, 0, -0.3, 0, {
    stiffness: 0.07,
    length: 0.0001,

    render: {
      visible: false,
    },
  });

  Composite.add(engine.world, [
    bridge,

    Constraint.create({
      pointA: {
        x: bridge.bodies[0].position.x - bw / 2,
        y: height - 130,
      },

      bodyB: bridge.bodies[0],

      pointB: {
        x: -bw / 2,
        y: 0,
      },

      length: 2,

      stiffness: 0.9,
    }),

    Constraint.create({
      pointA: {
        x: bridge.bodies[bridge.bodies.length - 1].position.x + bw / 2,
        y: height - 130,
      },

      bodyB: bridge.bodies[bridge.bodies.length - 1],

      pointB: {
        x: bw / 2,
        y: 0,
      },

      length: 2,

      stiffness: 0.9,
    }),
  ]);

  // 왼쪽 팡

  for (let i = 0; i < 10; i++) {
    leftBalls[i] = Bodies.circle(width * 0.2, height * 0.35, ballSizes[i], {
      restitution: 0.9,
      friction: 0.01,
    });

    leftRects[i] = Bodies.rectangle(
      width * 0.2,
      height * 0.35,
      rectSizes[i].w,
      rectSizes[i].h,
      {
        restitution: 0.8,
        friction: 0.05,
      },
    );
  }

  // 오른쪽 팡

  for (let i = 0; i < 10; i++) {
    rightBalls[i] = Bodies.circle(width * 0.8, height * 0.3, ballSizes[i], {
      restitution: 0.8,
      friction: 0.05,
    });

    rightRects[i] = Bodies.rectangle(
      width * 0.8,
      height * 0.3,
      rectSizes[i].w,
      rectSizes[i].h,
      {
        restitution: 0.8,
        friction: 0.05,
      },
    );
  }

  // 가운데 팡

  for (let i = 0; i < 10; i++) {
    centerBalls[i] = Bodies.circle(width * 0.5, height * 0.7, ballSizes[i], {
      restitution: 0.8,
      friction: 0.05,
    });

    centerRects[i] = Bodies.rectangle(
      width * 0.5,
      height * 0.7,
      rectSizes[i].w,
      rectSizes[i].h,
      {
        restitution: 0.8,
        friction: 0.05,
      },
    );
  }
}

function draw() {
  let gradient = drawingContext.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, "#6ea9ed");
  gradient.addColorStop(1, "#ddf3fb");

  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);

  Engine.update(engine);

  // 0초 (왼쪽)

  if (frameCount >= 0 && leftExploded == false) {
    leftExploded = true;

    for (let i = 0; i < 10; i++) {
      Composite.add(engine.world, [leftBalls[i], leftRects[i]]);

      Body.setVelocity(leftBalls[i], velocities[i]);

      Body.setVelocity(leftRects[i], velocities[i]);
    }
  }

  // 1초 (오른쪽)

  if (frameCount >= 60 && rightExploded == false) {
    rightExploded = true;

    for (let i = 0; i < 10; i++) {
      Composite.add(engine.world, [rightBalls[i], rightRects[i]]);

      Body.setVelocity(rightBalls[i], velocities[i]);

      Body.setVelocity(rightRects[i], velocities[i]);
    }
  }

  // 2초 (가운데)

  if (frameCount >= 120 && centerExploded == false) {
    centerExploded = true;

    for (let i = 0; i < 10; i++) {
      Composite.add(engine.world, [centerBalls[i], centerRects[i]]);

      if (i == 2) {
        Body.setVelocity(centerBalls[i], { x: 0, y: -9.5 });

        Body.setVelocity(centerRects[i], { x: 0, y: -9.5 });
      } else {
        Body.setVelocity(centerBalls[i], velocities[i]);

        Body.setVelocity(centerRects[i], velocities[i]);
      }
    }
  }

  // Bridge settings

  for (let i = 0; i < bridge.bodies.length; i++) {
    let part = bridge.bodies[i];

    push();

    translate(part.position.x, part.position.y);

    rotate(part.angle);

    fill("#fdffa3");
    noStroke();

    rect(0, 0, bw + 2, bh);

    pop();
  }

  // 왼쪽 원

  if (leftExploded == true) {
    noStroke();

    fill("#ff74da");
    circle(leftBalls[0].position.x, leftBalls[0].position.y, 22);

    fill("#ffc9f7");
    circle(leftBalls[1].position.x, leftBalls[1].position.y, 14);

    fill("#eb68c6");
    circle(leftBalls[2].position.x, leftBalls[2].position.y, 18);

    fill("#ffa7b9");
    circle(leftBalls[3].position.x, leftBalls[3].position.y, 14);

    fill("#f222c5");
    circle(leftBalls[4].position.x, leftBalls[4].position.y, 16);

    // 새 아래쪽 5개
    fill("#ff74da");
    circle(leftBalls[5].position.x, leftBalls[5].position.y, 22);

    fill("#ffc9f7");
    circle(leftBalls[6].position.x, leftBalls[6].position.y, 14);

    fill("#eb68c6");
    circle(leftBalls[7].position.x, leftBalls[7].position.y, 18);

    fill("#ffa7b9");
    circle(leftBalls[8].position.x, leftBalls[8].position.y, 14);

    fill("#f222c5");
    circle(leftBalls[9].position.x, leftBalls[9].position.y, 16);
  }

  // 오른쪽 원

  if (rightExploded == true) {
    fill("#9bff7d");
    circle(rightBalls[0].position.x, rightBalls[0].position.y, 22);

    fill("#77e356");
    circle(rightBalls[1].position.x, rightBalls[1].position.y, 14);

    fill("#33dd88");
    circle(rightBalls[2].position.x, rightBalls[2].position.y, 18);

    fill("#d7fcb6");
    circle(rightBalls[3].position.x, rightBalls[3].position.y, 14);

    fill("#0b8e2c");
    circle(rightBalls[4].position.x, rightBalls[4].position.y, 16);

    // 새 아래쪽 5개
    fill("#9bff7d");
    circle(rightBalls[5].position.x, rightBalls[5].position.y, 22);

    fill("#77e356");
    circle(rightBalls[6].position.x, rightBalls[6].position.y, 14);

    fill("#33dd88");
    circle(rightBalls[7].position.x, rightBalls[7].position.y, 18);

    fill("#d7fcb6");
    circle(rightBalls[8].position.x, rightBalls[8].position.y, 14);

    fill("#0b8e2c");
    circle(rightBalls[9].position.x, rightBalls[9].position.y, 16);
  }

  // 가운데 원

  if (centerExploded == true) {
    fill("#aff3ff");
    circle(centerBalls[0].position.x, centerBalls[0].position.y, 22);

    fill("#4caae9");
    circle(centerBalls[1].position.x, centerBalls[1].position.y, 14);

    fill("#2e76f4");
    circle(centerBalls[2].position.x, centerBalls[2].position.y, 18);

    fill("#3eb4d8");
    circle(centerBalls[3].position.x, centerBalls[3].position.y, 14);

    fill("#b1e9ff");
    circle(centerBalls[4].position.x, centerBalls[4].position.y, 16);

    // 새 아래쪽 5개
    fill("#aff3ff");
    circle(centerBalls[5].position.x, centerBalls[5].position.y, 22);

    fill("#4caae9");
    circle(centerBalls[6].position.x, centerBalls[6].position.y, 14);

    fill("#2e76f4");
    circle(centerBalls[7].position.x, centerBalls[7].position.y, 18);

    fill("#3eb4d8");
    circle(centerBalls[8].position.x, centerBalls[8].position.y, 14);

    fill("#b1e9ff");
    circle(centerBalls[9].position.x, centerBalls[9].position.y, 16);
  }

  // 왼쪽 사각형

  if (leftExploded == true) {
    fill("#ff9662");
    push();
    translate(leftRects[0].position.x, leftRects[0].position.y);
    rotate(leftRects[0].angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#ff9662");
    push();
    translate(leftRects[1].position.x, leftRects[1].position.y);
    rotate(leftRects[1].angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#ffb894");
    push();
    translate(leftRects[2].position.x, leftRects[2].position.y);
    rotate(leftRects[2].angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#fbb560");
    push();
    translate(leftRects[3].position.x, leftRects[3].position.y);
    rotate(leftRects[3].angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#e84b40");
    push();
    translate(leftRects[4].position.x, leftRects[4].position.y);
    rotate(leftRects[4].angle);
    rect(0, 0, 22, 8);
    pop();

    // 아래쪽 5개
    fill("#ff9662");
    push();
    translate(leftRects[5].position.x, leftRects[5].position.y);
    rotate(leftRects[5].angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#ff9662");
    push();
    translate(leftRects[6].position.x, leftRects[6].position.y);
    rotate(leftRects[6].angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#ffb894");
    push();
    translate(leftRects[7].position.x, leftRects[7].position.y);
    rotate(leftRects[7].angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#fbb560");
    push();
    translate(leftRects[8].position.x, leftRects[8].position.y);
    rotate(leftRects[8].angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#e84b40");
    push();
    translate(leftRects[9].position.x, leftRects[9].position.y);
    rotate(leftRects[9].angle);
    rect(0, 0, 22, 8);
    pop();
  }

  // 오른쪽 사각형

  if (rightExploded == true) {
    fill("#af6ae0");
    push();
    translate(rightRects[0].position.x, rightRects[0].position.y);
    rotate(rightRects[0].angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#6c62f3");
    push();
    translate(rightRects[1].position.x, rightRects[1].position.y);
    rotate(rightRects[1].angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#d396ff");
    push();
    translate(rightRects[2].position.x, rightRects[2].position.y);
    rotate(rightRects[2].angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#af6ae0");
    push();
    translate(rightRects[3].position.x, rightRects[3].position.y);
    rotate(rightRects[3].angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#b81ec3");
    push();
    translate(rightRects[4].position.x, rightRects[4].position.y);
    rotate(rightRects[4].angle);
    rect(0, 0, 22, 8);
    pop();

    // 아래쪽 5개
    fill("#af6ae0");
    push();
    translate(rightRects[5].position.x, rightRects[5].position.y);
    rotate(rightRects[5].angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#6c62f3");
    push();
    translate(rightRects[6].position.x, rightRects[6].position.y);
    rotate(rightRects[6].angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#d396ff");
    push();
    translate(rightRects[7].position.x, rightRects[7].position.y);
    rotate(rightRects[7].angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#af6ae0");
    push();
    translate(rightRects[8].position.x, rightRects[8].position.y);
    rotate(rightRects[8].angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#841c8c");
    push();
    translate(rightRects[9].position.x, rightRects[9].position.y);
    rotate(rightRects[9].angle);
    rect(0, 0, 22, 8);
    pop();
  }

  // 가운데 사각형

  if (centerExploded == true) {
    fill("#f1ff33");
    push();
    translate(centerRects[0].position.x, centerRects[0].position.y);
    rotate(centerRects[0].angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#f24422");
    push();
    translate(centerRects[1].position.x, centerRects[1].position.y);
    rotate(centerRects[1].angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#22d6f2");
    push();
    translate(centerRects[2].position.x, centerRects[2].position.y);
    rotate(centerRects[2].angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#f1ff33");
    push();
    translate(centerRects[3].position.x, centerRects[3].position.y);
    rotate(centerRects[3].angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#f8ff9c");
    push();
    translate(centerRects[4].position.x, centerRects[4].position.y);
    rotate(centerRects[4].angle);
    rect(0, 0, 22, 8);
    pop();

    // 아래쪽 5개
    fill("#f1ff33");
    push();
    translate(centerRects[5].position.x, centerRects[5].position.y);
    rotate(centerRects[5].angle);
    rect(0, 0, 20, 10);
    pop();

    fill("#f24422");
    push();
    translate(centerRects[6].position.x, centerRects[6].position.y);
    rotate(centerRects[6].angle);
    rect(0, 0, 15, 8);
    pop();

    fill("#22d6f2");
    push();
    translate(centerRects[7].position.x, centerRects[7].position.y);
    rotate(centerRects[7].angle);
    rect(0, 0, 25, 8);
    pop();

    fill("#f1ff33");
    push();
    translate(centerRects[8].position.x, centerRects[8].position.y);
    rotate(centerRects[8].angle);
    rect(0, 0, 18, 10);
    pop();

    fill("#f8ff9c");
    push();
    translate(centerRects[9].position.x, centerRects[9].position.y);
    rotate(centerRects[9].angle);
    rect(0, 0, 22, 8);
    pop();
  }
}
