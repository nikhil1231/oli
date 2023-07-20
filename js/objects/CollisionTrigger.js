class CollisionTrigger extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, width, height, img) {
    super(scene, x, y, img);
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setPushable(false);

    this.displayWidth = width;
    this.displayHeight = height;
  }

  setTrigger(obj, cb = null) {
    return new Promise((resolve) => {
      this.scene.physics.add.overlap(this, obj, () => {
        this.destroy();
        if (cb) cb();
        resolve();
      });
    });
  }

  setForeverTrigger(obj, cb) {
    this.scene.physics.add.overlap(this, obj, () => cb());
  }

  enableGravity() {
    this.gravityEnabled = true;
    this.body.allowGravity = true;
    this.body.setGravityY(VARS.gravity);
  }
}
