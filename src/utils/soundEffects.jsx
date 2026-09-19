import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let correctSound = null;
let wrongSound = null;
let clickSound = null;

export const loadSounds = () => {
  correctSound = new Sound('correct.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('Failed to load correct sound', error);
  });
  wrongSound = new Sound('wrong.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('Failed to load wrong sound', error);
  });
  clickSound = new Sound('click.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('Failed to load click sound', error);
  });
};

export const playCorrect = () => correctSound?.play();
export const playWrong = () => wrongSound?.play();
export const playClick = () => clickSound?.play();

export const releaseSounds = () => {
  correctSound?.release();
  wrongSound?.release();
  clickSound?.release();
};