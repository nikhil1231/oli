class ActorHead extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, img, scale, neckOffset = 0) {
    super(scene, x, y, img);

    this.neckOffset = neckOffset;
    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.setOrigin(0.5, 0.75);

    this.setScale(scale);
  }

  setFlipX(flip) {
    super.setFlipX(flip);
    this.flipX = flip;
  }

  setPosition(x, y) {
    super.setPosition(x - (this.flipX * 2 - 1) * this.neckOffset, y + 20);
  }
}
