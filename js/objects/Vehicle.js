class Vehicle extends Actor {

  constructor(scene, x, y, img, scale, active=false) {
    super(scene, 100, x, y, scale, img, '', false, true);

    this.steeringAngle = 0;
    this.controls = false;

    if (active) this.activateControls();
  }

  async moveToStatic(x, y, v=500) {
    await super.moveTo(x, y, v);
  }

  async moveTo(x, y, v=500) {
    this.setRotation(this.getVectorAngle(x, y));
    await super.moveTo(x, y, v);
  }

  activateControls() {
    this.controls = true;
    this.cursors = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.scene.player.body.destroy();

    this.setCollideWorldBounds(true);
    this.healthBar.setVisible(true);
  }

  deactivateControls() {
    this.controls = false;
    this.steeringAngle = 0;
    this.healthBar.setVisible(false);
    this.setSteerVelocity();
  }

  update() {
    super.update();

    if (this.controls) {
      if (this.steeringAngle > this.MAX_STEERING_ANGLE) {
        this.steeringAngle = this.MAX_STEERING_ANGLE;
      } else if (this.steeringAngle < -this.MAX_STEERING_ANGLE) {
        this.steeringAngle = -this.MAX_STEERING_ANGLE;
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
