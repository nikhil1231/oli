class Football extends Phaser.Physics.Arcade.Sprite {
  BOUNCE_AMOUNT = 600;
  GRAVITY = 500;
  VARIANCE = 1;

  constructor(scene, x, y, bounce_cb) {
    super(scene, x, y, "football");
    this.scene = scene;
    this.bounce_cb = bounce_cb;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setCollideWorldBounds(true);

    this.setScale(0.5);
  }

  enable() {
    this.body.allowGravity = true;
    this.body.setGravityY(this.GRAVITY);
    this.body.bounce.set(1);

    this.scene.physics.add.overlap(this, this.scene.player, (ball, player) => {
      let angle = Phaser.Math.Angle.Between(
        this.scene.player.x,
        this.scene.player.y,
        this.x,
        this.y
      );
      angle += ((getRandomInt(100) - 100) / 100) * this.VARIANCE;
      this.body.setVelocity(
        Math.cos(angle) * this.BOUNCE_AMOUNT,
        Math.sin(angle) * this.BOUNCE_AMOUNT
      );
      this.bounce_cb();
    });
  }
  disable() {
    this.body.bounce.set(0.3);
    this.setCollideWorldBounds(false);
  }
}
