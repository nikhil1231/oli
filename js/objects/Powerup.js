class Powerup extends Projectile {
  constructor(scene, originX, originY, destX, destY, img, amount, speed=VARS.bulletSpeed, dynamic=true) {
    super(scene, originX, originY, destX, destY, img, 0.05, speed, dynamic);
    this.amount = amount;
  }
}
