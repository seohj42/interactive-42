// let bgColor = 220;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
// }

// function draw() {
//   background(bgColor);
//   fill(250, 100, 100);
//   circle(width / 2, height / 2, 100);
// }

// function mousePressed() {
//   bgColor = random(255);
// }

const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

let engine;
let cells = [];

let currentScene = 1; //시작하면 보여주는 화면이 1번 화면이게 고정
let dishX, dishY, dishR;
let cellScale = 1; // 접시 크기에 맞춰 세포 크기를 줄이는 비율
const REF_DISH_R = 250; // 이 크기(데스크톱 기준) 이상이면 원래 크기 그대로

let startX = 0,
  startY = 0;

let leftBtnScale = 1.0; //왼쪽 오른쪽 화살표 크기 변화 변수
let rightBtnScale = 1.0;

let lastSpawnTime = 0;
const spawnTime = 3000; //리스폰 3초
const cellMax = 10; //최대 10개

const FONT_FILE = "JacquardaBastarda9-Regular.ttf";
const sceneLabels = ["Tap.", "Tap.", "Cut."];
let fontReady = false;

const uiFontFace = new FontFace("UIFont", `url("${FONT_FILE}")`);
uiFontFace
  .load()
  .then((f) => {
    document.fonts.add(f);
    fontReady = true;
  })
  .catch((e) => console.error("글씨체를 불러오지 못했어요:", e));

function updateLayout() {
  dishX = width / 2;
  dishY = height / 2;
  dishR = min(width, height) * 0.3;
  // 접시가 작아지면 세포도 같은 비율로 작아지게
  cellScale = min(1, dishR / REF_DISH_R);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  engine.gravity.y = 0;

  updateLayout();

  loadScene(currentScene);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}

function loadScene(sceneNum) {
  for (let c of cells) {
    if (c.body) {
      // 세포하나에 물리 바디 있는지 확인하고 있으면 삭제!!
      Composite.remove(engine.world, c.body);
    }
  }
  cells = [];

  // 초기에는 기본 6개 있음
  for (let i = 0; i < 6; i++) {
    spawnCell(sceneNum);
  }

  lastSpawnTime = millis();
}

function spawnCell(sceneNum) {
  //TWO_PI는 360도를 의미하는 내장 상수
  let angle = random(TWO_PI); // 스폰시킬 때 각도 360도 중 랜덤하게
  //rDist는 중심으로부터의 거리, dishR은 페트리 접시의 반지름
  //접시 안쪽 영역에서만 세포가 랜덤하게 리스폰 되도록 설정
  let rDist = random(0, dishR - 60 * cellScale);
  let x = dishX + cos(angle) * rDist;
  let y = dishY + sin(angle) * rDist;

  if (sceneNum === 1) cells.push(new Cell(x, y, random(25, 70) * cellScale, 1));
  else if (sceneNum === 2)
    cells.push(new Cell(x, y, random(22, 32) * cellScale, 2));
  else if (sceneNum === 3)
    cells.push(new Cell(x, y, random(35, 45) * cellScale, 3));
}

function draw() {
  let ctx = drawingContext;

  // 1. 수직 그라데이션 배경
  let bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (currentScene === 1) {
    bgGrad.addColorStop(0, "#CBE3FC");
    bgGrad.addColorStop(1, "#E4E7ED");
  } else if (currentScene === 2) {
    bgGrad.addColorStop(0, "#D8F3DC");
    bgGrad.addColorStop(1, "#E4E7ED");
  } else if (currentScene === 3) {
    bgGrad.addColorStop(0, "#ffdefb");
    bgGrad.addColorStop(1, "#E4E7ED");
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  Engine.update(engine);

  // scene 1,2,3에서 세포가 10개 미만일 때 3초마다 리스폰
  if (currentScene === 1 || currentScene === 2 || currentScene === 3) {
    //@@.length는 개수
    if (cells.length < cellMax) {
      if (millis() - lastSpawnTime > spawnTime) {
        spawnCell(currentScene);
        lastSpawnTime = millis(); //타이머를 리셋
      }
    } else {
      lastSpawnTime = millis();
    }
  }

  // 2. 페트리 접시 디자인
  push();
  // A. 뒤쪽 발광 레이어
  ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  noStroke();
  fill(255, 255, 255, 255);
  circle(dishX, dishY, dishR * 2);

  // B. 그림자 레이어 #6A8BDE 25%)
  ctx.shadowColor = "rgba(106, 139, 222, 0.25)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 20;
  ctx.shadowOffsetY = 20;

  fill(255, 255, 255, 255 * 0.8);
  circle(dishX, dishY, dishR * 2);

  // C. 페트리 접시
  ctx.shadowColor = "transparent"; //투명으로 설정해야 접시에도 그림자가 적용되지 않음
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  fill(255, 255, 255, 255 * 0.8);
  stroke(219, 231, 242);
  strokeWeight(5);
  circle(dishX, dishY, dishR * 2);

  pop();

  // 3. 세포 밖으로 안 빠져나가게
  for (let c of cells) {
    if (!c.body) continue;
    let pos = c.body.position;
    let d = dist(dishX, dishY, pos.x, pos.y);
    let hitR = c.getHitRadius();

    if (d > dishR - hitR) {
      let angle = atan2(pos.y - dishY, pos.x - dishX);
      let targetX = dishX + cos(angle) * (dishR - hitR);
      let targetY = dishY + sin(angle) * (dishR - hitR);

      Matter.Body.setPosition(c.body, { x: targetX, y: targetY });

      let bounceVel = {
        x: -cos(angle) * 1.5,
        y: -sin(angle) * 1.5,
      };
      Matter.Body.setVelocity(c.body, bounceVel);
    }
  }

  // 4. 사라진 세포 캐시 삭제
  for (let c of cells) {
    c.display();
    c.checkDeath();
  }

  // 배열은 뒤에서부터 삭제
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].death) {
      cells.splice(i, 1);
    }
  }

  // Scene 3에서 드래그 그래픽
  if (currentScene === 3 && mouseIsPressed) {
    stroke(255, 80, 100);
    strokeWeight(3);
    line(startX, startY, mouseX, mouseY);
  }

  // 5. 왼쪽 상단 안내 글자 & UI
  drawLabel();
  drawUI();

  // 6. 마우스 커서 표시
  push();
  stroke(250, 250, 250);
  fill(140, 200, 255, 90);
  circle(mouseX, mouseY, 35);
  pop();
}

