class Actor extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    hp,
    x,
    y,
    scale,
    headImg,
    bodyImg = "body_default",
    bulletImg = "bullet",
    healthBarVisible = true,
    isPlayer = false
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.hp = hp;
    this.bulletImg = bulletImg;
    this.isPlayer = isPlayer;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setScale(scale);
    this.setCollideWorldBounds(true);

    this.actorBody = new ActorBody(scene, this.x, this.y, bodyImg, scale);
    this.actorHead = new ActorHead(scene, this.x, this.y, headImg, scale);
    this.healthBar = new HealthBar(
      scene,
      this.x,
      this.y,
      this.hp,
      isPlayer,
      healthBarVisible
    );
    this.dmgTimeout = false;
    this.dmgTimeoutLength = 2000;

    this.bigDamageSound = scene.sound.add("big_damage_audio");

    // SETTING BOUNDS
    this.setSize(this.actorHead.width * 0.8, 350)
    this.setOffset(-this.actorHead.width/2 + 40, -this.actorHead.height/2 + 40)

    scene.physics.add.overlap(
      this,
      isPlayer ? scene.enemyBullets : scene.playerBullets,
      (actor, bullet) => {
        this.takeDamage(bullet.dmg);
        bullet.destroy();
      }
    );
  }

  update() {
    this.actorHead.setPosition(this.x, this.y);
    this.actorBody.setPosition(this.x, this.y);
    this.healthBar.setPosition(this.x, this.y);

    this.actorHead.setFlipX(this.flipX);
    this.actorBody.setFlipX(this.flipX);
  }

  shoot(pointer) {
    const bullet = new Bullet(
      this.scene,
      this.x,
      this.y,
      pointer.x,
      pointer.y,
      this.bulletImg,
      this.dmg
    );
    if (this.isPlayer) {
      this.scene.playerBullets.add(bullet);
    } else {
      this.scene.enemyBullets.add(bullet);
    }
  }

  async moveTo(x, y, v = 500) {
    const tolerance = 20;
    this.setVelocity(...this.getVelocityVector(v, x, y));
    await new Promise(async (r) => {
      while (true) {
        if (
          Math.abs(x - this.x) < tolerance &&
          Math.abs(y - this.y) < tolerance
        ) {
          this.x = x;
          this.y = y;
          this.setVelocity(0);
          r();
          break;
        }
        await pause(10);
      }
    });
  }

  async takeDamage(dmg) {
    if (this.dmgTimeout) return;
    if (this.invincible) {
      this.scene.blockSound.play();
      return;
    }
    this.dmgTimeout = true;
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

  async _flash() {
    const t = 50;
    while (this.dmgTimeout) {
      this.setAlpha(0.5);
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
