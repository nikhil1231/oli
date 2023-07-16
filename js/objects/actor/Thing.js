class Thing extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, hp, x, y, img, isPlayer = false) {
    super(scene, x, y, img);
    this.scene = scene;
    this.hp = hp;
    this.isAlive = true;
    this.invincible = false;
    this.isPlayer = isPlayer;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);

    this.healthBar = new HealthBar(scene, this.x, this.y, this.hp, isPlayer);
    this.dmgTimeout = false;
    this.dmgTimeoutLength = 2000;

    this.bigDamageSound = scene.sound.add("big_damage_audio");

    // COLLISION
    scene.physics.add.overlap(
      this,
      isPlayer ? scene.enemyBullets : scene.playerBullets,
      (actor, bullet) => {
        this.takeDamage(bullet.dmg);
        bullet.destroy();
        if (!isPlayer) scene.hitmarkerSound.play();
      }
    );
  }

  update() {
    super.update();
    this.healthBar.setPosition(this.x, this.y);
  }

  async moveTo(x, y, v = 500, cb = null) {
    const tolerance = 20;
    this.setVelocity(...this.getVelocityVector(v, x, y));
    await new Promise(async (r) => {
      while (true) {
        this.update();
        if (
          Math.abs(x - this.x) < tolerance &&
          Math.abs(y - this.y) < tolerance
        ) {
          this.x = x;
          this.y = y;
          this.setVelocity(0);
          if (cb) cb();
          r();
          break;
        }
        await pause(10);
      }
    });
  }

  async moveToX(x, v = 200) {
    const period = 20;
    const vel = x > this.x ? v : -v;
    this.setVelocityX(vel);
    let lastDist = Math.abs(x - this.x);

    await new Promise(async (r) => {
      const interval = setInterval(() => {
        if (Math.abs(x - this.x) > lastDist || !this.isAlive) {
          if (this.isAlive) this.x = x;
          this.setVelocity(0);
          clearInterval(interval);
          r();
        }
        lastDist = Math.abs(x - this.x);
      }, period);
    });
  }

  async takeDamage(dmg) {
    if (this.dmgTimeout || !this.isAlive) return;
    if (this.invincible) {
      this.scene.blockSound.play();
      return;
    }
    if (this.isPlayer) this.dmgTimeout = true;
    this.hp -= dmg;
    this.healthBar.visible = true;

    if (dmg >= this.healthBar.max * 0.1) {
      this.bigDamageSound.play();
    } else {
      // this.damageSound.play();
    }

    this._flash();
    this.healthBar.setValue(this.hp);
    this.resetDmgTimeout();

    if (this.hp <= 0) {
      this.die();
      return true;
    }
  }

  async resetDmgTimeout() {
    await pause(this.dmgTimeoutLength);
    this.dmgTimeout = false;
  }

  setHealth(hp) {
    this.hp = hp;
    this.healthBar.visible = true;
    this.healthBar.setValue(this.hp, false);
  }

  enableGravity() {
    this.gravityEnabled = true;
    this.body.allowGravity = true;
    this.body.setGravityY(this.GRAVITY);
  }

  jump() {
    if (this.body.touching.down) {
      this.body.velocity.y = -this.jumpHeight;
    }
  }

  dropDown() {
    if (this.body.touching.down) {
      this.y += 3;
    }
  }

  async _flash() {
    const t = 50;
    while (this.dmgTimeout) {
      this.setAlpha(0.7);
      await pause(t);
      this.setAlpha(1);
      await pause(t);
    }
  }

  async rotateLerp(R) {
    if (R > Math.PI) {
      R -= Math.PI * 2;
    }
    const dr = (R - this.rotation) / 60;
    while (Math.abs(R - this.rotation) > 0.05) {
      this.setRotation(this.rotation + dr);
      await pause(20);
    }
    this.setRotation(R);
  }

  die() {
    this.isAlive = false;
  }

  destroy() {
    super.destroy();
    this.healthBar.destroy();
  }

  getVelocityVector(v, destX, destY) {
    const angle = this.getVectorAngle(destX, destY);
    const velX = v * Math.cos(angle);
    const velY = v * Math.sin(angle);
    return [velX, velY];
  }

  getVectorAngle(destX, destY) {
    return Math.PI / 2 - Math.atan2(destX - this.x, destY - this.y);
  }
}
