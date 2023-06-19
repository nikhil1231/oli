class IntroScene extends BaseScene {

  static SCENE_CODE = '0'

  constructor() {
    super(IntroScene.SCENE_CODE);
  }

  preload () {
    super.preload();
    this.load.audio("player_speech", 'audio/player_speech.wav');
  }

  create () {
    super.create();
    this.player = new Player(this, VARS.playerSpawnX, VARS.playerSpawnY, false);


    this.runScript();
  }

  async runScript() {
    const speech = new Speech(this, "oli1", this.sound.add('player_speech'));
    await speech.say([
      "What...",
      "Where am I?",
      "What's going on?!",
    ]);

    const arrow = new Arrow(this);

    const nextLevelTrigger = new CollisionTrigger(this, VARS.width - 50, VARS.height / 2, 50, VARS.height);
    await nextLevelTrigger.setTrigger(this.player);

    this.startNextLevel();
  }

  update() {
    super.update();
  }
}