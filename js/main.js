const VARS = {
  width: 1200,
  height: 700,
  playerSpawnX: 100,
  playerSpawnY: 300,
  playerSpeed: 300,
  bulletSpeed: 300,
  bulletDmg: 2,
  scale: 0.4,
  gravity: 1000,
};

const config = {
  type: Phaser.AUTO,
  width: VARS.width,
  height: VARS.height,
  skipSpeech: false,
  backgroundColor: 0x000000,
  scene: [
    IntroScene,
    BasildonScene,
    FootballScene,
    ShooterScene,
    NightOutScene,
    DrivingScene,
    PIScene,
    AcidScene,
    SamScene,
    ForestScene,
    PaulScene,
    EndScene,
    CreditsScene,
  ].slice(getLevelSave()),
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
game.input.mouse.capture = true;
