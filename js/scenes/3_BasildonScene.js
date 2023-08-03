class BasildonScene extends BaseScene {
  static SCENE_CODE = "2";

  FLOOR_Y = 500;

  constructor() {
    super(BasildonScene.SCENE_CODE, "basildon_1", true);
  }

  preload() {
    super.preload();

    this.load.image("oli", "img/character/face/oli_young_1.png");
    this.load.image("aman", "img/character/face/aman_young_1.png");
    this.load.image("nikhil", "img/character/face/nikhil_young_1.png");
    this.load.image("nikhil_sad", "img/character/face/nikhil_young_1_sad.png");

    this.load.audio("player_speech", "audio/player_speech.wav");
  }

  create() {
    super.create();
    this.player = new Player(this, VARS.playerSpawnX, this.FLOOR_Y, 1, false);
    this.actors.add(this.player);

    this.runScript();
  }

  async runScript() {
    await super.runScript();
    await this.player.say([
      "Huh...",
      "Wait a minute.",
      "Why don't my knees hurt anymore?",
      "This is incredible!",
    ]);

    let collisionTrigger = new CollisionTrigger(
      this,
      VARS.playerSpawnX + 100,
      VARS.height / 2,
      50,
      VARS.height
    );
    await collisionTrigger.setTrigger(this.player);

    await this.player.say([
      "This place seems familiar..",
      "But where have I seen it before?",
    ]);
    await this.narrator.say([
      "You search the depths of your mind, but cannot remember where you are.",
    ]);

    await this.player.say([
      "What the fuck?",
      "Sick, now I'm hearing voices as well.",
      "This is terrible.",
    ]);

    collisionTrigger = new CollisionTrigger(
      this,
      VARS.playerSpawnX + 200,
      VARS.height / 2,
      50,
      VARS.height
    );
    await collisionTrigger.setTrigger(this.player);

    // // ======================== NIKHIL APPEARS ===============================

    this.nikhil = new Enemy(this, 1, VARS.width + 100, this.FLOOR_Y, "nikhil");
    this.actors.add(this.nikhil);

    await this.nikhil.moveTo(VARS.width - 100, this.FLOOR_Y);

    await this.nikhil.say([
      "Wow, I love it when we have guests over..",
      "..because it means I can make lots of new friends!",
      "I wonder who I'll make friends with today!",
    ]);

    await pause(1000);

    await this.player.say([
      "Holy shit is that Nikhil!?",
      "Why is he a child??",
      "Wait... does that mean I'm a child as well??",
      "That explains why my knees don't hurt anymore.",
      "I should go and talk to him.",
    ]);

    let bound = new Bound(this, VARS.width / 2, VARS.height / 2);

    collisionTrigger = new CollisionTrigger(
      this,
      VARS.width / 2 - 20,
      VARS.height / 2,
      50,
      VARS.height
    );
    await collisionTrigger.setTrigger(this.player);

    await pause(2000);

    await this.player.say(["What the fuck, why can't I move closer to him?"]);

    await pause(3000);

    await this.narrator.say([
      "No matter how hard you try, you cannot change the course of history.",
    ]);

    await pause(2000);

    await this.player.say(["Fucks sake."]);

    await pause(3000);

    // // ======================== AMAN APPEARS ===============================

    this.player.setImmobile(true);
    this.aman = new Enemy(this, 1, -100, this.FLOOR_Y, "aman");
    this.actors.add(this.aman);

    await this.aman.moveTo(100, this.FLOOR_Y, 300);

    await this.aman.say(["Hey Oli come on, let's go play football outside!"]);

    await this.aman.moveTo(200, this.FLOOR_Y - 200, 300);

    await pause();

    await this.player.say(["Well I guess I don't have a choice."]);

    this.player.setImmobile(false);

    collisionTrigger = new CollisionTrigger(
      this,
      220,
      this.FLOOR_Y - 250,
      350,
      50
    );
    await collisionTrigger.setTrigger(this.player);
    this.player.setImmobile(true);

    await pause(1000);

    this.nikhil.setHeadTexture("nikhil_sad");

    await this.nikhil.say([
      "Why are those boys playing without me...? :(((",
      "I guess I'll never make any friends :(((",
    ]);

    await pause(1000);

    await this.player.say(["Nikhil why don't you just come play with us?"]);

    await pause(1000);

    await this.nikhil.say([":((("]);

    await pause(1000);

    await this.narrator.say([
      "Despite your most valiant efforts, Nikhil does not join you.",
    ]);

    await this.player.say(["Alright, I guess I can't do anything here."]);

    await this.fadeOut();
    await this.startNextLevel();
  }

  update() {
    super.update();
  }
}
