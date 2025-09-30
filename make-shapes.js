import { getSVGTemplate, initCalculateFPS } from './utils.js';
import { initGradientMan } from './gradienter.js';
import { frameRate } from './frame-rate.js';
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
  const svgCanvas = svgEl.closest('svg')
  const getGradient = initGradientMan(200)
  
  let lastTime = 0;
  
  const createCircle = (timestamp = 0) => {
    const delta = (timestamp - lastTime);
    
    if (animState.isRunning && delta > 24) {
      
      lastTime = timestamp;
      const fps = frameRate(delta)
      fpsDisplay.textContent = `fps: ${fps}`
      angle += angleStep;
      t += tStep;
      hueRotate++
      
      opacityStep = opacity > 0.6 || opacity <= 0.1 ? -opacityStep : opacityStep;
      opacity = opacity + opacityStep;
      radiusStep = radius > 80 || radius <= 40 ? -radiusStep : radiusStep;
      radius = radius + radiusStep;
      
      orbitStep = cx >= 250 || cx <= 100 ? -orbitStep : orbitStep;
      cx = cx + orbitStep;
      cy = cy + orbitStep;
      
      if (circles.length <= 150) {
        const rand = Math.random() * 10
        const orbitX = cx + 100 * Math.cos(angle);
        const orbitY = cy + 100 * Math.sin(angle);
        const { background, transform } = getGradient()
        
        // svgCanvas.style.background = background
        
        const circ = getSVGTemplate(svgCanvas, 'basic-circle', {
          style: {
            fill: `hsla(${hueRotate - rand}, 100%, 50%, ${opacity})`,
            transform,
            filter: `opacity(${opacity}) drop-shadow(0 0 2px #00000025)`,
          },
          attrs: {
            transform: `translate(${orbitX},${orbitY}) `,
            r: radius,
          }
        });
        
        svgEl.append(circ)
        circles.push(circ)
      } else if (circles.length >= 150) {
        circles.shift().remove();
      }
    }
    
    // svgCanvas.style.filter = `hue-rotate(${hueRotate-hueRotate-1}deg)`
    // rafID = requestAnimationFrame(createCircle);
    
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
  let lastTime = 0;
  
  
  const createRect = (timestamp) => {
    const delta = (timestamp - lastTime);
    
    if (animState.isRunning && delta > 24) {
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
            // transform: `translate(${orbitX},${orbitY}) rotate(${hueRotate*rotoMod})`,
            rx: borderRadius,
            ry: borderRadius,
            
          }
        });
        
        svgEl.append(rect)
        rects.push(rect)
      } else {
        rects.shift().remove();
      }
      
      lastTime = timestamp;
    }
    
    // rafID = requestAnimationFrame(createRect);
  }
  
  return createRect
  
  return {
    start() {
      isRunning = true
      console.warn('rafID', rafID)
      if (rafID == null) {
        // createRect(0);
        rafID = requestAnimationFrame(createRect);
      }
    },
    stop() {
      if (rafID !== null) {
        cancelAnimationFrame(rafID)
        rafID = null;
      }
    },
    isRunning,
  };
}

export const initMakeShapes = (svgEl, angleStep = 0.02, tStep = 0.05) => {
  let circs = [];
  let rects = [];
  let lastTime = 0;
  
  const makeCircles = circleMaker(svgEl)
  const makeRects = rectMaker(svgEl)
  
  const makeShapes = (timestamp = 0) => {
    
    makeCircles(timestamp)
    makeRects(timestamp)
    
    requestAnimationFrame(makeShapes)
    
  }
  
  return makeShapes
  
};