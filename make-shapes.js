import { getSVGTemplate, initCalculateFPS } from './utils.js';
import { initGradientMan } from './gradienter.js';
import { frameRate } from './frame-rate.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { sleep } = ham;
import svg from 'https://hamilsauce.github.io/hamhelper/modules/svg.js';
const { createSVGElement } = svg;

const calcFPS = initCalculateFPS();
const fpsDisplay = document.querySelector('#fps');

export const animState = {
  isRunning: false,
  
}

export const circleMaker = (svgEl, angleStep = 0.02, tStep = 0.05) => {
  let hueRotate = 0;
  let angle = 0;
  let t = 0;
  let orbitStep = 2;
  let cx = 250;
  let cy = 250;
  let radius = 41;
  let radiusStep = 1;
  let opacityStep = 0.0075;
  let opacity = 0.5;
  let circles = [];
  let circleCounter = 0;
  let rafID = null
  const frameSize = 0
  let frameWindow = 0;
  const svgCanvas = svgEl.closest('svg')
  let opa2 = 99;
  let opa2Step = -1;
  const createCircle = (delta = 0) => {
    frameWindow += delta
    
    if (animState.isRunning && frameWindow > frameSize) {
      frameWindow = 0
      
      angle += angleStep;
      t += tStep;
      hueRotate++
      
      opacityStep = opacity > 0.5 || opacity <= 0.1 ? -opacityStep : opacityStep;
      opacity = opacity + opacityStep;
      radiusStep = radius > 200 || radius <= 40 ? -radiusStep : radiusStep;
      radius = radius + radiusStep;
      
      orbitStep = cx >= 100 || cx <= 50 ? -orbitStep : orbitStep;
      cx = cx + orbitStep;
      cy = cy + orbitStep;
      
      
      if (opa2 >= 100 || opa2 <= 0) {
        opa2Step = -opa2Step
      }
      
      opa2 = opa2 + opa2Step
      // if (circles.length <= 100) {
      const rand = Math.random() * 10
      // const orbitX = cx // + 100 * Math.cos(angle);
      // const orbitY = cy // + 100 * Math.sin(angle);
      const orbitX = cx + 0 * Math.cos(angle);
      const orbitY = cy + 0 * Math.sin(angle);
      
      const circ = getSVGTemplate(svgCanvas, 'basic-circle', {
        style: {
          fill: `hsla(${hueRotate - rand}, 100%, 50%, ${opa2/100})`,
          filter: `opacity(${0.5}) drop-shadow(0 0 5px #00000030)`,
        },
        attrs: {
          transform: `translate(${orbitX},${orbitY}) `,
          r: radius,
        }
      });
      
      svgEl.append(circ)
      circles.push(circ)
      // } 
      if (circles.length >= 125) {
        circles.shift().remove();
      }
    }
  }
  
  return createCircle;
}

export const rectMaker = (svgEl, angleStep = 0.02, tStep = 0.05) => {
  let rafID = null;
  let isRunning = false;
  let hueRotate = 180;
  let angle = 0;
  let t = 0;
  let cx = 150;
  let cy = 150;
  let radius = 41;
  let radiusStep = 0.9;
  let opacityStep = 0.0075;
  let orbitStep = 2;
  
  let borderRadius = 1
  let borderRadiusStep = 0.5
  
  let opacity = 0.6;
  let rects = [];
  let circleCounter = 0;
  let rotoMod = 2
  const svgCanvas = svgEl.closest('svg')
  
  const frameSize = 0
  let frameWindow = 0;
  
  
  const createRect = (delta) => {
    frameWindow += delta
    
    if (animState.isRunning && frameWindow > frameSize) {
      frameWindow = 0
      
      angle -= angleStep;
      t += tStep;
      hueRotate++
      
      opacityStep = opacity > 0.6 || opacity <= 0.1 ? -opacityStep : opacityStep;
      opacity = opacity + opacityStep;
      
      radiusStep = radius > 60 || radius <= 40 ? -radiusStep : radiusStep;
      radius = radius + radiusStep;
      
      rotoMod = rotoMod === 2 ? 6 : 2
      
      borderRadiusStep = borderRadius >= 20 || borderRadius <= 0 ? -borderRadiusStep : borderRadiusStep;
      borderRadius = borderRadius + borderRadiusStep;
      orbitStep = cx >= 250 || cx <= 100 ? -orbitStep : orbitStep;
      
      cx = cx + orbitStep;
      cy = cy + orbitStep;
      
      if (rects.length <= 150) {
        const orbitX = cx + 100 * Math.cos(angle);
        const orbitY = cy + 100 * Math.sin(angle);
        
        const rect = getSVGTemplate(svgCanvas, 'basic-rect', {
          style: {
            fill: `hsla(${hueRotate}, 100%, 50%, ${opacity})`,
            filter: `drop-shadow(0 0 5px #00000030)`,
            rx: borderRadius,
            ry: borderRadius,
          },
          attrs: {
            width: radius,
            height: radius,
            transform: `translate(${orbitX},${orbitY}) rotate(${hueRotate*rotoMod})`,
            rx: borderRadius,
            ry: borderRadius,
            
          }
        });
        
        svgEl.append(rect)
        rects.push(rect)
      } else {
        rects.shift().remove();
      }
      
    }
  }
  
  return createRect
}

