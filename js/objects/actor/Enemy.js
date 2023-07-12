class Enemy extends Actor {
  fireRate = 500;
  dmg = 5;
  isAlive = true;

  // AI
  minJumpTime = 1500;
  maxJumpTime = 3000;
  jumpDropRatio = 0.7;
  inaccuracy = 100;

  constructor(
    scene,
    hp,
    x,
    y,
    name,
    neckOffset = 0,
    bodyImg = null,
    bulletImg = "bullet",
    healthBarVisible = false
  ) {
    super(
      scene,
      hp,
      x,
      y,
      name,
      name,
      neckOffset,
      bodyImg,
      bulletImg,
      healthBarVisible
    );
  }

  update() {
    super.update();
    // Make enemy face player
    this.setFlipX(this.scene.player.x < this.x);

    if (this.gun) {
      this.gun.setPoint(...this.playerPosition());
    }
    if (this.lookAtPlayer) {
      this.lookAt(...this.playerPosition());
    }
  }

  die() {
    super.die();

    if (this.gravityEnabled) {
      if (this.gun) this.disableGun();
      this.setVelocity(0);
    }
    this.disableBody();
  }

  setLookAtPlayer(l) {
    this.lookAtPlayer = l;
  }

  startAttacking() {
    this.startShooting();
    this.startMoving();
  }

  startMoving() {
    this.startJumping();
    this.startStrafing();
  }

  startShooting() {
    setTimeout(() => {
      if (!this.isAlive) return;
      let [px, py] = this.playerPosition();
      this.gun.shoot(
        px + getRandomRange(-this.inaccuracy, this.inaccuracy),
        py + getRandomRange(-this.inaccuracy, this.inaccuracy),
        this.dmg
      );
      this.startShooting();
    }, getRandomInt(this.fireRate) + this.fireRate);
  }

  startJumping() {
    setTimeout(() => {
      if (!this.isAlive) return;
      if (getRandomChance(this.jumpDropRatio)) {
        this.jump();
      } else {
        this.dropDown();
      }
      this.startJumping();
    }, getRandomRange(this.minJumpTime, this.maxJumpTime));
  }

  async startStrafing() {
    if (!this.isAlive) return;
    await this.moveToX(getRandomRange(50, VARS.width - 50));
    this.startStrafing();
  }

  playerPosition() {
    return [this.scene.player.x, this.scene.player.y + 20];
  }
}
