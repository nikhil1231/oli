class SamScene extends BaseScene {
  static SCENE_CODE = "9";

  FLOOR_Y = 590;
  PLAYER_SPEED = 500;
  NUM_NOTES = 6;
  BEAT = 60_000 / 150;

  constructor() {
    super(SamScene.SCENE_CODE, "printworks");
  }

  preload() {
    super.preload();

    this.load.image("sam", "img/character/face/sam_scared.png");
    this.load.image("sam_smiling", "img/character/face/sam.png");
    this.load.image("sam_surprised", "img/character/face/sam_surprised.png");
    this.load.image("oli", "img/character/face/oli1.png");
    this.load.image("oli_scared", "img/character/face/oli_scared.png");
    this.load.image("oli_smiling", "img/character/face/oli_smiling.png");

    for (const type of ["peaceful", "evil"]) {
      for (let i = 0; i < this.NUM_NOTES; i++) {
        this.load.image(`music_${type}_${i}`, `img/music/${type}/${i}.png`);
      }
    }
    for (let i = 0; i < this.NUM_NOTES; i++) {
      this.load.image(`arrow_${i}`, `img/music/arrows/${i}.png`);
    }

    this.load.image("darkness", "img/darkness.png");
    this.load.image("jungle", "img/backgrounds/jungle.png");

    this.load.audio("sam_scream", "audio/sam_scream.wav");
    this.load.audio("fight_music", "audio/music/give_a_little.mp3");
    this.load.audio("dunun", "audio/dununnn.ogg");
  }

  create() {
    super.create();

    this.player = new Player(this, 200, this.FLOOR_Y - 200, 2, false);
    this.actors.add(this.player);

    this.player.enableGravity();

    this.sam = new Enemy(this, 20, VARS.width - 200, 250, "sam", 6);
    this.sam.enableGravity();
    this.sam.setLookAtPlayer(true);
    this.actors.add(this.sam);
    this.platforms.add(new Floor(this, this.FLOOR_Y));

    this.notes = [];
    this.noteSpacing = 100;
    for (let i = 0; i < this.NUM_NOTES; i++) {
      const note = new Note(
        this,
        i * this.noteSpacing - 6 * this.noteSpacing,
        300 + getRandomRange(-100, 100),
        i,
        "peaceful"
      );
      this.notes.push(note);
      this.actors.add(note);
    }

    this.fightMusic = this.sound.add("fight_music", {
      loop: true,
    });
    this.samScream = this.sound.add("sam_scream");
    this.dunun = this.sound.add("dunun");

    this.runScript();
  }

  async runScript() {
    const wait = async (n_beats) => {
      await pause(this.BEAT * n_beats);
    };

    const introScript = async () => {
      this.player.lockFlip = true;

      this.darkness = this.physics.add.sprite(
        this.player.x,
        this.player.y,
        "darkness"
      );
      this.darkness.setScale(0.6);
      this.darkness.setDepth(500);

      this.player.setJump(false);
      this.player.speed = 100;

      await pause();

      await this.player.say([
        "Fucks sake, why is it so dark?",
        "And why do my knees hurt again..?",
        "It appears I'm back in my normal body",
        "Well, it was nice to feel young again for a bit.",
      ]);

      await pause();

      await this.player.say(["Wait a minute.", "I know this place.."]);

      await this.zoomAndPanTo(
        3,
        this.player.x,
        this.player.y,
        2000,
        this.player,
        "Sine.easeInOut"
      );
      this.cameraFollowPlayer = true;

      let collisionTrigger = new CollisionTrigger(
        this,
        this.sam.x - 10,
        VARS.height / 2,
        50,
        VARS.height
      );
      await collisionTrigger.setTrigger(this.player);

      this.player.setImmobile(true);
      this.player.setHeadTexture("oli_scared");
      this.samScream.play();
      this.darkness.setScale(0.9);

      await pause(5000);

      this.sam.setHeadTexture("sam_smiling");
      this.cameraFollowPlayer = false;
      await this.zoomAndPanTo(1, VARS.width / 2, VARS.height / 2, 1000);

      await this.sam.say(["OLI!"]);
      this.player.setHeadTexture("oli_smiling");
      await this.player.say([
        "SAM!",
        "Jesus Christ, I'm glad to see you.",
        "I think I'm stuck in some kind of nightmare.",
        "Fuck, I might even just be dead.",
      ]);
      await this.sam.say(["Maybe it's OK to be dead."]);
      await this.player.say([
        "Please tell me you're not going to turn into a demon and try to kill me.",
      ]);
      await this.sam.say([
        "What are you on about mate?",
        "Don't worry, everything's normal here.",
        "At least, as far as I know.",
      ]);
      await this.player.say([
        "Thank fuck for that.",
        "Also, why is it so dark in here?",
      ]);
      await this.sam.say([
        "That's a good question.",
        "I turned off the lights but I can't remember why..",
        "I remember it being an important reason, that's for sure.",
      ]);

      await pause();

      await this.sam.say(["Oh well, doesn't matter."]);

      await this.zoomAndPanTo(
        3,
        this.player.x,
        this.player.y,
        2000,
        this.player,
        "Sine.easeInOut"
      );

      await pause(1000);

      this.clickSound.play();
      this.darkness.visible = false;

      await pause(1000);

      await this.zoomAndPanTo(1, VARS.width / 2, VARS.height / 2, 10000);

      await this.player.say([
        "Well, I didn't think I'd be back here so soon.",
        "What are you even doing here, Sam?",
      ]);
      await this.sam.say([
        "Bro I live here.",
        "I moved in 2 months ago, remember?",
      ]);
      await this.player.say(["I think I'd remember something like-"]);

      this.laugh2Sound.play();

      await pause(1000);
      this.player.setHeadTexture("oli");
      await pause(1000);

      await this.player.say(["What", "the fuck", "was that."]);
      await this.sam.say(["Oh that's just the alien music men."]);
      await this.player.say([
        "Bro what even is that.",
        "Why can't I get a break from all this nonsense??",
        "Whoever came up with all this has a terrible imagination.",
      ]);
      await this.sam.say([
        "Don't worry about them, bro.",
        "As long as they're not hungry we'll be fine.",
      ]);
      await this.player.say(["Well how do we know if they're hungry?"]);
      await this.sam.say(["Oh, you'll know."]);

      await pause(1000);

      this.rarSound.play();

      await pause(1000);

      this.sam.setHeadTexture("sam");
      await this.sam.say([
        "Oh fuck, they're hungry.",
        "And they're coming this way, don't fucking move.",
      ]);

      for (let i = 0; i < this.NUM_NOTES; i++) {
        this.notes[i].moveToX(300 + i * this.noteSpacing);
      }

      await pause(3000);

      await this.player.say(["Oh, they're much less scary than I imagined."]);

      await pause(1000);

      this.dunun.play();

      this.notes.forEach((note) => note.setEvil(true));

      await pause();

      await this.player.say(["Why must I speak."]);

      this.fightMusic.play();

      await this.sam.say([
        "For fucks sake, they always play this music when they're hunting.",
      ]);
      await this.player.say(["Oh I bet you love it when they hunt then."]);
      await this.sam.say(["What do you mean bro?", "I fucking hate jungle."]);

      await pause(1000);

      await this.player.say(["What is this hell I'm in."]);

      await pause();

      await Promise.all(this.notes.map((note) => note.moveToX(-100)));

      this.fightMusic.stop();

      await pause(1000);

      await this.player.say(["Oh, maybe they weren't actually hungry."]);
      await this.sam.say(["Mate, they haven't even started yet."]);

      this.isFirstTime = true;
    };

    const startGame = async () => {
      this.player.setImmobile(false);
      this.player.setJump(true);
      this.player.lockFlip = false;
      this.player.speed = this.PLAYER_SPEED;
      this.player.x = VARS.width / 2;

      this.notes.forEach((note) => {
        note.setY(100);
        note.setEvil(true);
      });

      await pause(1000);
      this.fightMusic.play();

      const noteInterval0 = 4;
      const noteInterval1 = 8;
      const noteInterval2 = 32;
      const noteInterval3 = 16;
      this.notes[0].startAttacking(noteInterval0);
      await wait(3 * noteInterval0 * 4);

      this.notes[1].startAttacking(noteInterval1);

      await wait(2 * noteInterval1 * 4);

      this.notes[1].attackInterval = noteInterval1 * 2;
      this.notes[2].startAttacking(noteInterval2);

      await wait(2 * noteInterval2 * 2);

      this.notes[3].startAttacking(noteInterval3);

      await wait(noteInterval3 * 4);

      this.notes.forEach((note) => note.stopAttacking());

      this.fightMusic.stop();

      await pause();
      this.sam.setHeadTexture("sam_smiling");
      this.sam.setLookAtPlayer(false);
      this.player.speed = 300;
      this.player.immobile = true;
      this.player.flipX = false;
      this.player.lockFlip = true;
      this.player.healthBar.visible = false;

      await this.sam.say([
        "Fucking hell bro, you survived.",
        "The first time they attacked me they fucking ate my soul.",
        "Anyway, I'm glad they're finally-",
      ]);

      this.clickSound.play();
      this.setFade(1);

      await pause(1000);
      this.backgroundImg.setTexture("jungle");

      this.clickSound.play();
      this.setFade(0);

      await pause();

      this.sam.setHeadTexture("sam_surprised");
      await this.sam.say(["Bro.", "Why the fuck are we in the jungle."]);
      await this.player.say([
        "As if I would know the answer to that question.",
        "Honestly though, that's not even the weirdest thing that's happened to me today.",
      ]);
      await this.sam.say([
        "That's mad.",
        "Bro I wish I had trips like this.",
        "All I get are aliens trying to attack me.",
      ]);
      await this.player.say([
        "What are you talking about, I literally just had alien music people attacking me.",
      ]);
      this.sam.setHeadTexture("sam_smiling");
      await this.sam.say([
        "That is true.",
        "So, what are you going to do now?",
      ]);
      await this.player.say([
        "I don't even know.",
        "But it looks like I'm getting closer and closer to the present day.",
        "Maybe then I'll be able to escape?",
      ]);
      await this.sam.say(["Fairs, bro."]);
      await this.player.say([
        "I guess I'll see you out there.",
        "Assuming I make it out.",
      ]);
      await this.sam.say(["Alright bro, I'll catch you in a bit."]);

      await this.sam.moveToX(200);

      await pause(1000);
      this.sam.setHeadTexture("sam_surprised");
      await pause(1000);

      await this.sam.say(["How the fuck do I even get home from here?"]);

      await this.sam.moveToX(-100);

      this.player.immobile = false;

      await this.initNextLevelTrigger();
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

  update() {
    super.update();

    if (this.cameraFollowPlayer) {
      this.cameras.main.centerOn(Math.max(160, this.player.x), this.player.y);
    }

    if (this.darkness) {
      this.darkness.setPosition(this.player.x, this.player.y);
    }
  }
}
