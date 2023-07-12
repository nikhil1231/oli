class Note extends Thing {
  attackHeight = 100;
  dmg = 10;
  wobbleMagnitude = 20;
  wobbleSpeed = getRandomRange(10, 30) / 10000;
  wobble = true;
  randomOffset = getRandomInt(100) / 50;
  attacking = false;

  constructor(scene, x, y, variant, type = "evil", hp = 100) {
    super(scene, hp, x, y, `music_${type}_${variant}`);
    this.scene = scene;
    this.variant = variant;
    this.initialY = y;
    this.setScale(0.4);
    this.arrowImg = `arrow_${variant}`;

    scene.physics.add.overlap(this, scene.player, (_, player) => {
      player.takeDamage(this.dmg);
    });
  }

  setEvil(evil) {
    this.setTexture(`music_${evil ? "evil" : "peaceful"}_${this.variant}`);
  }

  update() {
    super.update();

    if (this.wobble) {
      const wobbleY =
        Math.cos(this.scene.time.now * this.wobbleSpeed + this.randomOffset) *
        this.wobbleMagnitude;

      // Update the sprite's position using the wobble offset
      this.y = this.initialY + wobbleY;
    }
  }

  startAttacking(delay) {
    this.wobble = false;
    this.attacking = true;
    this.attackInterval = delay;
    switch (this.variant) {
      case 0:
        this.attack0();
        break;
      case 1:
        this.attack1();
        break;
      case 2:
        this.attack2();
        break;
      case 3:
        this.attack3();
        break;
    }
  }

  stopAttacking() {
    this.attacking = false;
  }

  async exitScene() {
    this.setEvil(false);
    await this.wait(2);
    await this.moveToX(-100);
  }

  async attack0() {
    this.moveToX(this.scene.player.x, 1000);
    await this.wait(this.attackInterval);

    while (this.attacking) {
      this.moveToX(this.scene.player.x, 1000);

      await this.waitWithWarning(this.attackInterval, 180);

      this.moveTo(
        this.x,
        this.scene.FLOOR_Y - this.displayHeight / 2,
        900,
        () => this.scene.impactNoise.play()
      );

      await this.wait(this.attackInterval);

      this.moveTo(this.x, this.attackHeight, 1000);

      await this.wait(this.attackInterval);
    }
    this.exitScene();
  }

  async attack1() {
    this.moveTo(50, this.scene.FLOOR_Y - this.displayHeight / 2, 900);

    await this.wait(5);

    while (this.attacking) {
      await this.waitWithWarning(this.attackInterval, 90);

      this.moveToX(VARS.width - 50, 1000);

      await this.waitWithWarning(this.attackInterval, 270);

      this.moveToX(50, 1000);
    }
    this.exitScene();
  }

  async attack2() {
    this.y = 350;
    this.x = -this.displayWidth / 2;

    await this.waitWithWarning(4, 90);
    while (this.attacking) {
      this.moveCircular(
        VARS.width + this.displayWidth / 2,
        this.y,
        50,
        100,
        50
      );
      await this.waitWithWarning(this.attackInterval, 270);
      this.moveCircular(-this.displayWidth / 2, this.y, 50, 150, 30);
      await this.waitWithWarning(this.attackInterval, 90);
    }
    this.exitScene();
  }

  async attack3() {
    const attackYHigh = 200;
    const attackYLow = this.scene.FLOOR_Y - this.displayHeight / 2;
    const speed = 400;
    const bouncePause = 8;
    this.moveTo(300, attackYHigh, 900);

    while (this.attacking) {
      let randomX = getRandomRange(100, VARS.width - 100);
      await this.waitWithWarningCoord(
        this.attackInterval - bouncePause,
        randomX,
        attackYLow
      );
      this.moveTo(randomX, attackYLow, speed);

      randomX = getRandomRange(100, VARS.width - 100);
      await this.waitWithWarningCoord(bouncePause, randomX, attackYHigh);

      this.moveTo(randomX, attackYHigh, speed);
    }
    this.exitScene();
  }

  async waitWithWarning(n_beats, direction) {
    const warnTime = 2;
    await this.wait(n_beats - warnTime);

    const arrow = this.warn(direction);
    await this.wait(warnTime);
    arrow.destroy();
  }

  async waitWithWarningCoord(n_beats, targetX, targetY) {
    const angle = (x, y) => {
      return 90 + (Math.atan2(y - this.y, x - this.x) * 180) / Math.PI;
    };

    const warnTime = 2;
    await this.wait(n_beats - warnTime);

    const dir = angle(targetX, targetY);
    const arrow = this.warn(dir);
    await this.wait(warnTime);
    arrow.destroy();
  }

  async wait(n_beats) {
    await pause(this.scene.BEAT * n_beats);
  }

  warn(direction) {
    const d = 80;
    const dirRad = ((direction - 90) * Math.PI) / 180;
    const dx = d * Math.cos(dirRad);
    const dy = d * Math.sin(dirRad);
    const arrow = this.scene.add.sprite(
      this.x + dx,
      this.y + dy,
      this.arrowImg
    );
    arrow.setScale(0.5);
    arrow.setRotation(dirRad);
    return arrow;
  }

  async moveCircular(x, y, v, radius, rotateSpeed) {
    const period = 20;
    let trueX = this.x;
    let trueY = this.y;

    const dx = ((x - this.x) * v) / 10000;
    const dy = ((y - this.y) * v) / 10000;
    await new Promise(async (r) => {
      const interval = setInterval(() => {
        trueX += dx;
        trueY += dy;
        this.x =
          trueX +
          radius * Math.cos((this.scene.time.now * rotateSpeed) / 10000);
        this.y =
          trueY +
          radius * Math.sin((this.scene.time.now * rotateSpeed) / 10000);
        if (
          (dx > 0 && this.x > VARS.width + this.displayWidth) ||
          (dx < 0 && this.x < 0) ||
          (dy > 0 && this.y > VARS.height + this.displayHeight)
        ) {
          this.x = x;
          this.y = y;
          clearInterval(interval);
          r();
        }
      }, period);
    });
  }

  setY(y) {
    this.y = y;
    this.initialY = y;
  }
}
