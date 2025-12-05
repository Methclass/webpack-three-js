import '../css/global.css';
import '../scss/global.scss';
import '../scss/style.scss';
import initBouncingText from './physics';
import acidText from './acidText';
import initLoader from './loader';


import './three';

document.addEventListener('DOMContentLoaded', () => {});

initLoader();
acidText();
initBouncingText();

window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas');

  if (canvas) {
    new Three(document.querySelector('#canvas'));
  }
});