function drawLabel() {
  push();
  noStroke();
  fill(255);
  textFont(fontReady ? "UIFont" : "monospace");
  textSize(constrain(min(width, height) * 0.1, 36, 80)); // 화면에 따라 크기 조절
  textAlign(LEFT, TOP);
  let margin = min(50, width * 0.06);
  text(sceneLabels[currentScene - 1], margin, margin * 0.8); //-1해야지 배열에서 꺼내올 수 있음
  pop();
}

function drawUI() {
  push();

  // 왼쪽 버튼
  let leftX = 60;
  let leftY = height / 2;
  let isLeftHover = dist(mouseX, mouseY, leftX, leftY) < 25;
  leftBtnScale = lerp(leftBtnScale, isLeftHover ? 1.25 : 1.0, 0.15);

  push();
  translate(leftX, leftY);
  scale(leftBtnScale);

  noStroke();
  fill(255);
  circle(0, 0, 50);

  noFill();
  stroke(70, 90, 200);
  strokeWeight(5);
  strokeCap(ROUND);
  strokeJoin(ROUND);

  beginShape();
  vertex(4, -10);
  vertex(-6, 0);
  vertex(4, 10);
  endShape();
  pop();

  // 오른쪽 버튼
  let rightX = width - 60;
  let rightY = height / 2;
  let isRightHover = dist(mouseX, mouseY, rightX, rightY) < 25;
  rightBtnScale = lerp(rightBtnScale, isRightHover ? 1.25 : 1.0, 0.15);

  push();
  translate(rightX, rightY);
  scale(rightBtnScale);

  noStroke();
  fill(255);
  circle(0, 0, 50);

  noFill();
  stroke(70, 90, 200);
  strokeWeight(5);
  strokeCap(ROUND);
  strokeJoin(ROUND);

  beginShape();
  vertex(-4, -10);
  vertex(6, 0);
  vertex(-4, 10);
  endShape();
  pop();

  // 하단 슬라이더 점
  noStroke();
  for (let i = 1; i <= 3; i++) {
    if (i === currentScene) {
      fill(70, 90, 200);
    } else {
      fill(255);
    }
    circle(width / 2 + (i - 2) * 28, height - 40, 12); //화면 중앙에 오게
  }
  pop();
}

function mousePressed() {
  startX = mouseX;
  startY = mouseY;

  // UI 화살표 클릭 시 화면 전환
  if (dist(mouseX, mouseY, 60, height / 2) < 25) {
    currentScene = currentScene === 1 ? 3 : currentScene - 1;
    loadScene(currentScene);
    return;
  }
  if (dist(mouseX, mouseY, width - 60, height / 2) < 25) {
    currentScene = currentScene === 3 ? 1 : currentScene + 1;
    loadScene(currentScene);
    return;
  }

  //Scene 1&2 타이머
  for (let c of cells) {
    if (!c.body) continue;
    let pos = c.body.position;
    let d = dist(mouseX, mouseY, pos.x, pos.y);

    if (d < c.r + 10) {
      if (currentScene === 1) {
        c.death = true; //Scene 1: 클릭 즉시 삭제
        lastSpawnTime = millis(); //클릭시 타이머 리셋
      } else if (currentScene === 2) {
        c.startShrink(); //Scene 2: 축소 & 투명화 -> 삭제 적용
        lastSpawnTime = millis();
      }
    }
  }
}

function mouseReleased() {
  if (currentScene === 3) {
    let dragDist = dist(startX, startY, mouseX, mouseY);
    if (dragDist > 15) {
      for (let c of cells) {
        if (!c.body) continue;
        let pos = c.body.position;

        let d = linePointDistance(startX, startY, mouseX, mouseY, pos.x, pos.y);

        let minX = min(startX, mouseX) - 10;
        let maxX = max(startX, mouseX) + 10;
        let minY = min(startY, mouseY) - 10;
        let maxY = max(startY, mouseY) + 10;

        let isWithinBounds =
          pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;

        if (d < c.r * 0.6 && isWithinBounds) {
          c.death = true;
          lastSpawnTime = millis(); //타이머 리셋
        }
      }
    }
  }
}

//드래그 길이가 DNA 자를만큼 충분했는지 확인
function linePointDistance(x1, y1, x2, y2, px, py) {
  let l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return dist(px, py, x1, y1);

  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = constrain(t, 0, 1);

  let projX = x1 + t * (x2 - x1);
  let projY = y1 + t * (y2 - y1);

  return dist(px, py, projX, projY);
}
