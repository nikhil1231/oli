class PIScene extends BaseScene {
  static SCENE_CODE = "7";

  FLOOR_Y = 590;
  PLAYER_SPEED = 500;
  MAX_CAR_SPEED = 2;
  CAR_X = 300;
  CAR_DAMAGE = 20;
  ENEMY_CAR_SPEED_CHANGE = 40;
  ENEMY_CAR_SPEED_FAST = 300;
  ENEMY_CAR_SPEED_SLOW = 50;
  ENEMY_CAR_SPEED_VAR = 50;
  ENEMY_CAR_SPAWN_MARGIN = 50;

  constructor() {
    super(PIScene.SCENE_CODE, "piccadilly_outside");
  }

  preload() {
    super.preload();

    this.load.image("aman", "img/character/face/aman_uni.png");
    this.load.image("dylan", "img/character/face/dylan.png");
    this.load.image("nikhil", "img/character/face/nikhil_uni.png");
    this.load.image("nikhil_sick", "img/character/face/nikhil_uni_sick.png");
    this.load.image("oli", "img/character/face/oli_uni.png");
    this.load.image("oli_sad", "img/character/face/oli_uni_sad.png");
    this.load.image("ben_black", "img/character/face/ben_black.png");
    this.load.image("ben", "img/character/face/ben.png");
    this.load.image("ben_drunk_1", "img/character/face/ben_drunk_1.png");
    this.load.image("ben_drunk_2", "img/character/face/ben_drunk_2.png");
    this.load.image("wall", "img/wall.png");
    this.load.image("applepie", "img/applepie.png");

    this.load.audio("break_sound", "audio/break.wav");
    this.load.audio("tire_screech", "audio/tire_screech.wav");
  }

  create() {
    super.create();

    this.aman = new Enemy(this, 100, -100, 200, "aman", 5);
    this.nikhil = new Enemy(this, 100, -100, 250, "nikhil", 3);
    this.dylan = new Enemy(this, 200, -100, 50, "dylan", 3);
    this.ben = new Enemy(this, 200, -100, 50, "ben", 3);

    this.nikhil.setHeadTexture("nikhil_sick");
    this.ben.setHeadTexture("ben_drunk_2");

    this.aman.enableGravity();
    this.nikhil.enableGravity();
    this.dylan.enableGravity();
    this.ben.enableGravity();
    this.actors.add(this.aman);
    this.actors.add(this.nikhil);
    this.actors.add(this.dylan);
    this.actors.add(this.ben);

    this.player = new Player(this, 100, this.FLOOR_Y - 200, 2, false);
    this.actors.add(this.player);
    this.player.setHealth(5);
    this.player.immobile = true;
    this.player.immortal = true;
    this.platforms.add(new Floor(this, this.FLOOR_Y));
    this.player.enableGravity();

    this.runScript();
  }

  async runScript() {
    let zoom = 3;
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(200, VARS.height - 200);
    await this.fadeIn();

    await pause(1000);

    this.player.setHeadTexture("oli_sad");

    await pause(1000);

    zoom = 2;
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(300, VARS.height - 200);
    this.swooshSound.play();

    await pause(1000);

    zoom = 1.5;
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(400, VARS.height - 300);
    this.swooshSound.play();

    await pause(1000);

    zoom = 1;
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(VARS.width / 2, VARS.height / 2);
    this.swooshSound.play();

    await pause(1000);

    await this.player.say([
      "Are you fucking serious.",
      "This is what I nearly died for??",
    ]);

    await pause();

    const friends = [this.aman, this.nikhil, this.ben, this.dylan];

    for (let i = 0; i < friends.length; i++) {
      this.blockSound.play();
      friends[i].x = VARS.width / 2 - 120 + i * 60;
      friends[i].setVelocityY(-500);
      await pause(500);
    }

    await this.aman.say([
      "For fucks sake, they're not letting us in.",
      "I don't even know why, we all look sober as fuck.",
      "Fuck it, I'm going home.",
    ]);

    await this.nikhil.say(["Yeahah, I neeed to gett homme.."]);

    await this.ben.say(["Fiiine."]);

    this.aman.moveToX(VARS.width + 100);
    this.ben.moveToX(VARS.width + 100);
    this.dylan.moveToX(VARS.width + 100);
    await this.nikhil.moveToX(VARS.width + 100);

    await this.player.say([
      "This has been the worst night out ever.",
      "And I still feel terrible from that car ride.",
      "If only I had something to replenish my health.",
      "But what could I possibly find around here?",
    ]);

    await this.narrator.say([
      "Just as you speak those words, you feel a powerful presence appear.",
      "Just as if the gods heard your prayer, they send down a gift.",
      "Legends have been told of the incredible healing abilities of this ambrosia.",
    ]);

    const applepie = new Thing(this, 1, 700, -100, "applepie", false);
    applepie.setScale(0.4);
    this.actors.add(applepie);

    await new Promise(async (r) => {
      this.physics.add.overlap(applepie, this.player, () => {
        applepie.destroy();
        r();
      });

      applepie.moveTo(700, this.FLOOR_Y - 100, 100);

      this.player.setHeadTexture("oli");
      await this.player.say([
        "Oh my god.",
        "An apple pie!",
        "This is exactly what I need right now.",
      ]);

      this.player.immobile = false;
    });

    this.player.heal(1000);

    await pause(500);

    await this.player.say([
      "Oh my god I feel incredible.",
      "Nothing can stop me now!",
    ]);

    await pause();

    await this.player.takeDamage(10);

    await pause();

    this.player.setHeadTexture("oli_sad");

    await this.player.say([
      "Ugghhhhh..",
      "Now I feel even worse..",
      "Why is this happening..?",
    ]);

    await pause(1000);
    await this.player.takeDamage(20);
    await pause();
    await this.player.takeDamage(20);

    await pause(1000);

    await this.player.say(["Oh god no..", "Gluten."]);

    await pause();
    this.player.takeDamage(100);

    await pause();

    await this.player.say([
      "So this is how I die.",
      "Of all the things that could've killed me...",
    ]);

    await pause(1000);
    await this.fadeOut();
    this.startNextLevel();
  }

  update() {
    super.update();
  }
}
