class Bound extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, width = 50, height = VARS.height) {
    super(scene, x, y);
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);

    scene.actors.getChildren().forEach((actor) => {
      scene.physics.add.collider(this, actor);
    });

    this.body.immovable = true;

    this.displayWidth = width;
    this.displayHeight = height;
  }
}
