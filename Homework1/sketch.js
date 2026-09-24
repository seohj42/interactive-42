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

// 엔진 객체 생성
let engine;

// 바디 생성
let box, ground;

let ball, ball1, ball2, ball3, ball4;
let ball5, ball6, ball7, ball8;

let bx, by, gx, gy, cx, cy;

let bw = 300;
let bh = 2;

let cr = 30;

let gw = 400;
let gh = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  print(Matter);

  engine = Engine.create();

  // 중력
  engine.gravity.y = 1;
  engine.gravity.x = 0;
  engine.gravity.scale = 0.0005;

  // walls
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

  // Ball bodies

  ball = Bodies.circle(width / 2 - 300, 150, 30);

  ball1 = Bodies.circle(width / 2 - 190, 100, 50);

  ball2 = Bodies.circle(width / 2 - 70, 250, 35);

  ball3 = Bodies.circle(width / 2 + 80, 100, 60);

  ball4 = Bodies.circle(width / 2 + 220, 200, 25);

  ball5 = Bodies.circle(width / 2 - 240, 400, 45);

  ball6 = Bodies.circle(width / 2 - 40, 250, 70);

  ball7 = Bodies.circle(width / 2 + 150, 380, 30);

  ball8 = Bodies.circle(width / 2 + 300, 450, 50);

  // box ground body
  box = Bodies.rectangle(width / 2, 50, bw, bh);

  ground = Bodies.rectangle(width / 2, height - 40, gw, gh, {
    isStatic: true,
  });

  // Add
  Composite.add(engine.world, [
    ground,
    ball,
    ball1,
    ball2,
    ball3,
    ball4,
    ball5,
    ball6,
    ball7,
    ball8,
  ]);

  Body.setAngularVelocity(box, 0.1);
}

function draw() {
  background(200);

  Engine.update(engine);

  print(box.position.y);

  // position update
  bx = box.position.x;
  by = box.position.y;

  gx = ground.position.x;
  gy = ground.position.y;

  cx = ball.position.x;
  cy = ball.position.y;

  // Ground
  fill("#ff4800");
  rect(gx, gy, gw, gh);

  // Box
  // push();
  // fill(0, 0, 255);
  // translate(bx, by);
  // rotate(box.angle);
  // rect(0, 0, bw, bh);
  // pop();

  // Ball
  fill(255);

  circle(cx, cy, 30 * 2);

  circle(ball1.position.x, ball1.position.y, 50 * 2);

  circle(ball2.position.x, ball2.position.y, 35 * 2);

  circle(ball3.position.x, ball3.position.y, 60 * 2);

  circle(ball4.position.x, ball4.position.y, 25 * 2);

  circle(ball5.position.x, ball5.position.y, 45 * 2);

  circle(ball6.position.x, ball6.position.y, 70 * 2);

  circle(ball7.position.x, ball7.position.y, 30 * 2);

  circle(ball8.position.x, ball8.position.y, 50 * 2);
}
