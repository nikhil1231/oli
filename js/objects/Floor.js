class Floor extends Bound {
  constructor(scene, y) {
    const height = 100;
    super(scene, VARS.width / 2, y + height / 2, VARS.width, height);
  }
}
