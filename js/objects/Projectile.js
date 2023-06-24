class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    originX,
    originY,
    destX,
    destY,
    img,
    scale = 0.1,
    speed = VARS.bulletSpeed,
    dynamic = true
  ) {
    super(scene, originX, originY, img);

    this.speed = speed;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setScale(scale);
    this.setSize(50)

    if (dynamic) {
      this.setVelocity(
        ...this.getVelocityVector(originX, originY, destX, destY)
      );
      const angle = this.getVectorAngle(originX, originY, destX, destY);
      this.setRotation(angle);
    }
  }

  stop() {
    this.setVelocity(0);
  }

  getVelocityVector(originX, originY, destX, destY) {
    const angle = this.getVectorAngle(originX, originY, destX, destY);
    const velX = this.speed * Math.cos(angle);
    const velY = this.speed * Math.sin(angle);
    return [velX, velY];
  }

  getVectorAngle(originX, originY, destX, destY) {
    return Math.PI / 2 - Math.atan2(destX - originX, destY - originY);
  }

  update() {
    if (
      this.y < 0 ||
      this.x < 0 ||
      this.y > config.height ||
      this.x > config.width
    ) {
      this.destroy();
    }
  }
}
