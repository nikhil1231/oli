class CollisionTrigger extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, width, height, img) {
    super(scene, x, y, img);
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.displayWidth = width;
    this.displayHeight = height;
  }

  setTrigger(obj) {
    return new Promise(resolve => {
      this.scene.physics.add.overlap(this, obj, () => {
        this.destroy();
        resolve();
      });
    })
  }
}