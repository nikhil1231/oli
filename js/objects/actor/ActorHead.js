class ActorHead extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, img, scale) {
    super(scene, x, y, img);

    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.setScale(scale);
  }

  setPosition(x, y) {
    super.setPosition(x, y);
  }
}
