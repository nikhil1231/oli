class Bullet extends Projectile {
  constructor(scene, originX, originY, destX, destY, img, dmg, speed=VARS.bulletSpeed, dynamic=true) {
    super(scene, originX, originY, destX, destY, img, 0.2, speed, dynamic);
    this.dmg = dmg;
  }
}
