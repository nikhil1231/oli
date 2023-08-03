class DrivingScene extends BaseScene {
  static SCENE_CODE = "5";

  FLOOR_Y = 650;
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
    super(DrivingScene.SCENE_CODE, "road", true);
  }

  preload() {
    super.preload();

    this.load.image("road", "img/backgrounds/road.png");
    for (let i = 0; i < 4; i++) {
      this.load.image(`car${i}`, `img/car/${i}.png`);
    }

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

    this.load.audio("break_sound", "audio/break.wav");
    this.load.audio("tire_screech", "audio/tire_screech.wav");
  }

  create() {
    super.create();
    this.player = new Player(this, 100, this.FLOOR_Y - 200, 4, false);
    this.player.immobile = true;
    this.player.setHeadTexture("oli");
    this.actors.add(this.player);

    this.breakSound = this.sound.add("break_sound");
    this.tireScreechSound = this.sound.add("tire_screech");

    this.car = new Car(this, 700, 300, 100, "car0", true);
    this.actors.add(this.car);
    this.carSpeed = 0;

    this.backgroundImg2 = new Phaser.GameObjects.Image(
      this,
      VARS.width * 1.5,
      VARS.height / 2,
      "background"
    );
    this.backgroundImg2.setDepth(-100);
    this.add.existing(this.backgroundImg2);

    this.enemyCars = this.add.group();
    this.walls = this.add.group();

    this.backgroundMusic.setSeek(30);
    this.backgroundMusic.setVolume(0);

    this.runScript();
  }

  async runScript() {
    const introScript = async () => {
      this.aman = new Enemy(this, 100, 100, 200, "aman", 5);
      this.nikhil = new Enemy(this, 100, 150, 250, "nikhil", 3);
      this.dylan = new Enemy(this, 200, 140, 50, "dylan", 3);

      this.actors.add(this.aman);
      this.actors.add(this.nikhil);
      this.actors.add(this.dylan);

      await pause();

      for (const actor of [this.aman, this.nikhil, this.dylan]) {
        await pause(500);
        actor.moveTo(this.car.x, this.car.y, 300).then(() => {
          actor.x = -100;
          this.blockSound.play();
        });
      }

      this.player.immobile = false;

      const carStart = new CollisionTrigger(
        this,
        this.car.x,
        this.car.y,
        this.car.displayWidth,
        this.car.displayHeight
      );

      await carStart.setTrigger(this.player);

      this.player.setCollideWorldBounds(false);
      this.player.setVelocity(0);
      this.player.x = -100;
      this.player.immobile = true;

      this.backgroundMusic.setVolume(0.1);

      await new Promise(async (r) => {
        while (true) {
          this.carSpeed += 0.01;
          await pause(20);
          if (this.carSpeed > this.MAX_CAR_SPEED) {
            this.carSpeed = this.MAX_CAR_SPEED;
            r();
            return;
          }
        }
      });

      this.carSpeed = this.MAX_CAR_SPEED;

      this.car.moveTo(this.CAR_X, this.car.y, 100);

      this.ben = new Enemy(this, 100, -100, 200, "ben", 5);
      this.actors.add(this.ben);
      this.ben.setHeadTexture("ben_black");

      await this.aman.say(["Driver, do you mind turning the music up a bit?"]);
      await this.ben.say(["Sure."]);
      await pause(1000);
      this.backgroundMusic.setVolume(0.3);
      await pause(1000);
      await this.ben.say(["How's your night going so far?"]);
      await this.aman.say(["Not too bad, thanks."]);
      await pause(1000);
      await this.player.say(["...", "???", "!!!", "Ben?!?!"]);
      this.ben.setHeadTexture("ben");
      await this.ben.say(["Hellooooo!"]);
      await this.player.say([
        "Why are you here?! I hadn't even met you at this point.",
        "Why are you an Uber driver?!",
      ]);
      await this.ben.say([
        "My driving test is in a couple weeks, I could do with the practise.",
      ]);

      this.player.setHeadTexture("oli_sad");
      await this.player.say([
        "What!?",
        "You haven't even passed your test yet??",
      ]);
      await this.ben.say(["Nah"]);
      await this.nikhil.say(["Oli, how do you know the Uber driver haha?"]);
      await this.player.say(["What do you mean, this is Benedict!"]);
      await this.ben.say(["Actually my name is Benjamin."]);
      await this.nikhil.say(["Nice to meet you Benjamin."]);
      await pause();
      await this.ben.say(["By the way..", "..I think it's worth mentioning"]);
      this.ben.setHeadTexture("ben_drunk_2");
      await this.ben.say(["...I am spangled."]);

      await pause();
      this.player.setHeadTexture("oli");
      await this.player.say(["Okay."]);
      this.player.setHeadTexture("oli_sad");
      await this.player.say(["Get me out of this car right now."]);
      await this.ben.say(["Bro, Imma need you to take over.", "help"]);
      await this.player.say(["What do you mean take over??", "Pull over now!"]);
      await this.aman.say([
        "Oli stop being a little bitch, just drive the car.",
      ]);
      await this.player.say([
        "BEN.",
        "DON'T TAKING YOUR FUCKING HANDS OFF THE STEERING WHEEL.",
      ]);
      this.car.targetSteeringAngle = 0.2;
      this.tireScreechSound.play();
      this.car.activateControls();

      await pause(1000)

      await this.narrator.say([
        "Realising you have no choice, you take the wheel.",
        "You also somehow learn to drive the car using only the [W] and [S] keys.",
      ]);

      await pause();

      await this.ben.say([
        "Ah fuck..",
        "...I forgot to take my car to the garage.",
        "But it's fine, everything works fine except the brakes.",
      ]);
      await this.player.say(["Ben", "Please tell me this isn't your car."]);
      await this.ben.say(["Uhhhhhhh.."]);
      await this.player.say(["Fuck my life."]);
    };

    const startGame = async () => {
      if (!this.aman) {
        this.aman = new Enemy(this, 100, -100, 200, "aman", 5);
        this.nikhil = new Enemy(this, 100, -150, 250, "nikhil", 3);
        this.dylan = new Enemy(this, 200, -140, 50, "dylan", 3);
        this.ben = new Enemy(this, 200, -140, 50, "ben", 3);

        this.actors.add(this.aman);
        this.actors.add(this.nikhil);
        this.actors.add(this.dylan);
        this.actors.add(this.ben);

        this.player.setCollideWorldBounds(false);
        this.player.x = -100;

        this.backgroundMusic.setVolume(0.3);
      }
      this.carSpeed = this.MAX_CAR_SPEED;
      this.car.activateControls();

      await spawnCars(3);

      await pause(5000);

      await spawnEndWall();

      await pause();

      this.ben.x = this.car.x + 300;
      this.ben.y = 300;
      this.healSound.play();
      await this.ben.say(["Bro wtf, what've you done to my car??"]);

      await pause(300);
      this.player.x = this.car.x + 400;
      this.player.y = 300;
      this.healSound.play();
      await this.player.say([
        "Shut the fuck up, I'm giving you one star on Uber.",
      ]);

      await this.ben.say(["...", "Fair."]);

      await pause(300);
      this.aman.x = this.car.x + 350;
      this.aman.y = 400;
      this.healSound.play();
      await this.aman.say(["Hurry up, let's go."]);

      await pause(300);
      this.nikhil.x = this.car.x + 300;
      this.nikhil.y = 500;
      this.healSound.play();

      await pause(300);
      this.dylan.x = this.car.x + 400;
      this.dylan.y = 550;
      this.healSound.play();

      this.aman.moveToX(VARS.width + 100);
      this.ben.moveToX(VARS.width + 100);
      this.dylan.moveToX(VARS.width + 100);
      await this.nikhil.moveToX(VARS.width + 100);

      this.player.immobile = false;
      this.player.resetControls();
      await this.initNextLevelTrigger();
    };

    const spawnCars = async (n) => {
      while (n) {
        n--;
        spawnCar();
        this.carSpeed += 0.03;
        await pause(1000);
      }
    };

    const spawnCar = async () => {
      const spawnY = getRandomRange(
        this.ENEMY_CAR_SPAWN_MARGIN,
        VARS.height - this.ENEMY_CAR_SPAWN_MARGIN
      );
      const direction = spawnY > VARS.height / 2;
      const car = new CollisionTrigger(
        this,
        VARS.width + 100,
        spawnY,
        this.car.displayWidth,
        this.car.displayHeight,
        `car${getRandomRange(1, 4)}`
      );
      car.direction = direction;
      car.baseVelocity = direction
        ? this.ENEMY_CAR_SPEED_FAST
        : this.ENEMY_CAR_SPEED_SLOW;
      car.baseVelocity += getRandomRange(
        -this.ENEMY_CAR_SPEED_VAR,
        this.ENEMY_CAR_SPEED_VAR
      );
      car.setFlipX(direction);
      car.setForeverTrigger(this.car, () =>
        this.car.takeDamage(this.CAR_DAMAGE)
      );
      this.add.existing(car);
      this.enemyCars.add(car);
    };

    const spawnEndWall = async () => {
      for (let i = 0; i < 10; i++) {
        const wall = new Wall(this, VARS.width + 100, i * 100);
        wall.body.immovable = true;
        this.walls.add(wall);

        wall.disableBody();
      }

      this.wallCollider = new CollisionTrigger(
        this,
        VARS.width + 100,
        VARS.height / 2,
        150,
        VARS.height
      );
      await this.wallCollider.setTrigger(this.car, () => {
        this.carSpeed = 0;
        this.car.controls = false;
        this.car.setVelocityY(0);
        this.car.setHealth(1);
        this.breakSound.play();
        this.player.setHealth(5);
      });
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

    this.cameraSpeed = this.carSpeed * Math.cos(this.car.rotation);
    this.backgroundImg.x -= this.cameraSpeed;
    this.backgroundImg2.x -= this.cameraSpeed;

    if (this.backgroundImg.x <= -this.backgroundImg.width / 2) {
      this.backgroundImg.x += this.backgroundImg.width * 2;
    }
    if (this.backgroundImg2.x <= -this.backgroundImg2.width / 2) {
      this.backgroundImg2.x += this.backgroundImg2.width * 2;
    }

    for (const car of this.enemyCars.getChildren()) {
      car.update();
      let camVel = this.cameraSpeed * this.ENEMY_CAR_SPEED_CHANGE;
      if (car.direction) camVel *= -1;
      car.setVelocityX(-car.baseVelocity - camVel);
    }

    for (const wall of this.walls.getChildren()) {
      wall.x -= this.cameraSpeed;
    }

    if (this.wallCollider) this.wallCollider.x -= this.cameraSpeed;
  }
}
