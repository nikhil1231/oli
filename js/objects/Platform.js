class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, scale, img) {
    super(scene, x, y, img);
    this.scene = scene;
    this.setScale(scale);
    this.setDepth(-1);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);
    this.body.immovable = true;

    this.setCollisions()
  }

  setCollisions() {
    const offset = 16;

    this.scene.actors.getChildren().forEach((actor) => {
      this.scene.physics.add.overlap(actor, this, () => {
        if (
          actor.body.velocity.y > 0 &&
          actor.y + actor.body.height < this.y + offset + 5
        ) {
          actor.body.velocity.y = 0;
          actor.body.y = this.y - actor.body.height - offset;
        }
      });
    });
  }
}
