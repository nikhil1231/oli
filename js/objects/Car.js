class Car extends Vehicle {
  MAX_STEERING_ANGLE = Math.PI / 3;
  ds = 0.03;
  speed = 400;
  traction = 2;
  tractionThresh = 11;

  constructor(scene, x, y, hp, img, isPlayer, active = false) {
    super(scene, x, y, hp, 0.5, img, isPlayer, active);
    this.startingX = x;
    this.velocityY = 0;

    this.setSize(200, 150);
    this.setOffset(60, 20);
  }

  update() {
    if (this.controls) {
      const up = this.cursors.up.isDown;
      const down = this.cursors.down.isDown;
      if (up) {
        this.targetSteeringAngle -= this.ds;
      } else if (down) {
        this.targetSteeringAngle += this.ds;
      }
      this.x = this.startingX;
      this.setVelocityX(0);
    }
    super.update();

    if (
      this.y <= 11 + this.body.height / 2 ||
      this.y > VARS.height - 4 - this.body.height / 2
    ) {
      this.targetSteeringAngle = 0;
    }
  }

  activateControls() {
    super.activateControls();
    this.scene.physics.add.collider(this, this.scene.walls, (v, wall) => {
      this.takeDamage(wall.dmg);
    });
    this.startingX = this.x;
  }

  async deactivateControls() {
    super.deactivateControls();
  }

  setSteerVelocity() {
    if (!this.controls) return;
    const targetVelocityY = this.speed * Math.sin(this.targetSteeringAngle);
    const velDiff = Math.abs(this.velocityY - targetVelocityY);
    if (velDiff > this.tractionThresh) {
      this.velocityY +=
        targetVelocityY > this.velocityY ? this.traction : -this.traction;
    } else {
      this.velocityY = targetVelocityY;
    }
    this.setVelocityY(this.velocityY);
    this.vx = this.speed * Math.cos(this.targetSteeringAngle);

    this.setRotation(this.targetSteeringAngle);
  }
}
