class Speech {

  WIDTH = 800;
  HEIGHT = 120;
  BORDER = 5;

  visible = false;
  isTalking = true;

  constructor(scene, speakerImg, speechSound) {
    this.scene = scene;
    this.speechSound = speechSound;
    this.box = new Phaser.GameObjects.Graphics(scene);
    this.box.setDepth(998);

    this.x = (VARS.width / 2) - this.WIDTH / 2;
    this.y = 30;

    this.text_x = this.x + 150;
    this.text_y = this.y + 30;

    this.draw();

    scene.add.existing(this.box);

    this.isImg = !!speakerImg;

    if (this.isImg){
      this.img = scene.physics.add.staticImage(this.x + 70, this.y + 60, speakerImg);
      this.img.setScale(0.4);
      this.img.setAlpha(0);
      this.img.setDepth(999);
    }
  }

  say(script) {
    if (config.skipSpeech) return;
    return new Promise(resolve => {
      this.visible = true;
      this.isTalking = true;
      if (this.isImg) this.img.setAlpha(1);
      this.draw();
      this.text = this.scene.add.text(this.text_x, this.text_y, "", {
        color: "#fff",
        fontSize: "20px",
      });
      this.text.setDepth(999);
      this.scene.player.someoneTalking = true;

      let i = 0;
      let doneTalking = false;
      const cb = () => {
        if (i == script.length) {
          doneTalking = true;
        }
      }

      const next = () => {
        if (doneTalking) done();
        if (this.isTalking || i >= script.length) return;
        this._sayLine(script[i], cb);
        this.draw();
        i++;
      }

      const done = () => {
        this.visible = false;
        this.text.setText("");
        if (this.isImg) this.img.setAlpha(0);
        this.draw();
        this.scene.player.someoneTalking = false;
        this.scene.input.off('pointerdown', next);
        resolve();
      }

      this._sayLine(script[i++], cb);
      this.scene.input.on('pointerdown', next)
    })
  }

  async _sayLine(line, done) {
    this.isTalking = true;

    for (let i = 0; i <= line.length; i++) {
      if (Math.random() < 0.9) this.speechSound.play();
      this.text.setText(line.substring(0, i))
      this.text.setWordWrapWidth((this.x + this.WIDTH) - this.text_x - 20);
      if ([',', '.', '!', '?'].includes(line[i])) {
        await pause(100);
      }
      await pause(50);
    }

    this.isTalking = false;
    done();
  }

  draw() {
    this.box.clear();
    if (this.visible) {
      this._drawBox();
    }
  }

  _drawBox() {
    // Border
    this.box.fillStyle(0xffffff);
    this.box.fillRect(this.x, this.y, this.WIDTH, this.HEIGHT);

    // Background
    this.box.fillStyle(0x000000);
    this.box.fillRect(this.x + this.BORDER, this.y + this.BORDER, this.WIDTH - 2 * this.BORDER, this.HEIGHT - 2 * this.BORDER);
  }
}