class BaseScene extends Phaser.Scene {
  fadeSpeed = 0.02;
  swirlLevel = 300;

  constructor(name, background = null) {
    super(name);
    this.SCENE_CODE = name;
    this.background = background;
  }

  preload() {
    this.load.setBaseURL("assets");

    this.load.image("arrow", "img/arrow.png");
    this.load.image("body_0", "img/character/body/default.png");
    this.load.image("body_1", "img/character/body/1.png");
    this.load.image("body_2", "img/character/body/2.png");
    this.load.image("body_3", "img/character/body/3.png");
    this.load.image("body_4", "img/character/body/4.png");
    this.load.image("body_5", "img/character/body/5.png");
    this.load.image("body_6", "img/character/body/6.png");
    this.load.image("body_7", "img/character/body/7.png");
    this.load.image("body_8", "img/character/body/8.png");
    this.load.image("body_9", "img/character/body/9.png");
    this.load.image("body_10", "img/character/body/10.png");
    if (this.background) {
      this.load.image("background", `img/backgrounds/${this.background}.png`);
    }

    this.load.audio("player_speech", "audio/speech/player_speech.wav");
    this.load.audio("narrator", "audio/speech/narrator.wav");
    this.load.audio("aman", "audio/speech/sans.wav");
    this.load.audio("nikhil", "audio/speech/tor3.wav");

    this.load.audio("big_damage_audio", "audio/damage.wav");
    this.load.audio("create", "audio/create.wav");
    this.load.audio("impact", "audio/impact.wav");
    this.load.audio("oof", "audio/oof.wav");
    this.load.audio("death", "audio/death.wav");
    this.load.audio("heal", "audio/heal.wav");
    this.load.audio("block", "audio/block.wav");
    this.load.audio("star", "audio/star.wav");

    this.load.plugin(
      "rexswirlpipelineplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexswirlpipelineplugin.min.js",
      true
    );
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
    this.oofNoise = this.sound.add("oof");
    this.deathNoise = this.sound.add("death");
    this.healSound = this.sound.add("heal");
    this.blockSound = this.sound.add("block");
    this.starSound = this.sound.add("star");

    this.platforms = this.add.group();

    this.backgroundImg = new Phaser.GameObjects.Image(
      this,
      VARS.width / 2,
      VARS.height / 2,
      "background"
    );
    this.add.existing(this.backgroundImg);

    this.narrator = new Speech(this, null, this.sound.add("narrator"));

    var postFxPlugin = this.plugins.get("rexswirlpipelineplugin");
    this.cameraFilter = postFxPlugin.add(this.cameras.main);
  }

  update() {
    if (this.player) {
      this.player.update();
    }

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

  async runScript() {
    await this.fadeIn();
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

  async swirlNextLevel() {
    this.swirlOut();
    await pause(2000);
    this.starSound.play();
    await this.fadeOut();
    this.startNextLevel();
  }

  async swirlTease(level, duration = 100) {
    for (let i = 0; i < duration; i++) {
      this.setSwirl(level * Math.sin((Math.PI * i) / duration));
      await pause(10);
    }
    this.setSwirl(0);
  }

  async swirlOut(level = this.swirlLevel) {
    for (let i = 0; i < level; i++) {
      this.setSwirl(i);
      await pause(10);
    }
  }

  async swirlIn(level = this.swirlLevel) {
    for (let i = level; i >= 0; i--) {
      this.setSwirl(i);
      await pause(10);
    }
  }

  setSwirl(i) {
    this.cameraFilter.angle = i;
    this.cameraFilter.radius = i * 5;
  }

  draw() {
    this.fade.clear();

    this.fade.fillStyle(0x000, this.alpha);
    this.fade.fillRect(0, 0, VARS.width, VARS.height);
  }

  async initNextLevelTrigger() {
    const arrow = new Arrow(this);

    const nextLevelTrigger = new CollisionTrigger(
      this,
      VARS.width - 50,
      VARS.height / 2,
      50,
      VARS.height
    );
    await nextLevelTrigger.setTrigger(this.player);

    this.startNextLevel();
  }

  async startNextLevel() {
    this.player.setImmobile(true);
    await this.fadeOut();
    const code = parseInt(this.SCENE_CODE) + 1;
    setLevelSave(code);
    setSectionSave(0);
    this.scene.start(code.toString());
  }
}
