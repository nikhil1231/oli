class HealthBar {

  ENEMY_COLOUR = 0xff0000;
  PLAYER_COLOUR = 0x00ff00;

  BASE_WIDTH = 80;
  BASE_HEIGHT = 16;
  MAX_SCALE = 3;
  MIN_HP = 100;
  MAX_HP = 1000;

  constructor(scene, x, y, hp, isPlayer, visible=false, offset=70) {
      this.bar = new Phaser.GameObjects.Graphics(scene);

      this.max = hp;
      this.value = hp;
      this.isPlayer = isPlayer;
      this.visible = visible;

      this.width = this._getWidth();
      this.height = this._getHeight();
      this.offset = offset;

      this.p = (this.width - 4) / hp;
      this.dx = 0;
      this.dy = 0;

      this.setPosition(x, y);

      scene.add.existing(this.bar);
  }

  async setValue(value, shake=true) {
    const dmg = this.value - value;
    this.value = Math.max(value, 0);

    if (shake && dmg > 0) await this._shake(dmg);
  }

  setPosition(x, y) {
    this.x = x - (this.BASE_WIDTH * this._getScale()) / 2;
    this.y = y - this.offset;

    this.draw();
  }

  setVisible(visible) {
    this.visible = visible;
    this.draw();
  }

  draw() {
    this.bar.clear();
    if (!this.visible) return;

    const x = this.x + this.dx;
    const y = this.y + this.dy;

    //  BGd
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(x, y, this.width, this.height);

    //  Health
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(x + 2, y + 2, this.width - 4, this.height - 4);

    this.bar.fillStyle(this.isPlayer ? this.PLAYER_COLOUR : this.ENEMY_COLOUR);

    var d = Math.floor(this.p * this.value);

    this.bar.fillRect(x + 2, y + 2, d, this.height - 4);
    this.bar.setDepth(999)
  }

  destroy() {
    this.bar.clear();
  }

  async _shake(dmg) {
    const amount = 100 * Math.min(dmg / this.max, 1);
    let r = amount;
    let i = 0;
    while (r > 4) {
      this.dx = r * Math.sin(i);
      this.dy = r * 0.1 * Math.cos(i*3);
      i++;
      r*= 0.97;
      await pause(10);
    }
    this.dx = 0;
    this.dy = 0;
  }

  _getWidth() {
    return this.BASE_WIDTH * this._getScale();
  }

  _getHeight() {
    return this.BASE_HEIGHT * Math.max(1, this._getScale() / 2.5);
  }

  _getScale() {
    if (this.max < this.MIN_HP) {
      return 1;
    } else if (this.max > this.MAX_HP) {
      return this.MAX_SCALE;
    }
    return (this.max - this.MIN_HP) * (this.MAX_SCALE - 1) / (this.MAX_HP - this.MIN_HP) + 1;
  }
}
