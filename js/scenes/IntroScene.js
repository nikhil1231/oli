class IntroScene extends BaseScene {
  static SCENE_CODE = "0";

  constructor() {
    super(IntroScene.SCENE_CODE);
  }

  preload() {
    super.preload();
    this.load.image("oli", "img/character/face/oli1.png");

    this.load.audio("player_speech", "audio/player_speech.wav");
  }

  create() {
    super.create();
    this.player = new Player(
      this,
      VARS.playerSpawnX,
      VARS.playerSpawnY,
      "oli1",
      false
    );

    this.runScript();
  }

  async runScript() {
    await super.runScript();

    await pause(2000);

    const speech = new Speech(this, "oli1", this.sound.add("player_speech"));
    await speech.say(["What...", "Where am I?", "What's going on?!"]);

    await this.initNextLevelTrigger();
  }

  update() {
    super.update();
  }
}
