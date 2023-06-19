class Player extends Actor {
  static hp = 100;
  static maxHp = Player.hp;
  fireRate = 100;
  dmg = 20;
  someoneTalking = false;
  immobile = false;

  constructor(scene, x, y, healthBarVisible=true) {
    super(
      scene,
      Player.hp,
      x,
      y,
      0.4,
      "oli1",
      "body_default",
      "bullet",
      healthBarVisible,
      true
    );

    this.cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.pointer = scene.input.activePointer;

    this.resetControls();

    scene.physics.add.overlap(this, scene.powerups, (player, powerup) => {
      this.heal(powerup.amount);
      powerup.destroy();
    });
  }

  update() {
    super.update();
    if (this.immobile) return;

    const both =
      (this.controls[0].isDown || this.controls[2].isDown) &&
      (this.controls[3].isDown || this.controls[1].isDown);
    this.direction = [
      this.controls[3].isDown - this.controls[1].isDown,
      this.controls[0].isDown - this.controls[2].isDown,
    ];

    const speed =
      this.someoneTalking || this.immobile
        ? 0
        : both
        ? VARS.playerSpeed / Math.sqrt(2)
        : VARS.playerSpeed;

    this.setVelocityX(
      this.controls[1].isDown * speed - this.controls[3].isDown * speed
    );
    this.setVelocityY(
      this.controls[2].isDown * speed - this.controls[0].isDown * speed
    );

    // Make player face mouse
    if (!this.lockFlip) {
      this.setFlipX(this.pointer.x < this.x);
    }
  }

  resetControls() {
    this.controls = [
      this.cursors.up,
      this.cursors.right,
      this.cursors.down,
      this.cursors.left,
    ];
  }

  setImmobile(im) {
    this.setVelocity(0);
    this.immobile = im;
  }

  async setControlRotation(rot) {
    this.resetControls();
    for (let i = 0; i < rot; i++) {
      this.controls.unshift(this.controls.pop());
    }
    this.immobile = true;
    this.setVelocity(0);
    await new Promise(async (res) => {
      let R = (rot * Math.PI) / 2;
      if (R > Math.PI) {
        R -= Math.PI * 2;
      }
      const dr = (R - this.rotation) / 60;
      while (Math.abs(R - this.rotation) > 0.1) {
        this.setRotation(this.rotation + dr);
        await pause(20);
      }
      this.setRotation(R);
      res();
    });
    this.immobile = false;
  }

  heal(amt) {
    this.hp += amt;
    this.hp = Math.min(this.hp, Player.maxHp);
    this.healthBar.setValue(this.hp);
    this.scene.healSound.play();
  }

  async die() {
    super.die();
    this.scene.oofNoise.play();

    await pause(500);
    window.location.reload();
  }
}
