class Enemy extends Actor {
  fireRate = 100;
  dmg = 5;
  isAlive = true;

  constructor(
    scene,
    hp,
    x,
    y,
    headImg,
    voice = 'default_voice',
    bodyImg = null,
    bulletImg = "bullet",
    healthBarVisible = false,
  ) {
    super(scene, hp, x, y, headImg, voice, bodyImg, bulletImg, healthBarVisible);
  }

  update() {
    super.update();
    // Make enemy face player
    this.setFlipX(this.scene.player.x < this.x);
  }

  shoot(x, y) {
    super.shoot({ x, y });
  }
}
