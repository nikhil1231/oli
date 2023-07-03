class Bullet extends Projectile {
  constructor(
    scene,
    originX,
    originY,
    destX,
    destY,
    img,
    dmg,
    isPlayer,
    speed = VARS.bulletSpeed,
    dynamic = true
  ) {
    super(scene, originX, originY, destX, destY, img, 0.2, speed, dynamic);
    this.dmg = dmg;
    this.isPlayer = isPlayer;

    if (this.isPlayer) {
      this.scene.playerBullets.add(this);
    } else {
      this.scene.enemyBullets.add(this);
    }

    this.scene.physics.add.collider(this, this.scene.platforms, (b) => {
      b.destroy();
    });
  }
}
