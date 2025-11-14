import { opacityLFO, runModulation } from '../effects/modulators.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, getPanZoom } = ham;

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const svgCanvas = document.querySelector('#svg-canvas')

getPanZoom(svgCanvas);