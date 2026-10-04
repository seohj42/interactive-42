class Cell {
  constructor(x, y, r, type) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type; //1: cell, 2: bacteria, 3: DNA

    this.alpha = 255;
    this.death = false;
    this.isShrinking = false;

    this.angle = random(TWO_PI);

    // DNA 형태: 1 = 고리 1개(짧은 형), 2 = 고리 2개(긴 형)
    this.dnaLoops = random([1, 2]);

    // Cell 색상 무작위
    let r1 = random(20, 120);
    let g1 = random(100, 180);
    let b1 = random(210, 255);
    this.coreColor = color(r1, g1, b1);

    // Bacteria 색상 무작위
    let r2 = floor(random(70, 130));
    let g2 = floor(random(180, 235));
    let b2 = floor(random(130, 200));
    this.bodyHex = `#${hex(r2, 2)}${hex(g2, 2)}${hex(b2, 2)}`;

    // DNA Palette
    this.dnaPalette = random([
      ["#FF8BA7", "#E8A6B8", "#a6d9c3", "#e0cda3"], //1
      ["#ffbbdf", "#D9A9C9", "#A9B8E6", "#b1cfdf"], //2
      ["#cbe7ce", "#9ED8D0", "#85a4e6", "#cfaee7"], //3
    ]);
    this.dnaHex = this.dnaPalette[0];

    // 가로선 색상
    let atgcList = [
      "#10c4a6",
      "#ff9cb3",
      "#989edb",
      "#e9a9a9",
      "#f6e0c1",
      "#c19bac",
      "#d0acee",
    ];
    this.atgcColors = [];
    for (let k = 0; k < 2; k++) {
      this.atgcColors.push([]);
      for (let i = 0; i < 4; i++) {
        let segs = [];
        for (let j = 0; j < 3; j++) {
          let c = random(atgcList);
          while (j > 0 && c === segs[j - 1]) c = random(atgcList);
          segs.push(c);
        }
        this.atgcColors[k].push(segs);
      }
    }

    //////////////////////////// 히트박스 정밀 설정
    if (this.type === 3) {
      // DNA: 실제 그려지는 크기에 맞춘 직사각형 (회전 고정)
      let m = this.dnaMetrics();
      this.body = Bodies.rectangle(
        this.x,
        this.y,
        (m.amplitude + m.strandW / 2) * 2,
        m.len + m.strandW,
        {
          angle: this.angle,
          inertia: Infinity,
          restitution: 0.9,
          friction: 0,
          frictionAir: 0,
          frictionStatic: 0,
        },
      );
    } else {
      let physicsR = this.type === 2 ? this.r * 1.52 : this.r;
      this.body = Bodies.circle(this.x, this.y, physicsR, {
        restitution: 0.9,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
      });
    }

    Matter.Body.setVelocity(this.body, {
      x: random(-1.2, 1.2),
      y: random(-1.2, 1.2),
    });

    Composite.add(engine.world, this.body);
  }

  // Bacteria 형태 그리기
  static getBacteriaPath() {
    if (Cell._bactPath) return Cell._bactPath;

    const numArms = 12;
    const step = (Math.PI * 2) / numArms;

    // 돌기
    const side = [
      [0.966, 0.259],
      [0.985, 0.215],
      [1.02, 0.18],
      [1.08, 0.155],
      [1.17, 0.139],
      [1.3, 0.133],
      [1.5, 0.133],
      [1.7, 0.15],
    ];
    const capX = 1.895;
    const capR = 0.182;

    // 팔 하나의 조절점 (팔이 +x 방향을 향할 때)
    const arm = [];
    for (const [x, w] of side) arm.push([x, -w]);
    for (let k = 0; k <= 6; k++) {
      const phi = (Math.PI * k) / 6;
      arm.push([capX + capR * Math.sin(phi), -capR * Math.cos(phi)]);
    }
    for (let i = side.length - 1; i >= 1; i--)
      arm.push([side[i][0], side[i][1]]);

    // 12개 팔을 회전시켜 이어 붙임 (골짜기 점은 이웃 팔과 공유)
    const pts = [];
    for (let i = 0; i < numArms; i++) {
      const c = Math.cos(i * step);
      const sn = Math.sin(i * step);
      for (const [x, y] of arm) pts.push([x * c - y * sn, x * sn + y * c]);
    }

    // 닫힌 Catmull-Rom 곡선으로 부드럽게 연결
    const path = new Path2D();
    const n = pts.length;
    const sub = 5;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      for (let j = 0; j < sub; j++) {
        const t = j / sub;
        const t2 = t * t;
        const t3 = t2 * t;
        const cr = (a, b, c, d) =>
          0.5 *
          (2 * b +
            (-a + c) * t +
            (2 * a - 5 * b + 4 * c - d) * t2 +
            (-a + 3 * b - 3 * c + d) * t3);
        const x = cr(p0[0], p1[0], p2[0], p3[0]);
        const y = cr(p0[1], p1[1], p2[1], p3[1]);
        if (i === 0 && j === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
    }
    path.closePath();

    Cell._bactPath = path;
    return path;
  }

  hexToRgba(hex, a) {
    let c = color(hex);
    return `rgba(${red(c)}, ${green(c)}, ${blue(c)}, ${a})`;
  }

  // DNA 크기 조절용
  dnaMetrics() {
    let loops = this.dnaLoops;
    let amplitude = this.r * 0.4;
    let len = amplitude * 3.6 * (loops + 1);
    let sw = amplitude * 0.3; // 가로선
    let strandW = sw * 1.7; // 두께 조절
    return { loops, amplitude, len, sw, strandW };
  }

  getHitRadius() {
    if (this.type === 2) {
      return this.r * 1.52;
    } else if (this.type === 3) {
      let m = this.dnaMetrics();
      return (m.len + m.strandW) / 2; // DNA 세로 절반 길이를 넘지 않음
    }
    return this.r;
  }

  display() {
    if (this.death || !this.body) return;

    let forceMagnitude = 0.00003 * this.body.mass;
    Matter.Body.applyForce(this.body, this.body.position, {
      x: random(-forceMagnitude, forceMagnitude),
      y: random(-forceMagnitude, forceMagnitude),
    });

    let speed = Matter.Vector.magnitude(this.body.velocity);
    if (speed > 2.0) {
      let newVel = Matter.Vector.mult(
        Matter.Vector.normalise(this.body.velocity),
        2.0,
      );
      Matter.Body.setVelocity(this.body, newVel);
    }

    let pos = this.body.position;

    push();
    translate(pos.x, pos.y);

    let ctx = drawingContext;

    if (this.type === 1) {
      ///////////////////////////////Cell
      noStroke();

      fill(180, 220, 255, this.alpha * 0.45);
      circle(0, 0, this.r * 2.2);

      //중간 원
      let midR = this.r * 0.9;
      let midGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, midR);
      midGrad.addColorStop(
        0,
        `rgba(140, 195, 255, ${(this.alpha * 0.65) / 255})`,
      );
      midGrad.addColorStop(
        0.6,
        `rgba(140, 195, 255, ${(this.alpha * 0.5) / 255})`,
      );
      midGrad.addColorStop(1, `rgba(140, 195, 255, 0)`);
      ctx.fillStyle = midGrad;
      ctx.beginPath();
      ctx.arc(0, 0, midR, 0, TWO_PI);
      ctx.fill();

      let coreR = max(1, this.r * 0.8);
      try {
        let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
        let cr = red(this.coreColor);
        let cg = green(this.coreColor);
        let cb = blue(this.coreColor);

        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${this.alpha / 255})`);
        grad.addColorStop(
          0.7,
          `rgba(${cr}, ${cg}, ${cb}, ${(this.alpha * 0.6) / 255})`,
        );
        grad.addColorStop(1, `rgba(180, 220, 255, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, coreR, 0, TWO_PI);
        ctx.fill();
      } catch (e) {
        fill(this.coreColor);
        circle(0, 0, coreR * 2);
      }
    } else if (this.type === 2) {
      //////////////// Bacteria
      let bodyR = this.r * 0.65;
      let a = this.alpha / 255;

      noStroke();
      ctx.save();
      ctx.scale(bodyR, bodyR);
      ctx.fillStyle = this.hexToRgba(this.bodyHex, a);
      ctx.fill(Cell.getBacteriaPath());
      ctx.restore();

      //돌기 장식
      let tipColor = color("#488274");
      tipColor.setAlpha(this.alpha);
      fill(tipColor);
      let dotDist = this.r * 1.43;
      for (let i = 0; i < 12; i++) {
        let angle = (TWO_PI * i) / 12;
        circle(cos(angle) * dotDist, sin(angle) * dotDist, this.r * 0.16);
      }
    } else if (this.type === 3) {
      ///////////////////////////////// DNA
      rotate(this.angle);

      let { loops, amplitude, len, sw, strandW } = this.dnaMetrics();
      let totalPhase = PI * (loops + 1);
      let a = this.alpha / 255;

      strokeWeight(sw);
      strokeCap(ROUND);
      noFill();

      // 가로선 (ATGC 염기서열)
      let atgc = 4;
      for (let k = 0; k < loops; k++) {
        for (let i = 0; i < atgc; i++) {
          let t = (i + 1) / (atgc + 1);
          let p = HALF_PI + PI * k + PI * t;
          let y = map(p, 0, totalPhase, -len / 2, len / 2);
          let x = abs(cos(p)) * amplitude;

          let segs = this.atgcColors[k][i];
          let segLen = (x * 2) / segs.length;
          let capR = sw / 2;
          for (let j = 0; j < segs.length; j++) {
            let c = color(segs[j]);
            c.setAlpha(this.alpha);
            stroke(c);
            let x1 = -x + segLen * j + capR;
            let x2 = -x + segLen * (j + 1) - capR;
            if (x2 < x1) {
              x1 = x2 = (x1 + x2) / 2;
            }
            line(x1, y, x2, y);
          }
        }
      }

      //가닥들
      let steps = 60 * (loops + 1);
      for (let s = 0; s < 2; s++) {
        let dir = s === 0 ? 1 : -1;
        let stops = s === 0 ? this.dnaPalette : [...this.dnaPalette].reverse();

        let grad = ctx.createLinearGradient(0, -len / 2, 0, len / 2);
        for (let idx = 0; idx < stops.length; idx++) {
          grad.addColorStop(
            idx / (stops.length - 1),
            this.hexToRgba(stops[idx], a),
          );
        }

        strokeWeight(strandW);
        stroke(255);
        ctx.strokeStyle = grad;
        beginShape();
        for (let i = 0; i <= steps; i++) {
          let p = (totalPhase * i) / steps;
          let y = map(p, 0, totalPhase, -len / 2, len / 2);
          vertex(dir * cos(p) * amplitude, y);
        }
        endShape();
      }
    }
    pop();
  }

  startShrink() {
    this.isShrinking = true;
  }

  checkDeath() {
    if (this.isShrinking) {
      this.r -= 1.2;
      this.alpha -= 10;
      if (this.r <= 3 || this.alpha <= 0) {
        this.death = true;
      }
    }

    if (this.death && this.body) {
      Composite.remove(engine.world, this.body);
      this.body = null;
    }
  }
}
