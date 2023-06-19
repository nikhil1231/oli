const VARS = {
  width: 1200,
  height: 700,
  playerSpawnX: 100,
  playerSpawnY: 300,
  playerSpeed: 300,
  bulletSpeed: 300,
  bulletDmg: 2,
}

const config = {
  type: Phaser.AUTO,
  width: VARS.width,
  height: VARS.height,
  skipSpeech: false,
  backgroundColor: 0x000000,
  scene: [
    IntroScene
  ].slice(getLevelSave()),
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  }
};

const game = new Phaser.Game(config);
game.input.mouse.capture = true;
