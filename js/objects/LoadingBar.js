class LoadingBar {
  COLOUR = 0xffff00;

  constructor(scene, speed, x, y, width, height) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.max = 100;
    this.value = 0;
    this.visible = true;

    this.width = width;
    this.height = height;

    this.p = (this.width - 4) / 100;

    this.draw();
    scene.add.existing(this.bar);
  }

  setVisible(visible) {
    this.visible = visible;
    this.draw();
  }

  draw() {
    this.bar.clear();
    if (!this.visible) return;

    if (this.value < this.max) this.value += 1 * this.speed;

    const x = this.x;
    const y = this.y;

    //  BGd
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(x, y, this.width, this.height);

    //  Health
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(x + 2, y + 2, this.width - 4, this.height - 4);

    this.bar.fillStyle(this.COLOUR);

    var d = Math.floor(this.p * this.value);

    this.bar.fillRect(x + 2, y + 2, d, this.height - 4);
    this.bar.setDepth(999);
  }

  destroy() {
    this.bar.clear();
    this.visible = false;
  }
}
