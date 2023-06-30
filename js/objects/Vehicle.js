class Vehicle extends Thing {
  constructor(scene, x, y, hp, scale, img, isPlayer, active = false) {
    super(scene, hp, x, y, img, isPlayer);

    this.setScale(scale);

    this.targetSteeringAngle = 0;
    this.controls = false;

    if (active) this.activateControls();
  }

  async moveToRotated(x, y, v = 300) {
    this.setRotation(this.getVectorAngle(x, y));
    await this.moveTo(x, y, v);
  }

  activateControls() {
    this.controls = true;
    this.cursors = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.setCollideWorldBounds(true);
    this.healthBar.setVisible(true);
  }

  deactivateControls() {
    this.controls = false;
    this.targetSteeringAngle = 0;
    this.healthBar.setVisible(false);
    this.setSteerVelocity();
  }

  update() {
    super.update();

    if (this.controls) {
      if (this.targetSteeringAngle > this.MAX_STEERING_ANGLE) {
        this.targetSteeringAngle = this.MAX_STEERING_ANGLE;
      } else if (this.targetSteeringAngle < -this.MAX_STEERING_ANGLE) {
        this.targetSteeringAngle = -this.MAX_STEERING_ANGLE;
      }

      this.setSteerVelocity();
    }
  }

  async die() {
    super.die();
    this.scene.oofNoise.play();

    await pause(500);
    window.location.reload();
  }
}
