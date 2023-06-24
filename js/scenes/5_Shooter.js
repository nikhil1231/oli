class ShooterScene extends BaseScene {
  static SCENE_CODE = "3";

  FLOOR_Y = 560;
  PLAYER_SPEED = 500;

  constructor() {
    super(ShooterScene.SCENE_CODE, "blackops_loading");
  }

  preload() {
    super.preload();

    this.load.image("blackops_bg", "img/backgrounds/blackops_bg.png");

    this.load.image("aman", "img/character/face/aman_young_1.png");
    this.load.image("nikhil", "img/character/face/nikhil_young_1.png");
    this.load.image("oli", "img/character/face/oli_young_1.png");
    this.load.image("gun", "img/gun.png");
    this.load.image("bullet", "img/bullet.png");
    this.load.image("platform", "img/platform.png");

    this.load.audio("gunshot", "audio/gunshot.wav");
  }

  create() {
    super.create();
    this.player = new Player(this, -100, this.FLOOR_Y, "oli_young_2", false);
    this.player.setCollideWorldBounds(false);
    this.player.setImmobile(true);

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

      this.loadingBar.destroy();
    };

    const preGame = async () => {
      await this.player.say(["It's those 2 against me? That's not fair."]);

      await pause();

      await this.player.say(["Actually, I'm better than both of them combined, so it's completely fair."]);
    }

    const startGame = async () => {
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

      this.player.enableGun();
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
    }
  }

  update() {
    super.update();
    if (this.loadingBar) this.loadingBar.draw();
    if (this.aman) this.aman.update();
    if (this.nikhil) this.nikhil.update();
  }
}
