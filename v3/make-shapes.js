import { getSVGTemplate, initCalculateFPS } from './utils.js';
import { initGradientMan } from './gradienter.js';
import { frameRate } from './frame-rate.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { sleep } = ham;
import svg from 'https://hamilsauce.github.io/hamhelper/modules/svg.js';
const { createSVGElement } = svg;

const calcFPS = initCalculateFPS();
const fpsDisplay = document.querySelector('#fps');

const effectMode = {
  regular: 'regular',
  transparent: 'transparent',
  alternate: 'alternate',
  invert: 'invert',
}

const blendMode = {
  saturation: 'saturation',
  multiply: 'multiply',
  'soft-light': 'soft-light',
}

export const animState = {
  isRunning: false,
  effectMode: effectMode.regular,
  blendMode: blendMode.saturation,
  fillEffect: 0.8,
  invert: 0,
  activeShapes: {
    circle: true,
    rect: true,
  },
  background: {
    filter: true,
    gradient: true,
    defaultFill: '#222222',
  },
}

const renderedShapes = {
  circle: [],
  rect: [],
}

export const circleMaker = (svgEl, angleStep = 0.02, tStep = 0.05) => {
  let hueRotate = 0;
  let angle = 0;
  let t = 0;
  let orbitStep = 2;
  let cx = 200;
  let cy = 200;
  let radius = 51;
  let radiusStep = 1;
  let opacityStep = 0.0075;
  let opacity = 0.5;
  let circles = [];
  let circleCounter = 0;
  let rafID = null
  const svgCanvas = svgEl.closest('svg')
  let opa2 = 50;
  let opaNeg = 1;
  let opa2Step = -2;
  let invert = 0
  const frameSize = 0
  let frameWindow = 0;
  
  
  const createCircle = (delta = 0) => {
    frameWindow += delta
    
    if (animState.isRunning && frameWindow > frameSize) {
      frameWindow = 0
      
      angle += angleStep;
      t += tStep;
      hueRotate++
      
      opacityStep = opacity > 0.8 || opacity <= 0.1 ? -opacityStep : opacityStep;
      opacity = opacity + opacityStep;
      radiusStep = radius > 200 || radius <= 25 ? -radiusStep : radiusStep;
      radius = radius + radiusStep;
      
      orbitStep = cx >= 100 || cx <= 50 ? -orbitStep : orbitStep;
      cx = cx + orbitStep;
      cy = cy + orbitStep;
      
      
      if (opa2 >= 80 || opa2 <= 20) {
        opa2Step = -opa2Step
      }
      
      opa2 = opa2 + opa2Step;
      opaNeg = opaNeg + opa2Step;
      
      let fillEffect
      let contrast
      
      
      switch (animState.fillEffect) {
        case 'regular':
          fillEffect = opa2 / 100;
          break;
        case 'transparent': {
          fillEffect = opa2 / 10000;
          contrast = 5
        }
        break;
        case 'alternate':
          fillEffect = opaNeg / 100;
          break;
          
        default:
          fillEffect = opa2 / 100;
      }
      
      let invert = animState.invert
      
      const rand = Math.random() * 10
      const orbitX = cx + 50 * Math.cos(angle);
      const orbitY = cy + 50 * Math.sin(angle);
      const circ = getSVGTemplate(svgCanvas, 'basic-circle', {
        style: {
          fill: `hsla(${hueRotate - rand}, 100%, 50%, ${fillEffect})`,
          filter: `invert(${invert}) opacity(${opa2/1}) drop-shadow(0 0 5px #00000020)`,
          'mix-blend-mode': animState.blendMode,
        isolation: 'isolate',

          // 'mix-blend-mode': 'saturation',
          // 'mix-blend-mode': 'difference',
          // 'mix-blend-mode': 'luminosity',
        },
        attrs: {
          transform: `translate(${orbitX},${orbitY}) rotate(${hueRotate+2})`,
          r: radius,
        }
      });
      
      svgEl.append(circ)
      renderedShapes.circle.push(circ)
      if (renderedShapes.circle.length >= 105) {
        renderedShapes.circle.shift().remove();
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
  let cx = 200;
  let cy = 250;
  let radius = 41;
  let radiusStep = 0.9;
  let opacityStep = 0.0075;
  let orbitStep = 2;
  
  let borderRadius = 1
  let borderRadiusStep = 0.5
  
  let opacity = 0.6;
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
      
      radiusStep = radius > 180 || radius <= 12 ? -radiusStep : radiusStep;
      radius = radius + radiusStep;
      
      rotoMod = rotoMod === 2 ? 6 : 2
      
      borderRadiusStep = borderRadius >= 20 || borderRadius <= 0 ? -borderRadiusStep : borderRadiusStep;
      borderRadius = borderRadius + borderRadiusStep;
      orbitStep = cx >= 50 || cx <= 2 ? -orbitStep : orbitStep;
      
      cx = cx + orbitStep;
      cy = cy + orbitStep;
      
      if (renderedShapes.rect.length <= 20) {
        const orbitX = cx + 100 * Math.cos(angle);
        const orbitY = cy + 100 * Math.sin(angle);
        
        const rect = getSVGTemplate(svgCanvas, 'basic-rect', {
          style: {
            fill: `hsla(${hueRotate}, 100%, 50%, ${opacity/2})`,
            filter: `drop-shadow(0 0 5px #00000030)`,
            // 'mix-blend-mode': 'overlay',
            // 'mix-blend-mode': 'darken',
            'mix-blend-mode': 'color',
            isolation: 'isolate',
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
        renderedShapes.rect.push(rect)
      } else {
        renderedShapes.rect.shift().remove();
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
    
    
    angle += baseAngleStep + angleDrift;
    radius += radiusDrift;
    hue += 0.7;
    
    if (radius > 120 || radius < 20) radiusDrift *= -1;
    
    const orbitX = cx + radius * Math.cos(angle);
    const orbitY = cy + radius * Math.sin(angle);
    
    opacityStep = opacity > 0.4 || opacity <= 0.1 ? -opacityStep : opacityStep;
    opacity = opacity + opacityStep;
    
    if (rects.length <= 5) {
      
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
  };
};

export const initMakeShapes = (svgEl, angleStep = 0.02, tStep = 0.05) => {
  let circs = [];
  let rects = [];
  let lastTime = 0;
  let makerArrayIndex = 0
  const frameSize = 24
  
  let frameWindow = 0
  
  const svgCanvas = svgEl.closest('svg')
  const getGradient = initGradientMan(64)
  
  
  const makeCircles1 = circleMaker(svgEl);
  const makeCircles2 = circleMaker(svgEl);
  const makeCircles3 = circleMaker(svgEl);
  const makeCircles4 = circleMaker(svgEl);
  const makeRects = rectMaker(svgEl);
  // const makeRectsGPT = rectMakerGPT(svgEl, 0.018, 100)
  
  const gptMakers = [
    // rectMakerGPT(svgEl, 0.003, 90, 0, 1, 3),
    // rectMakerGPT(svgEl, 0.001, 110, 1),
    // rectMakerGPT(svgEl, -0.007, 70, 2),
    // rectMakerGPT(svgEl, 0.039, 140, 3),
  ];
  
  let startTime = null;
  let animWindowStart = null;
  let currentTime = 0;
  
  const makeShapes = async (timestamp = 0) => {
    const delta = (timestamp - lastTime);
    lastTime = timestamp;
    frameWindow += delta;
    
    if (animState.isRunning && frameWindow > frameSize) {
      frameWindow = 0;
      
      animWindowStart = animWindowStart ? animWindowStart : timestamp
      currentTime = timestamp;
      
      const fps = frameRate(delta)
      fpsDisplay.textContent = `fps: ${fps}`;
      
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
      if (animState.activeShapes.circle) {
        // makeCircles1(delta);
        if (currentTime - animWindowStart > 20) {
          makeCircles1(delta);
        }
        if (currentTime - animWindowStart > 50) {
          makeCircles2(delta);
        }
        if (currentTime - animWindowStart > 74) {
          makeCircles3(delta);
        }
        if (currentTime - animWindowStart > 125) {
          // makeCircles4(delta);
          animWindowStart = currentTime
        }
      }
      else if (renderedShapes.circle.length) {
        renderedShapes.circle.shift().remove()
      }
      
      if (animState.activeShapes.rect) {
        makeRects(delta);
      } else if (renderedShapes.rect.length) {
        renderedShapes.rect.shift().remove()
      }
      
      const { filter: shouldFilter, gradient } = animState.background
      
      const { background, filter, flip } = getGradient()
      
      svgCanvas.style.background = gradient ? background : animState.background.defaultFill;
      svgCanvas.style.filter = shouldFilter ? filter : null;
      // svgCanvas.style.flip = flip
      // Object.assign(svgCanvas.style, getGradient());
    }
    
    requestAnimationFrame(makeShapes);
  }
  
  return makeShapes;
};