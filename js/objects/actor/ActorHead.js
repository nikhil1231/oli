class ActorHead extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, img, scale) {
    super(scene, x, y, img);

    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.setOrigin(0.5, 0.75)

    this.setScale(scale);
    console.log(this);
  }

  setPosition(x, y) {
    super.setPosition(x, y + 20);
  }
}
