class Gun extends Phaser.Physics.Arcade.Sprite {
  FIRE_RATE = 200;
  BULLET_SPEED = 1000;

  constructor(scene, x, y) {
    super(scene, x, y, "gun");
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setScale(0.15);
    this.setDepth(10);

    this.gunshotSound = scene.sound.add("gunshot");

    scene.input.on("pointermove", (pointer) => {
      if (this.flipX) {
        this.rotation = Phaser.Math.Angle.Between(
          pointer.x,
          pointer.y,
          this.x,
          this.y
        );
      } else {
        this.rotation = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          pointer.x,
          pointer.y
        );
      }
    });
  }

  update(x, y, flipX) {
    x -= (flipX * 2 - 1) * 10;
    this.setPosition(x, y + 60);
    this.setFlipX(flipX);
    this.flipX = flipX;
  }

  shoot(x, y) {
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
      10,
      this.BULLET_SPEED
    );

    this.scene.playerBullets.add(bullet);

    this.scene.physics.add.collider(bullet, this.scene.platforms, (b) => {
      b.destroy();
    });
  }
}
