class IntroScene extends BaseScene {
  static SCENE_CODE = "0";

  constructor() {
    super(IntroScene.SCENE_CODE);
  }

  preload() {
    super.preload();
    this.load.image("oli", "img/character/face/oli1.png");
  }

  create() {
    super.create();
    this.player = new Player(this, 100, 300, 2, false);
    this.actors.add(this.player);

    this.runScript();
  }

  async runScript() {
    await super.runScript();

    await pause();
    await this.player.say(["What...", "Where am I...?"]);
    await pause();
    await this.player.say(["What's going on?!"]);

    await this.initNextLevelTrigger();
  }

  update() {
    super.update();
  }
}
