class AcidScene extends BaseScene {
  static SCENE_CODE = "7";

  FLOOR_Y = 590;

  constructor() {
    super(AcidScene.SCENE_CODE, "nikhil_bedroom");
  }

  preload() {
    super.preload();

    this.load.image("nikhil", "img/character/face/nikhil_acid.png");
    this.load.image("nikhil_evil", "img/character/face/nikhil_evil.png");
    this.load.image("ossian", "img/character/face/ossian_acid.png");
    this.load.image("ossian_evil", "img/character/face/ossian_evil.png");
    this.load.image("oli", "img/character/face/oli_acid.png");
    this.load.image("acid_tab", "img/acid.png");
    this.load.image("hell_background", "img/backgrounds/hell.png");
    this.load.image("gun", "img/gun.png");
    this.load.image("bullet", "img/bullet.png");
    this.load.image("bullet_red", "img/bullet_red.png");
    this.load.image("bullet_blue", "img/bullet_blue.png");

    this.load.audio("evil_laugh", "audio/evil_laugh.ogg");
    this.load.audio("gunshot", "audio/gunshot.wav");
    this.load.audio("fight_music", "audio/music/spider.mp3");
  }

  create() {
    super.create();

    this.evilLaughSound = this.sound.add("evil_laugh");

    this.player = new Player(this, 100, this.FLOOR_Y - 200, 2, false);
    this.actors.add(this.player);
    this.player.enableGravity();

    this.fightMusic = this.sound.add("fight_music", {
      volume: 0.3,
      loop: true,
    });

    this.runScript();
  }

