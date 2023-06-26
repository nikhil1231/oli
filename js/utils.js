const pause = (ms=2000) => new Promise(r => setTimeout(r, config.skipSpeech ? 0 : ms));

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const getRandomRange = (min, max) => min + getRandomInt(max - min)

const getRandomChance = (perc) => Math.random() < perc

const getRandomBool = () => getRandomChance(0.5)

const getRandomChoice = (arr) => arr[getRandomInt(arr.length)]

const getLevelSave = () => localStorage.getItem('level') || 0;

const setLevelSave = level => {
    localStorage.setItem('level', level);
    localStorage.removeItem('section');
}

const getSectionSave = () => localStorage.getItem('section') || '0';

const setSectionSave = section => localStorage.setItem('section', section);

const resetProgress = () => {
  localStorage.removeItem('level');
  localStorage.removeItem('section');
  window.location.reload();
}

const isDebug = () => config.physics.arcade.debug;

let music = null;
