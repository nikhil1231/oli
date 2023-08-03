class PaulScene extends BaseScene {
  static SCENE_CODE = "10";

  FLOOR_Y = 650;

  PLAYER_SPEED = 500;
  SPAWN_RATE_START = 1800;
  SPAWN_RATE_END = 500;
  SPAWN_NUMBER = 30;

  constructor() {
    super(PaulScene.SCENE_CODE, "orchard", true);
  }

  preload() {
    super.preload();

    this.load.image("paul", "img/character/face/paul.png");
    this.load.image("paul_sad", "img/character/face/paul_sad.png");
    this.load.image("paul_dismay", "img/character/face/paul_dismay.png");
    this.load.image("oli", "img/character/face/oli1.png");
    this.load.image("oli_scared", "img/character/face/oli_scared.png");
    this.load.image("oli_smiling", "img/character/face/oli_smiling.png");
    this.load.image("peach", "img/peach.png");
    this.load.image("rat", "img/rat.png");
  }

  create() {
    super.create();

    this.player = new Player(this, 100, this.FLOOR_Y - 200, 2, false);
    this.actors.add(this.player);
    this.player.enableGravity();

    this.paul = new Enemy(this, 20, VARS.width + 100, 250, "paul", 5);
    this.paul.setHeadTexture("paul_sad");
    this.paul.enableGravity();
    this.paul.setLookAtPlayer(true);
    this.actors.add(this.paul);

    this.peaches = this.add.group();

    this.platforms.add(new Floor(this, this.FLOOR_Y));
    this.runScript();
  }

  async runScript() {
    const introScript = async () => {
      this.player.setImmobile(true);
      this.clickSound.play();

      await pause(1500);

      await this.player.say(["Jesus Christ.", "Thank fuck I got out of that."]);
      await pause(1000);

      await this.player.say(["Wow, this place is actually lovely."]);

      await pause();

      this.createPeach(300, -50);

      await pause();

      await this.player.say(["Was that a peach?"]);

      await pause(1000);

      this.slideSound.play();
      this.paul.y = 300;
      await this.paul.moveToX(VARS.width - 350, 600);
      this.tireScreechSound.play();

      await pause(1000);

      await this.paul.say(["BRO.", "Why the fuck didn't you catch that!?"]);

      await pause(1000);

      this.paul.setHeadTexture("paul");
      await this.paul.say(["Oh shit it's Oli!", "What's up bro?"]);

      this.player.setHeadTexture("oli_smiling");
      await this.player.say(["Hello señor."]);

      const purposeAns = await this.paul.ask(
        "What are you doing here haha?",
        ["I'm dead", "I'm high", "I'm just swinging by"],
        [0, 150, 300]
      );

      if (purposeAns === 0) {
        await this.paul.say(["Oh fuck bro..", "How's that going for you?"]);
        await this.player.say(["Not great, but I've had a good time."]);
      } else if (purposeAns === 1) {
        await this.paul.say([
          "Oh, no way bro.",
          "You got any of that stuff for me?",
        ]);
        await this.player.say([
          "Unfortunately not.",
          "I don't even know what I took, if anything.",
        ]);
      } else {
        await this.paul.say([
          "Fairs, bro, I appreciate that.",
          "There's fuck all people around here.",
        ]);
      }

      await this.player.say([
        "So what have you been up to?",
        "I assume I haven't seen you in years either.",
      ]);

      this.paul.setHeadTexture("paul_dismay");
      await this.paul.say([
        "Yh I've been alright.",
        "Not gonna lie, it's been pretty quiet ever since I gave up the sesh and set up this peach farm.",
      ]);

      await this.player.say([
        "Gave up the sesh?",
        "Bro if this is the future then it's depressing as fuck.",
      ]);

      await this.paul.say([
        "Bro that's not even the worst thing.",
        "They fucking made drum n bass illegal.",
        "Like, how can they even do that?",
      ]);

      await this.player.say([
        "Fuck me.",
        "Well I hope this isn't a prophecy or something.",
        "At least you've got a nice place here though.",
        "Being a peach farmer must be so theraputic.",
      ]);

      await pause();

      this.backgroundMusic.pause();
      await this.player.say([
        "Wait those aren't even peaches, they're apples.",
      ]);

      await pause();
      this.backgroundMusic.play();

      this.paul.setHeadTexture("paul");
      await this.paul.say([
        "Nahhhh they just look like apples from far away.",
        "Either that or someone just found a picture online and couldn't be fucked to change them into peaches.",
        "Anyway, now that you're here, I need your help.",
        "It's harvest season, and I can't collect all of these peaches on my own.",
        "Some of them are fucking massive.",
      ]);

      await this.player.say([
        "Well I guess I have nothing else to do until I get warped out of here.",
      ]);

      await this.paul.say([
        "Nice one, bro.",
        "Oh and one more thing, it kinda hurts when you drop them.",
      ]);

      await this.player.say(["Yeah, don't worry, I'll be careful."]);

      await this.paul.say([
        "No no no no.",
        "It HURTS when you drop them.",
        "I'll see you in a sec.",
      ]);

      await this.paul.moveToX(VARS.width + 50);

      await pause(1000);

      await this.player.say(["What do you-"]);

      await pause(1000);

      this.player.setHeadTexture("oli");

      await this.player.say(["Oh, I see."]);
    };

    const startGame = async () => {
      this.player.setImmobile(false);
      this.player.speed = this.PLAYER_SPEED;
      this.oobVoid = new CollisionTrigger(
        this,
        VARS.width / 2,
        VARS.height + 100,
        VARS.width,
        40
      );
      this.physics.add.collider(this.oobVoid, this.peaches, (player, peach) => {
        peach.destroy();
        this.player.takeDamage(12);
      });
      this.physics.add.collider(this.player, this.peaches, (player, peach) => {
        peach.destroy();
        this.blockSound.play();
      });

      await pause();

      let delay = this.SPAWN_RATE_START;
      const dt =
        (this.SPAWN_RATE_START - this.SPAWN_RATE_END) / this.SPAWN_NUMBER;
      for (let i = 0; i < this.SPAWN_NUMBER; i++) {
        this.spawnPeach(getRandomRange(100, VARS.width - 100));
        await pause(delay);
        delay -= dt;
      }

      for (let i = 0; i < 20; i++) {
        this.spawnPeach(getRandomRange(100, VARS.width - 100));
      }

      await pause(5000);

      this.slideSound.play();
      this.paul.y = 300;
      await this.paul.moveToX(VARS.width - 350, 600);
      this.paul.setHeadTexture("paul");
      this.tireScreechSound.play();

      await pause(1000);

      await this.paul.say([
        "Holy shit dude you actually survived??",
        "Those fucking things just kill me every time.",
        "Anyway, cheers bro.",
      ]);

      this.laugh3Sound.play();
      for (let i = 0; i < 3; i++) {
        const rat = new Thing(this, 1, i * 180 - 500, 450 - i * 10, "rat");
        rat.setScale(0.5 + i * 0.1);
        rat.moveToX(VARS.width + 100, 500);
      }

      await pause(4000);

      await this.player.say(["What the fuck, were those all Salman?"]);

      this.paul.setHeadTexture("paul_sad");
      await this.paul.say([
        "Fucks sake, man.",
        "These fucking rats always eating all my peaches.",
        "Alright bro Imma go grab my shotgun.",
        "I'll see you round.",
      ]);
      await this.paul.moveToX(VARS.width + 50);

      await this.player.say(["Alright well Salman's dead."]);

      await pause(5000);

      await this.player.say(["Why is nothing happening."]);

      await pause();

      await this.player.say(["Let me out."]);

      await pause();

      this.backgroundMusic.stop();

      let lights = 1;
      const minGap = 100;
      const startGap = 3000;
      let dGap = 500;
      let ddGap = 30;
      let gap = startGap;
      while (gap > minGap) {
        if (lights) {
          lights = 0;
        } else {
          lights = 1;
        }
        this.setFade(lights);
        this.clickSound.play();
        await pause(gap);
        gap -= dGap;
        dGap -= ddGap;
      }

      this.clickSound.play();
      this.setFade(1);

      this.startNextLevel();
    };

    switch (getSectionSave()) {
      case "0":
        await introScript();
      case "loaded":
        setSectionSave("loaded");
        await startGame();
        break;
      default:
        console.log("ERR: Save file corrupt");
        setSectionSave(0);
        await this.runScript();
    }
  }

  async spawnPeach(x) {
    const arrow = this.add.sprite(x, 50, "arrow");
    arrow.setScale(0.5);
    arrow.setRotation(Math.PI / 2);
    await pause(1000);
    arrow.destroy();
    this.createPeach(x, -50);
  }

  createPeach(x, y) {
    const peach = new Thing(this, 1, x, y, "peach");
    peach.setScale(getRandomRange(5, 10) / 10);
    peach.setAngularVelocity(getRandomRange(-60, 60));
    peach.GRAVITY = 600;
    peach.enableGravity();
    this.peaches.add(peach);
  }

  update() {
    super.update();
  }
}
