class Actor extends Thing {
  GRAVITY = 1500;
  jumpHeight = 800;
  dmg = 500;

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
    this.bulletImg = isPlayer ? "bullet" : "bullet_red";
    this.isPlayer = isPlayer;
    this.isAlive = true;
    this.invincible = false;

    this.actorBody = new ActorBody(scene, this.x, this.y, bodyImg, scale);
    this.actorHead = new ActorHead(
      scene,
      this.x,
      this.y,
      headImg,
      scale,
      neckOffset
    );

    this.setScale(scale);
    this.setCollideWorldBounds(isPlayer);

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
    if (this.actorBody) {
      this.actorBody.setPosition(this.x, this.y);
      this.actorBody.setFlipX(this.flipX);
    }
    if (this.gun) this.gun.update(this.x, this.y, this.flipX);

    this.actorHead.setFlipX(this.flipX);

    this.speech.update();
  }

  shoot(x, y, dmg = this.dmg) {
    new Bullet(this.scene, this.x, this.y, x, y, this.bulletImg, dmg);
  }

  async say(speech) {
    await this.speech.say(speech);
  }

  async ask(question, answers, spacing) {
    return await this.speech.ask(question, answers, spacing);
  }

  setScale(scale) {
    super.setScale(scale);
    this.actorHead.setScale(scale);
  }

  setAlpha(a) {
    super.setAlpha(a);
    this.actorHead.setAlpha(a);
    this.actorBody.setAlpha(a);
    if (this.gun) this.gun.setAlpha(a);
  }

  disableActorBody() {
    this.actorBody.destroy();
    this.actorBody = null;
    this.setSize(
      this.actorHead.displayWidth * 2,
      this.actorHead.displayHeight * 2
    );
  }

  enableGun() {
    this.gun = new Gun(
      this.scene,
      this.x,
      this.y,
      this.isPlayer,
      this.bulletImg
    );
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
