class BaseScene extends Phaser.Scene {
  fadeSpeed = 0.02;
  swirlLevel = 300;

  constructor(name, background = null, hasBackgroundMusic = false) {
    super(name);
    this.SCENE_CODE = name;
    this.background = background;
    this.hasBackgroundMusic = hasBackgroundMusic;
  }

  preload() {
    this.load.setBaseURL("assets");

    this.textures.remove("background");
    this.textures.remove("oli");
    this.textures.remove("nikhil");
    this.textures.remove("aman");
    this.cache.audio.remove("background_music");

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
    if (this.hasBackgroundMusic) {
      this.load.audio("background_music", `audio/music/${this.background}.mp3`);
    }

    this.load.audio("default_voice", "audio/speech/sans.wav");
    this.load.audio("player_speech", "audio/speech/player_speech.wav");
    this.load.audio("cursed_speech", "audio/speech/cursed.wav");
    this.load.audio("narrator", "audio/speech/narrator.wav");
    this.load.audio("aman", "audio/speech/sans.wav");
    this.load.audio("nikhil", "audio/speech/tor3.wav");
    this.load.audio("dylan", "audio/speech/sans.wav");
    this.load.audio("ben", "audio/speech/light.wav");
    this.load.audio("ossian", "audio/speech/wngdng.wav");
    this.load.audio("sam", "audio/speech/sans.wav");
    this.load.audio("samk", "audio/speech/asgore.wav");
    this.load.audio("witch", "audio/speech/sans.wav");
    this.load.audio("paul", "audio/speech/sans.wav");
    this.load.audio("nikesh", "audio/speech/tor3.wav");

    this.load.audio("big_damage_audio", "audio/damage.wav");
    this.load.audio("create", "audio/create.wav");
    this.load.audio("impact", "audio/impact.wav");
    this.load.audio("oof", "audio/oof.wav");
    this.load.audio("death", "audio/death.wav");
    this.load.audio("heal", "audio/heal.wav");
    this.load.audio("block", "audio/block.wav");
    this.load.audio("break", "audio/break.wav");
    this.load.audio("beam", "audio/beam.wav");
    this.load.audio("rar", "audio/rar.wav");
    this.load.audio("charge", "audio/charge.wav");
    this.load.audio("star", "audio/star.wav");
    this.load.audio("swoosh", "audio/swoosh.wav");
    this.load.audio("slide", "audio/slide.wav");
    this.load.audio("hit", "audio/hit.wav");
    this.load.audio("hitmarker", "audio/hitmarker.wav");
    this.load.audio("click", "audio/click.wav");
    this.load.audio("laugh", "audio/laugh.wav");
    this.load.audio("laugh2", "audio/laugh2.wav");
    this.load.audio("laugh3", "audio/laugh3.wav");

    this.load.audio("tire_screech", "audio/tire_screech.wav");

    this.load.plugin(
      "rexswirlpipelineplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexswirlpipelineplugin.min.js",
      true
    );
  }

  create() {
    this.fade = new Phaser.GameObjects.Graphics(this);
    this.fade.setDepth(1000);
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
    this.breakSound = this.sound.add("break");
    this.rarSound = this.sound.add("rar");
    this.starSound = this.sound.add("star");
    this.swooshSound = this.sound.add("swoosh");
    this.slideSound = this.sound.add("slide");
    this.hitSound = this.sound.add("hit");
    this.hitmarkerSound = this.sound.add("hitmarker", {
      volume: 0.5,
    });
    this.clickSound = this.sound.add("click");
    this.laughSound = this.sound.add("laugh");
    this.laugh2Sound = this.sound.add("laugh2");
    this.laugh3Sound = this.sound.add("laugh3");
    this.cursedSpeechSound = this.sound.add("cursed_speech");
    this.beamSound = this.sound.add("beam", {
      volume: 0.5,
    });
    this.tireScreechSound = this.sound.add("tire_screech");

    this.platforms = this.add.group();
    this.actors = this.add.group();

    if (this.background) {
      this.backgroundImg = new Phaser.GameObjects.Image(
        this,
        VARS.width / 2,
        VARS.height / 2,
        "background"
      );
      this.backgroundImg.setDepth(-100);
      this.add.existing(this.backgroundImg);
    }

    if (this.hasBackgroundMusic) {
      this.backgroundMusic = this.sound.add("background_music", {
        volume: 0.5,
        loop: true,
      });

      this.backgroundMusic.play();
    }

    this.narrator = new Speech(this, null, this.sound.add("narrator"));

    var postFxPlugin = this.plugins.get("rexswirlpipelineplugin");
    this.cameraFilter = postFxPlugin.add(this.cameras.main);
  }

  update() {
    for (const actor of this.actors.getChildren()) {
      if (actor) actor.update();
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

  async awaitDeaths(enemies) {
    await new Promise((r) => {
      const i = setInterval(() => {
        if (enemies.every((enemy) => !enemy.isAlive)) {
          r();
          clearInterval(i);
        }
      }, 20);
    });
  }

  async runScript() {
    await this.fadeIn();
  }

  async setFade(alpha) {
    this.alpha = alpha;
    this.draw();
  }

  async fadeOut(speed = this.fadeSpeed) {
    await this._fade(0, 1, speed);
  }

  async fadeIn(speed = this.fadeSpeed) {
    await this._fade(1, 0, speed);
  }

  async _fade(from, to, speed) {
    this.alpha = from;
    const d = (to - from) * speed;
    while (Math.abs(to - this.alpha) > 0.03) {
      this.alpha += d;
      this.draw();
      await pause(20);
    }
    this.alpha = to;
  }

  async zoomAndPanTo(
    zoomLevel,
    x,
    y,
    time,
    spriteToFollow = null,
    easing = "Sine.easeInOut"
  ) {
    return new Promise((r) => {
      const camera = this.cameras.main;
      camera.pan(x, y, time, easing, true, (camera, progress) => {
        if (spriteToFollow) {
          camera.panEffect.destination.x = spriteToFollow.x;
          camera.panEffect.destination.y = spriteToFollow.y;
        }
        if (progress === 1) r();
      });
      camera.zoomTo(zoomLevel, time, easing);
    });
  }

  async swirlNextLevel() {
    this.swirlOut();
    await pause(2000);
    this.starSound.play();
    await this.fadeOut();
    this.startNextLevel();
  }

  async swirlTease(level, duration = 100) {
    this.swooshSound.play();
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

    this.player.setImmobile(true);
    await this.fadeOut();
    this.startNextLevel();
  }

  async startNextLevel() {
    if (this.backgroundMusic) this.backgroundMusic.stop();
    const code = parseInt(this.SCENE_CODE) + 1;
    setLevelSave(code);
    setSectionSave(0);
    this.scene.start(code.toString());
  }
}