const rectMakerGPT = (svgEl, baseAngleStep = 0.02, baseRadius = 80, hueMod, classID = 5) => {
  let angle = Math.random() * Math.PI * 2;
  let radius = baseRadius;
  let radiusDrift = 0.15;
  let angleDrift = (Math.random() - 0.5) * 0.002;
  let hue = Math.random() * 360;
  let opacity = 0.4;
  let cx = 250,
    cy = 250;
  const rects = [];
  let opacityStep = 0.0075;
  
  const frameWindow = 16;
  let frameSize = 0;
  
  return (delta) => {
    frameSize += delta
    if (!animState.isRunning || frameSize <= frameWindow) return;
    frameSize = 0
    // slow evolution of parameters
    console.warn('delta', { delta }, classID)
    
    
    angle += baseAngleStep + angleDrift;
    radius += radiusDrift;
    hue += 0.7;
    
    // occasionally flip radius drift to create spiral in/out
    if (radius > 120 || radius < 20) radiusDrift *= -1;
    
    // compute orbital position
    const orbitX = cx + radius * Math.cos(angle);
    const orbitY = cy + radius * Math.sin(angle);
    
    opacityStep = opacity > 0.4 || opacity <= 0.1 ? -opacityStep : opacityStep;
    opacity = opacity + opacityStep;
    
    if (rects.length <= 100) {
      
      const rect = getSVGTemplate(svgEl.closest('svg'), 'basic-rect', {
        style: {
          fill: `hsla(${hue}, 100%, 50%, ${opacity})`,
          filter: `drop-shadow(0 0 5px #00000030)`,
        },
        attrs: {
          width: radius / 2,
          height: radius / 2,
          transform: `translate(${orbitX},${orbitY}) rotate(${(hue * 2)})`,
        }
      });
      
      svgEl.append(rect);
      rects.push(rect);
    }
    else {
      rects.shift().remove();
      
    }
    // if (rects.length > 150) rects.shift().remove();
  };
};

export const initMakeShapes = (svgEl, angleStep = 0.02, tStep = 0.05) => {
  let circs = [];
  let rects = [];
  let lastTime = 0;
  let makerArrayIndex = 0
  const frameSize = 16
  
  let frameWindow = 0
  const appHeaderLeft = document.querySelector('#app-header-left')
  
  const svgCanvas = svgEl.closest('svg')
  const getGradient = initGradientMan(200)
  
  
  const makeCircles = circleMaker(svgEl)
  const makeRects = rectMaker(svgEl)
  // const makeRectsGPT = rectMakerGPT(svgEl, 0.018, 100)
  
  const gptMakers = [
    // rectMakerGPT(svgEl, 0.003, 90, 0, 1, 3),
    // rectMakerGPT(svgEl, 0.001, 110, 1),
    // rectMakerGPT(svgEl, -0.007, 70, 2),
    // rectMakerGPT(svgEl, 0.039, 140, 3),
  ];
  
  
  
  let startTime = null
  let currentTime = 0
  
  const makeShapes = async (timestamp = 0) => {
    const delta = (timestamp - lastTime);
    lastTime = timestamp;
    frameWindow += delta;
    
    if (animState.isRunning && frameWindow > frameSize) {
      frameWindow = 0;
      
      startTime = startTime === null ? timestamp : startTime;
      currentTime = timestamp
      
      const fps = frameRate(delta)
      appHeaderLeft.textContent = `${Math.round(currentTime - startTime)}`
      fpsDisplay.textContent = `fps: ${fps}`
      
      // console.warn('maker', maker)
      // let maker = gptMakers[makerArrayIndex]
      // console.warn('makerArrayIndex', makerArrayIndex)
      
      // makerArrayIndex = makerArrayIndex >= gptMakers.length - 1 ? 0 : makerArrayIndex + 1;
      // makerArrayIndex = maker ? makerArrayIndex + 1 : 0
      // await sleep(80)
      
      // maker(delta)
      
      // maker = gptMakers[makerArrayIndex]
      // await sleep(100)
      // maker(delta)
      
      makeCircles(delta)
      // makeRects(delta)
      // makeRectsGPT(delta)
      // const makers = [
      // makeRectsGPT(svgEl, 0.15, 40);
      // makeRectsGPT(svgEl, 0.55, 60);
      // await sleep(120)
      // makeRectsGPT(svgEl, 0.9, 100);
      // await sleep(40)
      // ];
      
      
      
      Object.assign(svgCanvas.style, getGradient())
    }
    
    requestAnimationFrame(makeShapes)
  }
  
  return makeShapes;
  
};