class FootballScene extends BaseScene {
  static SCENE_CODE = "2";

  FLOOR_Y = 500;
  PLAYER_SPEED = 500;
  SCORE_TO_WIN = 10;

  constructor() {
    super(FootballScene.SCENE_CODE, "football");
  }

  preload() {
    super.preload();

    this.load.image("aman", "img/character/face/aman_young_1.png");
    this.load.image("nikhil", "img/character/face/nikhil_young_1.png");
    this.load.image("football", "img/football.png");
  }

  create() {
    super.create();
    this.player = new Player(
      this,
      VARS.playerSpawnX,
      this.FLOOR_Y,
      "oli_young_1",
      false
    );
    this.player.grounded = true;
    this.player.speed = this.PLAYER_SPEED;
    this.player.body.immovable = true;

    this.score = 0;
    this.gameDone = false;
    this.aman = new Enemy(this, 1, VARS.width - 100, this.FLOOR_Y, "aman");
    this.football = new Football(this, VARS.width - 170, this.FLOOR_Y, () => {
      this.blockSound.play();
      this.score += 1;
      if (this.score === this.SCORE_TO_WIN) {
        this.finishGame();
      }
    });

    this.runScript();
  }

  async runScript() {
    await super.runScript();
    await this.aman.say(["Let's see if you can get 10"]);

    this.football.body.setVelocity(-500);
    this.football.enable();

    this.deadzone = new CollisionTrigger(
      this,
      VARS.width / 2,
      VARS.height - 80,
      VARS.width,
      100
    );
    this.deadzone.setTrigger(this.football, () =>
      this.player.takeDamage(this.player.hp)
    );
  }

  async finishGame() {
    if (this.gameDone) {
      return;
    }
    this.gameDone = true;
    this.deadzone.destroy();
    this.football.disable();
    this.player.speed = VARS.playerSpeed;

    await this.aman.say(["Nice one."]);

    await pause(2000);

    this.nikhil = new Enemy(this, 1, -100, this.FLOOR_Y, "nikhil");
    await this.nikhil.moveTo(100, this.FLOOR_Y);

    const ans = await this.nikhil.ask(
      "Hey guys, can I play too?",
      ["Yeah sure!", "No go away"],
      [0, 200]
    );

    await this.nikhil.say(
      ans === 0
        ? ["Yaaaay! Let's be best friends!"]
        : ["Haha, good one! LeT's bE fRieNds forEveERR!!"]
    );
  }

  update() {
    super.update();
    if (this.aman) {
      this.aman.update();
    }
  }
}
