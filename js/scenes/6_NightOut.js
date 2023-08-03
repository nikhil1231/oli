class NightOutScene extends BaseScene {
  static SCENE_CODE = "5";

  FLOOR_Y = 650;
  PLAYER_SPEED = 500;

  constructor() {
    super(NightOutScene.SCENE_CODE, "kensington_flat");
  }

  preload() {
    super.preload();

    this.load.image("road", "img/backgrounds/road.png");

    this.load.image("aman", "img/character/face/aman_uni.png");
    this.load.image("dylan", "img/character/face/dylan.png");
    this.load.image("nikhil", "img/character/face/nikhil_uni.png");
    this.load.image("nikhil_sick", "img/character/face/nikhil_uni_sick.png");
    this.load.image("oli", "img/character/face/oli_uni.png");
    this.load.image("oli_sad", "img/character/face/oli_uni_sad.png");

    this.load.audio("glug", "audio/glug.wav");
  }

  create() {
    super.create();
    this.player = new Player(this, 100, this.FLOOR_Y - 200, 2, false);
    this.player.grounded = true;
    this.player.immobile = true;
    this.player.setHeadTexture("oli_sad");
    this.actors.add(this.player);

    this.glugSound = this.sound.add("glug");

    this.runScript();
  }

  async runScript() {
    const introScript = async () => {
      this.aman = new Enemy(
        this,
        100,
        VARS.width - 100,
        this.FLOOR_Y - 200,
        "aman",
        5
      );
      this.nikhil = new Enemy(
        this,
        100,
        VARS.width - 400,
        this.FLOOR_Y - 200,
        "nikhil",
        3
      );
      this.dylan = new Enemy(this, 200, -100, this.FLOOR_Y - 200, "dylan", 3);

      this.aman.enableGravity();
      this.nikhil.enableGravity();
      this.dylan.enableGravity();

      this.actors.add(this.aman);
      this.actors.add(this.nikhil);
      this.actors.add(this.dylan);

      this.platforms.add(new Floor(this, this.FLOOR_Y));
      this.player.enableGravity();

      this.setFade(1);

      await pause();

      await this.player.say(["Ugh..", "I feel terrible.."])
      await this.narrator.say(['You feel your brain getting heavy, your thoughts getting slow.'])
      await this.player.say(["Yeah okay, no need to explain it, I can feel it."])
      await this.narrator.say(['It appears the constant warping is taking its toll.'])
      await this.player.say(["But I can't even control it?!", "Tell what the fuck is happening right now?!"])
      await this.narrator.say(['...'])
      await this.player.say(["Fucks sake."]);

      await pause();

      await this.nikhil.say(["Oli?"]);

      await pause();

      await this.narrator.say([
        "You look down at the phone in your hand, and immediately recognise the bold white text and bright block colours.",
      ]);
      await this.player.say(["..oh shit, it's Picolo."]);
      await this.narrator.say([
        "The sense of familiarity washes over you.",
        "You suddenly feel like yourself again.",
      ]);

      this.player.setHeadTexture("oli");

      await pause(1000);
      this.fadeIn();
      await this.swirlIn();

      await this.aman.say(["Mate, are you alright?"]);
      await this.player.say(["Yeah... I'm fine."]);
      await pause();

      await this.player.say([
        "Wait, is this my Dad's flat?",
        "It's so badly drawn I could barely even recognise it.",
      ]);
      await pause(1000);

      const numDrinks = await this.nikhil.ask(
        "So, how many sips was it again?",
        ["1 sip", "2 sips", "4 sips", "Down your drink"]
      );

      const nikhilDrunk = numDrinks == 3;

      if (numDrinks < 3) {
        let nikhilResponse = "";
        switch (numDrinks) {
          case 0:
            nikhilResponse = "Oh nice, that's not that bad.";
            break;
          case 1:
            nikhilResponse = "Ugh, fuck, fiiiine.";
            break;
          case 2:
            nikhilResponse = "Oh for fucks sake, this is so strong as well.";
            break;
        }
        await this.nikhil.say([nikhilResponse]);
      } else {
        await this.nikhil.say(["Nooooo, Oli please I literally just made this drink, it's basically 50/50."]);
        const res = await this.nikhil.ask(
          "Please, have mercyyyyy...",
          ["Alright fine..", "Down it you bitch."],
          [0, 200]
        );

        if (res == 0) {
          await this.nikhil.say([
            "Ah thank fuck.. I definitely would've thrown up from that.",
          ]);
        } else {
          await this.nikhil.say(["Fuuuuuuuccckkkkk...."]);
          await pause(1000);
          this.glugSound.play();
          await pause(4000);
      this.nikhil.setHeadTexture("nikhil_sick");
          await this.nikhil.say([
            "Therre,,. aer you hapypy noww?/?",
            "...hic...",
          ]);
        }
      }

      await this.aman.say(["Alright c'mon, we should look to leave soon or we'll miss last entry."])
      await this.player.say(["Relax, we're not going to miss last entry, they always let you in at..."])

      await pause()
      await this.player.say(["Wait, where are we going again?"])

      await this.aman.say([
        "Mate we already decided this yesterday, we're going to [REDACTED].",
      ]);

      await pause();

      this.player.setHeadTexture("oli_sad");

      await this.player.say(["?!?", "Wait what did you say?"]);

      await this.aman.say(["Oli, you are fucked."]);

      await this.nikhil.say([
        nikhilDrunk
          ? "hee saidd ..hic.. [REDACTED], we werre talkingg abooutittt."
          : "He said [REDACTED], we were talking about it the other day.",
      ]);

      await this.player.say([
        nikhilDrunk
          ? "Alright, first off, Nikhil is clearly the one that's fucked.."
          : "Alright, first off, I'm not even drunk..",
        "..and second, why are you talking so weirdly when you mention the place we're going??",
      ]);

      await this.aman.say([
        "Mate I don't know what you're on about.",
        "I'm calling the uber.",
      ]);

      await pause();

      if (nikhilDrunk) {
        for (let i = this.nikhil.x; i > 200; i -= 100) {
          await this.nikhil.moveToX(i);
          await pause(500);
        }

        await this.nikhil.say(["I'm gonna be sick.."]);

        await this.nikhil.moveToX(-100);

        await this.player.say(["Well fuck."]);

        await this.aman.say([
          "Fucks sake man, when is he going to learn how to handle his drink?",
        ]);

        this.nikhil.setHeadTexture("nikhil");
        await this.nikhil.moveToX(VARS.width - 400);
        await this.nikhil.say(["Alright I'm good."]);

        await this.player.say(["Wow, that was an impressive recovery time."]);
      }

      this.laugh3Sound.play();

      await pause();

      await this.player.say(["What the fuck was that?"]);

      for (const actor of [this.player, this.nikhil, this.aman]) {
        await this.dylan.moveToX(actor.x, 500);
        await pause(200);
        actor.takeDamage(90);
      }
      this.laugh3Sound.play();
      await this.dylan.moveToX(VARS.width + 100, 500);

      await this.player.say(["OWWW FUCK, MY BALLS."]);

      await this.aman.say(["FUUUUCK, fuck that guy."]);

      await this.nikhil.say([
        nikhilDrunk
          ? "Ughhghgh I'm gonna throw up again.."
          : "AAOHOAHOAHOHOHAO",
      ]);

      await pause(1000);

      await this.aman.say(["Alright Uber's here, let's go."]);

      this.aman.moveToX(VARS.width + 100)
      await this.nikhil.moveToX(VARS.width + 100)

      this.player.setImmobile(false)
      await this.initNextLevelTrigger();
    };

    switch (getSectionSave()) {
      case "0":
        await introScript();
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
