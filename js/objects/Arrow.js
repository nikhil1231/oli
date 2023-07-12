class Arrow extends Phaser.Physics.Arcade.Sprite {

  constructor(scene) {
    super(scene, VARS.width - 100, VARS.height / 2, 'arrow');
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setScale(0.5);
  }
}
