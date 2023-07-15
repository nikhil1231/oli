class ShooterScene extends BaseScene {
  static SCENE_CODE = "3";

  FLOOR_Y = 560;
  PLAYER_SPEED = 500;

  constructor() {
    super(ShooterScene.SCENE_CODE, "blackops", true);
  }

  preload() {
    super.preload();

    this.load.image("blackops_bg", "img/backgrounds/blackops_bg.png");

    this.load.image("aman", "img/character/face/aman_young_2.png");
    this.load.image("nikhil", "img/character/face/nikhil_young_2.png");
    this.load.image("oli", "img/character/face/oli_young_2.png");
    this.load.image("gun", "img/gun.png");
    this.load.image("bullet", "img/bullet.png");
    this.load.image("bullet_red", "img/bullet_red.png");
    this.load.image("platform", "img/platform.png");

    this.load.audio("gunshot", "audio/gunshot.wav");
  }

  create() {
    super.create();
    this.player = new Player(this, -100, this.FLOOR_Y, 5, false);
    this.player.setCollideWorldBounds(false);
    this.player.setImmobile(true);
    this.actors.add(this.player);

    this.gameDone = false;

    this.runScript();
  }

  async runScript() {
    const introScript = async () => {
      this.loadingBar = new LoadingBar(
        this,
        0.05,
        50,
        VARS.height - 100,
        VARS.width - 100,
        20
      );

      super.runScript();

      await pause();

      await this.player.say(["Oh sick it's black ops."]);

      await pause();

      await this.player.say(["Wait, where the fuck is my body??"]);

      await pause();

      await this.fadeOut();

      this.loadingBar.destroy();

      spawnEnemies();
      setUpGame();

      await this.fadeIn();

      await this.player.say(["Ok, I'm back", "And I can feel gravity again!"]);

      await pause(4000);

      await this.aman.say(["Hope you're ready to get fucked in the arse."]);

      await this.player.say(["It's those 2 against me? That's not fair."]);

      await pause();

      await this.player.say([
        "Actually, I'm better than both of them combined, so it's completely fair.",
      ]);

      await pause();

      this.nikhil.enableGun();
      this.aman.enableGun();
      this.hitSound.play();

      await pause();

      await this.player.say(["What?? Where's my gun??"]);

      await pause();

      this.player.enableGun();
      this.createNoise.play();

      await pause();

      await this.player.say(["Alright, let's fuck them up."]);
    };

    const setUpGame = async () => {
      this.backgroundImg.setTexture("blackops_bg");

      this.player.setPosition(100, this.FLOOR_Y - 200);
      this.player.setCollideWorldBounds(true);
      this.player.setImmobile(false);
      this.platforms.add(new Floor(this, this.FLOOR_Y));
      this.player.enableGravity();

      const platformPostitions = [
        [200, 400],
        [600, 450],
        [1000, 480],
        [0, 200],
        [400, 240],
        [800, 300],
        [1200, 260],
      ];

      for (const [x, y] of platformPostitions) {
        const platform = new Platform(this, x, y, 0.3, "platform");
        this.platforms.add(platform);
      }
    };

    const quickStart = async () => {
      spawnEnemies();
      setUpGame();

      this.nikhil.enableGun();
      this.aman.enableGun();
      this.player.enableGun();

      await pause(1000);
    };

    const startGame = async () => {
      if (!this.aman) {
        await quickStart();
      }

      this.nikhil.startAttacking();
      this.aman.startAttacking();

      let nikDiedFirst = false;

      await new Promise((r) => {
        const i = setInterval(() => {
          if (!this.nikhil.isAlive && this.aman.isAlive) {
            nikDiedFirst = true;
          }
          if (!this.nikhil.isAlive && !this.aman.isAlive) {
            r();
            clearInterval(i);
          }
        }, 20);
      });

      this.player.disableGun();

      await pause();

      await this.aman.say(["For fucks sake.", "Nikhil, you're shit."]);

      if (nikDiedFirst) {
        await this.nikhil.say([
          "What are you talking about??",
          "Maybe I wouldn't have died if you could actually aim.",
        ]);
      } else {
        await this.nikhil.say(["How am I the bad one, you died first!"]);
      }

      await this.player.say([
        "Look, clearly you're both shit, and I'm the best out of all of us.",
      ]);

      await this.aman.say(["Let's do a 1v1 Oli, I'll fuck you up."]);
      await this.nikhil.say(["No I'm bored of this, let's play Monopoly."]);
      await this.aman.say([
        "Mate you've lost every time, there's no point even playing.",
      ]);

      await this.swirlTease(70, 100);

      await pause(1000);

      await this.player.say([
        "Ah, fuck, not again...",
        "I wonder where it'll take me next.",
      ]);

      await this.nikhil.say([
        "Wait where are you going??",
        "I thought we were going to play table tennis after this?",
      ]);

      await this.player.say([
        "Sorry mate, I wish I could control this.",
        "I'll see you guys when we're older, I guess.",
      ]);

      await this.swirlNextLevel();
    };

    const spawnEnemies = async () => {
      this.aman = new Enemy(
        this,
        100,
        VARS.width - 100,
        this.FLOOR_Y - 200,
        "aman",
        5
      );
      this.nikhil = new Enemy(this, 200, VARS.width - 400, 100, "nikhil", 5);

      this.aman.dmg = 7;
      this.nikhil.dmg = 7;

      this.aman.enableGravity();
      this.nikhil.enableGravity();

      this.aman.setCollideWorldBounds(true);
      this.nikhil.setCollideWorldBounds(true);

      this.actors.add(this.aman);
      this.actors.add(this.nikhil);
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
    if (this.loadingBar) this.loadingBar.draw();
  }
}
