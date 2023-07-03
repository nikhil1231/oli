class HeadEnemy extends Enemy {
  dmg = 10;
  constructor(scene, hp, x, y, img) {
    super(scene, hp, x, y, img);
    this.bulletImg = "bullet_blue";
    this.headSpeedMult = 1.5;

    this.disableActorBody();
    this.setCollideWorldBounds(true);

    this.phases = [this.phase1, this.phase2, this.phase4];

    scene.enemies.add(this);

    this.shootNoise = scene.sound.add("click");
    this.beamNoise = scene.sound.add("beam", {
      volume: 0.4,
    });
    this.chargeNoise = scene.sound.add("charge", {
      volume: 0.5,
    });

    this.healthBar.offset = 120;

    this.setBounce(1);
    scene.physics.add.overlap(this, scene.player, (paul, player) => {
      player.takeDamage(this.dmg);
    });
  }

  async startAttackingRandom() {
    while (this.isAlive) {
      await getRandomChoice(this.phases)(this);
    }
  }

  async runPhase(phase) {
    while (this.isAlive) await this.phases[phase - 1](this);
  }

  // _this passed in so we can do the random phase bit (else we lose the binding)
  async phase1(_this = this) {
    await _this.shootAlternate(3, 10, 2000);
    await pause(2000);
    if (!this) return;

    await _this.shootSpiral(10, 5, 10, 2000);
    await pause(1500);
    if (!this) return;

    await _this.shootSpiral(10, 5, -5, 200);
    await pause(1500);
    if (!this) return;

    await _this.shootSpiral(10, 5, 10, 500);
    await pause(1500);
    if (!this) return;

    await _this.shootSpiral(10, 5, -5, 200);
    await pause(1500);
  }

  async phase2(_this = this) {
    for (let i = 0; i < 4; i++) {
      _this.shootBeam(4, 6);
      if (!this) return;
      await pause(3000);
    }

    await _this.shootDirect(10, 1000);
    await pause(1000);
    if (!this) return;

    for (let i = 0; i < 4; i++) {
      _this.shootBeam(5, 5);
      if (!this) return;
      await pause(3000);
    }

    if (!this) return;
    await _this.shootDirect(20, 1000);
    await pause(1000);
  }

  async phase3(_this = this) {
    await _this.shootSelf(5, 5000);
    await pause(1500);
    if (!this) return;
  }

  async phase4(_this = this) {
    _this.setVelocity(150);
    await _this.shootAlternate(4, 6, 700);
    await pause(3000);
    if (!this) return;

    await _this.shootAlternate(4, 10, 1500);
    await pause(3000);
    if (!this) return;

    for (let i = 0; i < 4; i++) {
      await _this.shootBeam(4, 10);
      if (!this) return;
      await pause(2000);
    }

    await _this.shootAlternate(4, 6, 700);
    await pause(3000);
    if (!this) return;

    await _this.shootAlternate(4, 10, 1500);
    await pause(3000);
    if (!this) return;

    await _this.shootDirect(20, 700);
  }

  destroy() {
    this.setCollideWorldBounds(false);
    this.setVelocity(0);
    this.x = -200;
    // super.destroy();
    this.destroyed = true;
  }

  shoot(x, y, dmg = this.dmg) {
    if (!this.isAlive || this.destroyed) return;
    this.shootNoise.play();
    super.shoot(x, y, dmg);
  }

  async shootSelf(n, t) {
    const v = [
      [300, 150],
      [200, 300],
      [250, 250],
      [100, 350],
    ];

    await pause(500);

    for (let i = 0; i < n; i++) {
      const v1 = v[Math.floor(Math.random() * v.length)];
      const vx = v1[0] * this.headSpeedMult;
      const vy = v1[1] * this.headSpeedMult;
      this.setVelocity(
        Math.random() > 0.5 ? vx : -vx,
        Math.random() > 0.5 ? vy : -vy
      );
      await pause(t);
    }
  }

  shootBouncer(x, y) {
    this.shootNoise.play();

    const bullet = new Bullet(
      this.scene,
      this.x,
      this.y,
      x,
      y,
      "paul_bullet",
      this.dmg,
      400
    );
    bullet.setScale(0.2);
    bullet.setCollideWorldBounds(true);
    bullet.setBounce(1);
    this.scene.enemyBullets.add(bullet);
  }

  async shootBouncers(n, delay, ttl) {
    for (let i = 0; i < n; i++) {
      this.shootBouncer(Math.random() * VARS.width, 0);
      if (!this) return;
      await pause(delay);
    }
    await pause(ttl);
    this.scene.enemyBullets.clear(true, true);
  }

  async shootDirect(n, delay) {
    this.chargeNoise.play();
    await pause(600);
    for (let i = 0; i < n; i++) {
      if (!this) return;
      this.shoot(this.scene.player.x, this.scene.player.y);
      await pause(delay);
    }
  }

  async shootBeam(width, length) {
    const x = this.scene.player.x;
    const y = this.scene.player.y;
    const d = 50;
    this.beamNoise.play();
    for (let i = 0; i < length; i++) {
      if (!this) return;
      for (let j = 0; j < width; j++) {
        this.shoot(x, y + (j * d - (d * width) / 2));
      }
      await pause(100);
    }
  }

  async shootAlternate(numBursts, circleSize, delay) {
    for (let i = 0; i < numBursts; i++) {
      if (!this) return;
      this.shootCircle(circleSize);
      await pause(delay);
      this.shootCircle(circleSize, 0.3);
      await pause(delay);
    }
  }

  async shootSpiral(numShots, circleSize, delta, delay) {
    for (let i = 0; i < numShots; i++) {
      if (!this) return;
      this.shootCircle(circleSize, (delta * i) / 50);
      await pause(delay);
    }
  }

  async shootCircle(n, theta = 0) {
    for (let i = 0; i < n; i++) {
      if (!this) return;
      const x = this.x + Math.cos(theta + (2 * Math.PI * i) / n);
      const y = this.y + Math.sin(theta + (2 * Math.PI * i) / n);
      this.shoot(x, y);
    }
  }
}
