class Bound extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, width=50, height=VARS.height) {
    super(scene, x, y);
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this)
    scene.physics.world.enableBody(this);
    scene.physics.add.collider(this, scene.player);
    this.body.immovable = true;

    this.displayWidth = width;
    this.displayHeight = height;
  }
}
