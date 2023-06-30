class Actor extends Thing {
  GRAVITY = 1500;
  jumpHeight = 800;
  dmg = 5;

  constructor(
    scene,
    hp,
    x,
    y,
    headImg,
    voice = "default_voice",
    neckOffset = 0,
    bodyImg = null,
    bulletImg = "bullet",
    healthBarVisible = false,
    isPlayer = false,
    scale = VARS.scale
  ) {
    super(scene, hp, x, y, null, isPlayer);
    this.bulletImg = bulletImg;
    this.isPlayer = isPlayer;
    this.isAlive = true;
    this.invincible = false;

    this.setScale(scale);
    this.setCollideWorldBounds(isPlayer);

    this.actorBody = new ActorBody(scene, this.x, this.y, bodyImg, scale);
    this.actorHead = new ActorHead(
      scene,
      this.x,
      this.y,
      headImg,
      scale,
      neckOffset
    );

    // SETTING BOUNDS
    this.setSize(this.actorHead.width * 0.8, 350);
    this.setOffset(
      -this.actorHead.width / 2 + 40,
      -this.actorHead.height / 2 + 30
    );

    // SPEECH
    const speechVoice = this.scene.sound.add(voice);
    this.speech = new Speech(scene, headImg, speechVoice);
  }

  update() {
    super.update();
    this.actorHead.setPosition(this.x, this.y);
    this.actorBody.setPosition(this.x, this.y);
    if (this.gun) this.gun.update(this.x, this.y, this.flipX);

    this.actorHead.setFlipX(this.flipX);
    this.actorBody.setFlipX(this.flipX);

    this.speech.update();
  }

  async say(speech) {
    await this.speech.say(speech);
  }

  async ask(question, answers, spacing) {
    return await this.speech.ask(question, answers, spacing);
  }

  enableGun() {
    this.gun = new Gun(this.scene, this.x, this.y, this.isPlayer);
  }

  disableGun() {
    this.gun.destroy();
    this.gun = null;
  }

  setHeadTexture(img) {
    this.actorHead.setTexture(img);
    this.speech.img.setTexture(img);
  }
}
