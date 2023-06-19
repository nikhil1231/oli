class Question {

  WIDTH = 800;
  HEIGHT = 120;
  BORDER = 5;

  visible = false;
  isTalking = true;

  constructor(scene, speechSound, img) {
    this.scene = scene;
    this.speechSound = speechSound;
    this.box = new Phaser.GameObjects.Graphics(scene);

    this.x = (VARS.width / 2) - this.WIDTH / 2;
    this.y = 30;

    this.text_x = this.x + 150;
    this.text_y = this.y + 30;

    this.draw();

    scene.add.existing(this.box);

    this.isImg = !!img;

    if (this.isImg){
      this.img = scene.physics.add.staticImage(this.x + 70, this.y + 60, img);
      this.img.setScale(0.2);
      this.img.setAlpha(0);
    }
  }

  ask(question, answers, spacing) {
    return new Promise(async resolve => {
      this.visible = true;
      this.isTalking = true;
      if (this.isImg) this.img.setAlpha(1);
      this.draw();
      this.text = this.scene.add.text(this.text_x, this.text_y, "", {
        color: "#fff",
        fontSize: "20px",
      });
      this.scene.player.someoneTalking = true;

      const done = (ans) => {
        this.visible = false;
        this.text.setText("");
        for (const ansButton of answerButtons) {
          ansButton.off();
          ansButton.setText('');
        }
        if (this.isImg) this.img.setAlpha(0);
        this.draw();
        this.scene.player.someoneTalking = false;
        resolve(ans);
      }

      await this._sayLine(question);

      const answerButtons = [];
      for (const ans in answers) {
        const ansText = this.scene.add.text(this.text_x + (spacing ? spacing[ans] : ans * 100), this.y + this.HEIGHT - 40, `[${answers[ans]}]`, {fill: '#bbb', fontSize: '20px'});
        answerButtons.push(ansText);
        ansText.setInteractive();
        ansText.on('pointerover', () => ansText.setColor('#fff'))
        ansText.on('pointerout', () => ansText.setColor('#bbb'))
        ansText.on('pointerdown', () => done(ans));
      }
    })
  }

  async _sayLine(line) {
    this.isTalking = true;

    for (let i = 0; i <= line.length; i++) {
    this.speechSound.play();
    this.text.setText(line.substring(0, i))
    this.text.setWordWrapWidth((this.x + this.WIDTH) - this.text_x - 20);
    if ([',', '.', '!', '?'].includes(line[i])) {
      await pause(100);
    }
    await pause(50);
    }

    this.isTalking = false;
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
