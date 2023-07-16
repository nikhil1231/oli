class ForestScene extends BaseScene {
  static SCENE_CODE = "9";

  FLOOR_Y = 650;

  constructor() {
    super(ForestScene.SCENE_CODE, "forest", true);
  }

  preload() {
    super.preload();

    this.load.image("samk", "img/character/face/samk.png");
    this.load.image("oli", "img/character/face/oli1.png");
    this.load.image("oli_scared", "img/character/face/oli_scared.png");
    this.load.image("oli_smiling", "img/character/face/oli_smiling.png");
    this.load.image("witch", "img/witch.png");
    this.load.image("witch_hidden", "img/witch_hidden.png");

  }

  create() {
    super.create();

    this.player = new Player(this, 100, this.FLOOR_Y - 200, 2, false);
    this.actors.add(this.player);
    this.player.enableGravity();

    this.witch = new Thing(
      this,
      10,
      VARS.width + 100,
      this.FLOOR_Y - 100,
      "witch_hidden"
    );

    this.sam = new Enemy(this, 20, VARS.width + 100, 250, "samk", 5);
    this.sam.enableGravity();
    this.sam.setLookAtPlayer(true);
    this.actors.add(this.sam);

    this.platforms.add(new Floor(this, this.FLOOR_Y));
    this.runScript();
  }

  async runScript() {
    let collisionTrigger = new CollisionTrigger(
      this,
      200,
      VARS.height / 2,
      50,
      VARS.height
    );
    await collisionTrigger.setTrigger(this.player);

    this.player.setImmobile(true);

    await this.witch.moveToX(VARS.width - 200, 100);

    this.player.setHeadTexture("oli_scared");

    await pause(1000);

    await this.player.say(["Oh god please.", "What even is that."]);

    await pause(1000);

    this.slideSound.play();
    await this.sam.moveToX(VARS.width - 350, 600);
    this.tireScreechSound.play();

    await pause();

    this.player.setHeadTexture("oli_smiling");
    await this.player.say(["SAM!", "Jesus Christ, I'm glad to see you."]);
    await this.sam.say(["Oli!", "What are you doing here?"]);
    await this.player.say([
      "I don't even know.",
      "I think I'm stuck in some kind of-",
      "Actually nevermind, I can't be fucked to explain it again.",
    ]);

    await this.sam.say([
      "Wow, that's mad.",
      "It's good to see you though, how have you been?",
      "I feel like I haven't seen you in years.",
      "Actually, I haven't seen you in exactly 46 years.",
      "I've been counting.",
    ]);

    await this.player.say([
      "Fuck, has it been that long already?",
      "Sorry, I guess I got busy and-",
      "Wait what am I saying?",
      "I literally just saw you at your birthday.",
    ]);

    await this.sam.say(["What? My 24th?", "That was 46 years ago, mate."]);

    await this.player.say([
      "What the fuck, have I gone into the future or something?",
    ]);

    await this.sam.say([
      "Yesterday is history...",
      "..tomorrow is a mystery..",
      "..but today is a gift.",
      "That's why they call it the present.",
      "That's what I always say.",
      "God, I love that saying.",
    ]);

    await this.player.say(["Also, who is that behind you?"]);
    await this.sam.say([
      "Oh, I've been so rude.",
      "Oli this is my wife, the [REDACTED].",
    ]);
    await this.player.say(["The what?"]);
    await pause(1000);
    this.witch.setTexture("witch");
    await pause(1000);
    await this.sam.say(["The witch."]);
    await this.player.say(["Ohhhh, the witch!"]);

    await pause(1000);

    await this.sam.say([
      "You've come at the perfect time, Oli.",
      "Word on the street is that you killed a couple of demons.",
      "We've actually got a bit of a problem with demons ourselves.",
      "There's literally hundreds of them terrorizing the forest.",
    ]);
    await this.sam.ask("Will you help us? I won't take no for an answer!", [
      "Yes",
      "Yes",
    ]);

    await this.player.say(["How could I say no?"]);
    await this.sam.say(["That's great news!", "Let me show you where-"]);

    this.clickSound.play();
    this.setFade(1);
    await pause(1000);
    this.startNextLevel();
  }

  update() {
    super.update();
  }
}
