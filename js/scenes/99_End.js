class EndScene extends BaseScene {
  static SCENE_CODE = "12";

  FLOOR_Y = 700;

  PLAYER_SPEED = 500;
  SPAWN_RATE_START = 2000;
  SPAWN_RATE_END = 1000;
  SPAWN_NUMBER = 20;

  constructor() {
    super(EndScene.SCENE_CODE);
  }

  preload() {
    super.preload();

    this.load.image("oli", "img/character/face/oli1.png");
    this.load.image("oli_dark", "img/character/face/oli_dark.png");
    this.load.image("oli_smiling", "img/character/face/oli_smiling.png");
    this.load.image("nikesh", "img/character/face/nikesh.png");
    this.load.image("nikhil", "img/character/face/nikhil_now.png");

    this.load.image("flat", "img/backgrounds/flat.png");
    this.load.audio("background_music", `audio/music/flat.mp3`);
  }

  create() {
    super.create();

    this.player = new Player(
      this,
      VARS.width / 2,
      this.FLOOR_Y - 200,
      2,
      false
    );
    this.player.setHeadTexture("oli_dark");
    this.actors.add(this.player);

    this.nikesh = new Enemy(
      this,
      20,
      VARS.width + 100,
      this.FLOOR_Y,
      "nikesh",
      5
    );
    this.nikhil = new Enemy(
      this,
      20,
      VARS.width + 100,
      this.FLOOR_Y - 200,
      "nikhil",
      3
    );
    this.actors.add(this.nikesh);
    this.actors.add(this.nikhil);

    this.stars = [];

    this.runScript();
  }

  async runScript() {
    this.player.setImmobile(true);
    this.playerWobble = true;

    this.setFade(1);
    await pause();

    this.spawnStars();

    await this.fadeIn(0.005);

    await pause(3000);

    await this.player.say(["...", "Huh...?"]);

    await pause(3000);

    await this.player.say(["Where..", "Where am I...?"]);

    await pause(3000);

    await this.nikesh.say(["Oli..", "..wake up.."]);

    await pause();

    await this.player.say(["...", "...Nikesh...?"]);

    await this.player.say(["Where am I..."]);

    await pause(3000);
    await this.player.say(["Where am I?!"]);

    this.clickSound.play();
    this.destroyStars();
    this.playerWobble = false;
    this.backgroundImg = new Phaser.GameObjects.Image(
      this,
      VARS.width / 2,
      VARS.height / 2,
      "flat"
    );
    this.backgroundImg.setDepth(-100);
    this.add.existing(this.backgroundImg);
    this.player.setHeadTexture("oli");
    this.nikhil.x = 800;

    this.backgroundMusic = this.sound.add("background_music", {
      volume: 0.5,
      loop: true,
    });

    this.backgroundMusic.play();

    await pause(3000);

    await this.nikhil.say(["Wow, haven't heard that one in a while, haha."]);

    const ans = await this.nikhil.ask("You ok? You look kinda zonked.", [
      "Yeah",
      "No",
      "I don't know",
    ]);

    if (ans == 0) {
      await this.player.say([
        "Yeah, I'm fine.",
        "I think I just had a weird daydream or something.",
      ]);
      await this.nikhil.say(["Fairs."]);
    } else if (ans == 1) {
      await this.player.say([
        "Bro I just had the craziest dream.",
        "Like we were kids then we were growing up, and I was put in these progressingly weird scenarios.",
        "But I was somehow still awake.",
        "It actually felt like a really bad acid trip.",
      ]);
      await this.nikhil.say([
        "Jesus Christ, dude, that sounds insane.",
        "You good now?",
      ]);
      await this.player.say(["Yeah, I'll be fine."]);
    } else {
      await this.player.say([
        "Fuck me, I don't even know.",
        "I think I just had a weird daydream or something.",
      ]);
      await this.nikhil.say(["Fairs."]);
    }

    await this.nikhil.say([
      "I've got some left over McDonald's apple pies, that might revive you haha.",
    ]);

    await pause(1000);

    await this.player.say([
      "Uhh, no thanks, I've actually lost my appetite for them.",
    ]);

    await this.nikhil.say(["Damn, I never thought I'd see the day."]);

    await pause();

    await this.nikhil.say([
      "Anyway, happy birthday dude.",
      "I hope you have a great day.",
    ]);

    await this.fadeOut(0.005);
    this.clickSound.play();
    this.setFade(0);

    this.backgroundMusic.pause();

    await pause();

    await this.player.say(["My birthday was almost a month ago."]);

    await pause();

    this.backgroundMusic.play();
    await this.nikhil.say(["Ah well, better late than never, right?"]);
    await this.player.say(["..."]);

    await pause();

    await this.nikhil.say([
      "Also, did you hear about how they're turning printworks into flats?",
      "Can you imagine if one of the boys ended up living there haha?",
    ]);

    this.backgroundMusic.stop();
    await pause(1000);

    await this.player.say(["Oh I can imagine it alright."]);

    await this.zoomAndPanTo(4, this.player.x, this.player.y, 3000);

    await this.fadeOut(0.005);

    this.startNextLevel();
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

    if (this.playerWobble) {
      this.player.x = VARS.width / 2 + 40 * Math.sin(this.time.now / 3000);
    }
  }
}

class Star {
  constructor(scene, x, y, dist) {
    this.star = scene.add.graphics();
    this.star.setDepth(-1);
    this.star.fillStyle(0x555555 + 2 * Math.floor(dist) * 0x111111);
    this.star.fillCircle(x, y, 2 + dist * 0.6);
    this.v = (1 + dist * 1) * 0.3;
    this.spawnX = x;
    this.spawnY = y;
  }

  update() {
    this.star.y -= this.v;
    if (this.star.y < -this.spawnY - 20) {
      this.star.y = VARS.height - this.spawnY;
      this.star.x = Math.random() * VARS.width - this.spawnX;
    }
  }

  destroy() {
    this.star.destroy();
  }
}