  async runScript() {
    const [ossianx, ossiany] = [300, 150];
    const [nikhilx, nikhily] = [VARS.width - 300, 150];

    const introScript = async () => {
      this.isFirstTime = true;

      this.ossian = new Enemy(this, 20, VARS.width - 100, 200, "ossian", 3);
      this.nikhil = new Enemy(this, 20, VARS.width - 200, 250, "nikhil", 5);

      this.ossian.enableGravity();
      this.nikhil.enableGravity();

      this.actors.add(this.ossian);
      this.actors.add(this.nikhil);

      this.platforms.add(new Floor(this, this.FLOOR_Y));

      await pause();

      await this.player.say([
        "Jesus Christ.",
        "That apple pie literally killed me.",
        "Absolutely worth it though.",
      ]);
      await this.nikhil.say([
        "Ah, Oli, you finally made it.",
        "This is my friend Ossian.",
      ]);
      await this.ossian.say(["Hello Oli, nice to meet you."]);
      await this.player.say([
        "Oh fuck no please.",
        "Not this acid trip again, please god no.",
      ]);
      await this.nikhil.say([
        "Huh? I thought you said you hadn't done acid before.",
      ]);
      await this.player.say([
        "No you wouldn't get it.",
        "I'm stuck in some kind of fever dream or psychadelic trip or some shit.",
      ]);
      await this.nikhil.say(["What, are you high already haha?"]);
      await this.player.say([
        "No..",
        "Ugh nvm there's no point tryign to explain it.",
        "Let's just get on with it.",
        "Looks like I have to progress the storyline or whatever.",
      ]);
      await this.nikhil.say([
        "Dude are you sure you want to do this?",
        "Sounds like you're kinda going through something right now..",
      ]);
      await this.player.say([
        "Yes I'm fine.",
        "It wasn't that bad last time anyway.",
        "All I have to remember is that my phone might look like my old phone and that I'm not in hell.",
      ]);

      await this.ossian.say(["What?? Hell??"]);
      await this.player.say(["No sorry, ignore me, you'll be fine."]);
      await this.nikhil.say(["Alrighty, let's take some drugs!"]);

      this.player.immobile = true;
      await pause(1000);

      const acidSize = 50;
      const acid1 = new CollisionTrigger(
        this,
        this.ossian.x,
        300,
        acidSize,
        acidSize,
        "acid_tab"
      );

      acid1.enableGravity();
      acid1.setTrigger(this.ossian, () => this.healSound.play());

      await pause(1000);

      const acid2 = new CollisionTrigger(
        this,
        this.nikhil.x,
        300,
        acidSize,
        acidSize,
        "acid_tab"
      );

      acid2.enableGravity();
      acid2.setTrigger(this.nikhil, () => this.healSound.play());

      await pause(1000);

      const acid3 = new CollisionTrigger(
        this,
        this.player.x,
        300,
        acidSize,
        acidSize,
        "acid_tab"
      );

      acid3.enableGravity();
      acid3.setTrigger(this.player, () => this.healSound.play());

      await pause();

      this.clickSound.play();
      this.setFade(1);

      this.backgroundImg.setTexture("hell_background");
      this.ossian.setHeadTexture("ossian_evil");
      this.nikhil.setHeadTexture("nikhil_evil");

      this.ossian.speech.speechSound = this.cursedSpeechSound;
      this.nikhil.speech.speechSound = this.cursedSpeechSound;

      await pause(1000);

      this.clickSound.play();
      this.setFade(0);
      this.evilLaughSound.play();

      await pause(5000);

      await this.player.say(["Well this is great."]);
      await this.ossian.say(["You fool.", "You fell right into our trap."]);
      await this.nikhil.say(["You fell right into our trap."]);
      await this.ossian.say([
        "Yes, thank you Demon Nikhil, I already said that.",
      ]);
      await this.nikhil.say([
        "But you always get to say that line, Demon Ossian.",
        "I wanted some time in the spotlight.",
      ]);
      await this.ossian.say([
        "Well that's because you don't say it with enough wickedness.",
        "Maybe if you spent more time being evil instead of wasting time programming I would let you say the line.",
      ]);
      await this.nikhil.say([
        "I thought you said you supported my passions...",
      ]);
      await this.ossian.say([
        "Look can we talk about this another time?",
        "We have a guest to entertain.",
        "And by entertain, I mean kill!",
      ]);
      await this.nikhil.say(["Hehe, good one, Demon Ossian."]);
      await this.ossian.say(["Thank you, Demon Nikhil."]);

      await pause(1000);

      await this.player.say(["Fuck, I wish I had a gun again."]);

      await pause();

      this.player.enableGun();
      this.healSound.play();

      await pause();

      await this.player.say([
        "Holy shit that actually worked.",
        "I wish I had a massive penis.",
      ]);

      await pause();

      await this.player.say(["Fuck, it didn't work."]);

      await this.ossian.say([
        "Demon Nikhil, why have you allowed Oliver to obtain a weapon?",
      ]);
      await this.nikhil.say([
        "I don't know Demon Ossian, I thought you allowed this.",
      ]);
      await this.ossian.say([
        "I did not allow this, Demon Nikhil.",
        "No matter, we will kill him anyway,",
      ]);

      this.fightMusic.play();

      this.player.setImmobile(false);

      this.nikhil.moveToX(this.player.x, 50);
      this.ossian.moveToX(this.player.x, 50);

      await this.awaitDeaths([this.ossian, this.nikhil]);

      await pause();

      this.player.setImmobile(true);

      await this.ossian.say(["Oh no, it appears that Oliver has defeated us."]);
      await this.nikhil.say([
        "What? But I thought we were doing that bit where we just pretend to be really weak...",
        "...so that he lets his guard down and we can take our true evil forms and kill him easily.",
      ]);
      await this.ossian.say([
        "...",
        "Thank you for ruining the plan, Demon Nikhil.",
      ]);
      await this.nikhil.say(["Oh...sorry."]);
      await this.ossian.say(["Doesn't matter, lets just finish him."]);

      this.clickSound.play();
      this.setFade(1);

      this.nikhil.x = -100;
      this.ossian.x = -100;

      await pause();
    };

    const spawnEnemies = () => {
      this.backgroundImg.setTexture("hell_background");

      this.ossian = new HeadEnemy(this, 200, ossianx, ossiany, "ossian");
      this.nikhil = new HeadEnemy(this, 200, nikhilx, nikhily, "nikhil");
      this.ossian.setHeadTexture("ossian_evil");
      this.nikhil.setHeadTexture("nikhil_evil");

      this.ossian.speech.speechSound = this.cursedSpeechSound;
      this.nikhil.speech.speechSound = this.cursedSpeechSound;

      this.ossian.setScale(1);
      this.nikhil.setScale(0.8);

      this.actors.add(this.ossian);
      this.actors.add(this.nikhil);

      this.platforms.add(new Floor(this, this.FLOOR_Y));

      if (!this.player.gun) this.player.enableGun();

      this.clickSound.play();
      this.setFade(0);
    };

    const startGame = async () => {
      spawnEnemies();
      this.fightMusic.play();

      if (this.isFirstTime) {
        await pause(1000);

        await this.nikhil.say([
          "It's not fair, how come your true form is bigger than mine?",
        ]);
        await this.ossian.say(["Clearly I'm just more evil than you."]);
        await this.nikhil.say([":("]);

        await pause(1000);
      }

      await pause(1000);

      this.ossian.runPhase(1);
      this.ossian.startStrafing();

      this.nikhil.runPhase(3);
      this.nikhil.startStrafing();

      await this.awaitDeaths([this.ossian, this.nikhil]);

      await pause();

      // TODO: dialogue

      this.clickSound.play();
      this.setFade(1);

      this.ossian.destroy();
      this.nikhil.destroy();
      await pause(2000);

      this.isFirstTimePhase2 = true;
      this.healSound.play();
    };

    const phase2 = async () => {
      spawnEnemies();

      this.clickSound.play();
      this.setFade(0);

      if (this.isFirstTimePhase2) {
        // TODO: dialogue
      } else {
        this.fightMusic.play();
      }

      this.ossian.startAttackingRandom();
      this.ossian.startStrafing();

      this.nikhil.headSpeedMult = 2;
      this.nikhil.runPhase(3);
      this.nikhil.startStrafing();

      await this.awaitDeaths([this.ossian, this.nikhil]);

      this.fightMusic.stop();
      await pause();

      // TODO: dialogue
      await this.ossian.say([
        "Consider yourself free..",
        "..for now...",
        "Come, Demon Nikhil, let us go and consume some DMT.",
      ]);
      await this.nikhil.say(["Yay, that's my favourite!"]);

      await pause(1000);

      this.ossian.destroy();
      this.nikhil.destroy();
      this.deathNoise.play();

      await pause();

      await this.player.say([
        "Jesus Christ what even was that?",
        "It looks like things are just getting weirder and weirder.",
      ]);

      await this.swirlTease(70, 100);

      await this.player.say(["Ugh, not this shit again.."]);

      await this.swirlNextLevel();
    };

    switch (getSectionSave()) {
      case "0":
        await introScript();
      case "loaded":
        setSectionSave("loaded");
        await startGame();
      case "phase2":
        setSectionSave("phase2");
        await phase2();
        break;
      default:
        console.log("ERR: Save file corrupt");
        setSectionSave(0);
        await this.runScript();
    }
  }

  update() {
    super.update();
  }
}
