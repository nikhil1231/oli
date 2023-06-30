class Wall extends Bound {
  dmg = 20;

  constructor(scene, x, y, sideWall = false) {
    super(scene, x, y, 50);
    this.setTexture("wall");
    this.setScale(0.3);
    this.sideWall = sideWall;
    this.startingY = y;
    this.setCollideWorldBounds(false);
  }

  update() {
    if (this.x < -this.body.width) {
      if (this.sideWall) {
        this.x = VARS.width + this.body.width / 2;
        this.y = this.startingY;
        this.setVelocityY(0);
      } else {
        this.destroy();
      }
    }
  }
}
