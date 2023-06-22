class ActorBody extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, img, scale) {
    if (img == null) {
      img = `body_${getRandomInt(9) + 1}`
    }

    super(scene, x, y, img);

    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.setScale(scale);
  }

  setPosition(x, y) {
    super.setPosition(x, y + 65);
  }
}
