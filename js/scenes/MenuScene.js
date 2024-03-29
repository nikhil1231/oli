class MenuScene extends BaseScene {
  static SCENE_CODE = "0";

  FLOOR_Y = 700;

  PLAYER_SPEED = 500;
  SPAWN_RATE_START = 2000;
  SPAWN_RATE_END = 1000;
  SPAWN_NUMBER = 20;

  constructor() {
    super(MenuScene.SCENE_CODE);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    this.stars = [];

    this.runScript();
  }

  async runScript() {
    this.spawnStars();

    await this.fadeIn(0.005);

    const button = this.add.text(
      VARS.width / 2,
      VARS.height / 2,
      "Start Game",
      {
        fontFamily: "Arial",
        fontSize: "48px",
        color: "#ffffff",
      }
    );
    button.setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });

    button.on("pointerup", () => {
      this.startNextLevel();
    });
  }

  spawnStars() {
    for (let i = 0; i < 50; i++) {
      const star = new Star(
        this,
        Math.floor(Math.random() * VARS.width),
        Math.floor(Math.random() * VARS.height),
        Math.random() * 4
      );
      this.stars.push(star);
    }
  }

  destroyStars() {
    this.stars.forEach((star) => star.destroy());
    this.stars = [];
  }

  update() {
    super.update();

    this.stars.forEach((star) => star.update());
  }
}
