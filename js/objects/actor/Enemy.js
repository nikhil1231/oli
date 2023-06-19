class Enemy extends Actor {

  fireRate = 100;
  dmg = 5;
  isAlive = true;

  constructor(scene, hp, x, y, img, bulletImg, scale=0.25, healthBarVisible=true) {
    super(scene, hp, x, y, scale, img, bulletImg, healthBarVisible);
  }

  update() {
    super.update();
    // Make enemy face player
    this.setFlipX(this.scene.player.x < this.x);
  }

  shoot(x, y) {
    super.shoot({ x, y })
  }
}
