const pause = (ms) => new Promise(r => setTimeout(r, ms));

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
  localStorage.removeItem('is_humbled');
  window.location.reload();
}

const isDebug = () => config.physics.arcade.debug;

const nextNetWorth = (code) => netWorths[parseInt(code) + 1];

const isHumbled = () => localStorage.getItem('is_humbled') || false;

const setHumbled = () => localStorage.setItem('is_humbled', true);

let music = null;
