class Gun extends Phaser.Physics.Arcade.Sprite {
  FIRE_RATE = 200;
  BULLET_SPEED = 1000;

  constructor(scene, x, y, isPlayer = false) {
    super(scene, x, y, "gun");
    this.scene = scene;
    this.isPlayer = isPlayer

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setScale(0.15);
    this.setDepth(10);

    this.gunshotSound = scene.sound.add("gunshot");

    scene.input.on("pointermove", (pointer) => {
      if (isPlayer) {
        this.setPoint(pointer.x, pointer.y)
      }
    });
  }

  update(x, y, flipX) {
    x -= (flipX * 2 - 1) * 10;
    this.setPosition(x, y + 60);
    this.setFlipX(flipX);
    this.flipX = flipX;
  }

  setPoint(x, y) {
    if (this.flipX) {
      this.rotation = Phaser.Math.Angle.Between(x, y, this.x, this.y);
    } else {
      this.rotation = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    }
  }

  shoot(x, y, dmg) {
    if (this.isShooting) return;

    this.gunshotSound.play();

    this.isShooting = true;
    setTimeout(() => {
      this.isShooting = false;
    }, 200);

    const bullet = new Bullet(
      this.scene,
      this.x + this.rotation * 5,
      this.y - 10,
      x,
      y,
      "bullet",
      dmg,
      this.BULLET_SPEED
    );

    if (this.isPlayer) {
      this.scene.playerBullets.add(bullet);
    } else {
      this.scene.enemyBullets.add(bullet);
    }

    this.scene.physics.add.collider(bullet, this.scene.platforms, (b) => {
      b.destroy();
    });
  }
}
