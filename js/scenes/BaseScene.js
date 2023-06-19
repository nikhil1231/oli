class BaseScene extends Phaser.Scene {

  fadeSpeed = 0.02;

  constructor(name) {
    super(name);
    this.SCENE_CODE = name;
  }

  preload() {
    this.load.setBaseURL('assets');

    this.load.image('arrow', 'img/arrow.png');
    this.load.image('oli1', 'img/character/face/oli1.png');
    this.load.image('body_default', 'img/character/body/default.png');

    this.load.audio("narrator", 'audio/narrator.wav');
    this.load.audio('big_damage_audio', 'audio/damage.wav');
    this.load.audio('create', 'audio/create.wav');
    this.load.audio('impact', 'audio/impact.wav');
    this.load.audio('oof', 'audio/oof.wav');
    this.load.audio('death', 'audio/death.wav');
    this.load.audio("heal", 'audio/heal.wav');
  }

  create() {
    this.fade = new Phaser.GameObjects.Graphics(this);
    this.fade.setDepth(9999);
    this.add.existing(this.fade);

    this.playerBullets = this.add.group();
    this.powerups = this.add.group();
    this.enemyBullets = this.add.group();
    this.enemies = this.add.group();

    this.createNoise = this.sound.add("create");
    this.impactNoise = this.sound.add("impact");
    this.oofNoise = this.sound.add('oof');
    this.deathNoise = this.sound.add('death');
    this.healSound = this.sound.add('heal');

    this.netWorth = this.add.text(10, 10, '', {
      fontSize: '24px'
    });
    this.netWorth.setDepth(9999);
  }

  update() {
    this.player.update();

    for (const playerBullet of this.playerBullets.getChildren()) {
      playerBullet.update();
    }

    for (const powerup of this.powerups.getChildren()) {
      powerup.update();
    }

    for (const enemy of this.enemies.getChildren()) {
      enemy.update();
    }

    for (const enemyBullet of this.enemyBullets.getChildren()) {
      enemyBullet.update();
    }
  }

  async fadeOut() {
    await this._fade(0, 1);
  }

  async fadeIn() {
    await this._fade(1, 0);
  }

  async _fade(from, to) {
    this.alpha = from;
    const d = (to - from) * this.fadeSpeed;
    while (Math.abs(to - this.alpha) > 0.03) {
      this.alpha += d;
      this.draw();
      await pause(20);
    }
    this.alpha = to;
  }

  draw() {
    this.fade.clear();

    this.fade.fillStyle(0x000, this.alpha);
    this.fade.fillRect(0, 0, VARS.width, VARS.height);
  }

  startNextLevel() {
    const code = parseInt(this.SCENE_CODE) + 1;
    setLevelSave(code);
    this.scene.start(code.toString());
  }

  setNetWorth(n) {
    this.netWorth.setText(`$${Number(n).toLocaleString()}`)
  }
}
