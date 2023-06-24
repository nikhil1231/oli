class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, scale, img) {
    super(scene, x, y, img);
    this.scene = scene;
    this.setScale(scale);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enableBody(this);
    this.body.immovable = true;

    const offset = 16;

    scene.physics.add.overlap(scene.player, this, () => {
      if (
        scene.player.body.velocity.y > 0 &&
        scene.player.y + scene.player.body.height < this.y + offset + 5
      ) {
        scene.player.body.velocity.y = 0;
        scene.player.body.y = this.y - scene.player.body.height - offset;
      }
    });
  }
}
