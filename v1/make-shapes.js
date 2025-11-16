import { getSVGTemplate } from './utils.js';
import { initBlur } from '../utils/blur.js';
import { blendModeKeyWords, BlendMode } from '../blend-modes.js';
import { initGradientMan } from './gradienter.js';
import svg from 'https://hamilsauce.github.io/hamhelper/modules/svg.js';
import { frameRate } from '../utils/frame-rate.js';
const { createSVGElement } = svg;

const fpsDisplay = document.querySelector('#fps');

export const animState = {
  isRunning: false,
}

export const circleMaker = (svgEl, angleStep = 0.02, tStep = 0.05, timestamp) => {
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
  const getBlur = initBlur({
    direction: 'forward',
    min: 0,
    max: 30,
    initial: 0,
  });
  
  let lastTime = 0;
  
  const createCircle = (timestamp = 0) => {
    // if (!animState.isRunning) return;
    const delta = (timestamp - lastTime);
    
    if (animState.isRunning && delta > 16) {
      
      const fps = frameRate(delta)
      fpsDisplay.textContent = fps
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
      
      if (circles.length <= 200) {
        const rand = Math.random() * 10
        
        
        
        const orbitX = cx + 100 * Math.cos(angle);
        const orbitY = cy + 100 * Math.sin(angle);
        const { background, transform } = getGradient()
        
        
        svgCanvas.style.background = background
        
        
        
        const circ = getSVGTemplate(svgCanvas, 'basic-circle', {
          style: {
            stroke: `hsla(${hueRotate * 2}, 100%, 75%, ${0.4})`,
            fill: `hsla(${hueRotate - rand}, 100%, 50%, ${opacity})`,
            // fill: background,
            transform,
            filter: `opacity(${opacity})`,
            filter: `blur(${getBlur(delta)}px) opacity(${opacity}) drop-shadow(0 0 2px #00000025)`,
            
          },
          attrs: {
            transform: `translate(${orbitX},${orbitY}) `,
            r: radius,
          }
        });
        
        svgEl.append(circ)
        circles.push(circ)
        
      } else if (circles.length >= 200) {
        
        circles.shift().remove();
        
      }
      
      lastTime = timestamp;
    }
    
    svgCanvas.style.filter = `hue-rotate(${hueRotate-hueRotate-1}deg)`
    rafID = requestAnimationFrame(createCircle);
    
  }
  return createCircle
  // return () => {
  //   rafID=null
  //   // cancelAnimationFrame(rafID)
  // };
}

export const rectMaker = (svgEl, angleStep = 0.02, tStep = 0.05, timestamp) => {
  let rafID = null;
  let isRunning = false;
  let hueRotate = 180;
  let angle = 0;
  let t = 0;
  let cx = 75;
  let cy = 75;
  let radius = 41;
  let radiusStep = 0.9;
  let opacityStep = 0.0075;
  let orbitStep = 2;
  let invert = 0
  let opacity = 0.6;
  let circles = [];
  let circleCounter = 0;
  let rotoMod = 2
  const svgCanvas = svgEl.closest('svg')
  let lastTime = 0;
  let blendModes = [BlendMode.overlay, BlendMode.multiply, BlendMode.softLight]
  let bmIndex = 0
  let blendMode = blendModes[bmIndex]
  
  const getBlur = initBlur({
    direction: 'forward',
    min: -10,
    max: 16,
    initial: 9,
    increment: 1.5,
  });
  
  
  const createRect = (timestamp) => {
    
    const delta = (timestamp - lastTime);
    
    if (animState.isRunning && delta > 16) {
      
      // console.warn(isRunning)
      // if (!isRunning) return
      
      // const fps = calcFPS(timestamp)
      // console.warn('fps', fps)
      // fpsDisplay.textContent = fps
      angle -= angleStep;
      t += tStep;
      hueRotate++
      // opacity = opacity >= 1 ? 0 : opacity + 0.001
      // opacity = opacity <= 0 ? 0.8 : opacity - 0.005
      
      
      // if (radius > 80 || radius <= 40) {
      //   radiusStep = -radiusStep
      // }
      
      // radius = radius + radiusStep;
      // radius = radius > 90 ? radiusStep : radius + radiusStep;
      
      opacityStep = opacity > 0.4 || opacity <= 0.2 ? -opacityStep : opacityStep;
      opacity = opacity + opacityStep;
      radiusStep = radius > 150 || radius <= 10 ? -radiusStep : radiusStep;
      
      if (radius > 150 || radius <= 10) {
        bmIndex = bmIndex > blendModes.length ? 0 : bmIndex + 1;
        blendMode = blendModes[bmIndex]
        invert = invert === 0 ? 1 : 0
      }
      radius = radius + radiusStep;
      
      
      // blendMode = radiusStep > 0 ? BlendMode.overlay : BlendMode.multiply
      
      
      
      rotoMod = rotoMod === 2 ? 6 : 2
      
      orbitStep = cx >= 150 || cx <= 50 ? -orbitStep : orbitStep;
      // invert = cx >= 150 || cx <= 50 ? 1 : 0;
      cx = cx + orbitStep;
      cy = cy + orbitStep;
      
      if (circles.length <= 50) {
        const orbitX = cx + 50 * Math.cos(angle);
        const orbitY = cy + 50 * Math.sin(angle);
        // console.warn('opacity', opacity)
        const circ = getSVGTemplate(svgCanvas, 'basic-rect', {
          style: {
            stroke: `hsla(${-hueRotate*2}, 100%, 50%, ${0.35})`,
            fill: `hsla(${hueRotate}, 100%, 50%, ${opacity})`,
            // filter: `contrast(1.2)`,
            filter: `blur(${getBlur(delta)}px) drop-shadow(0 0 5px #00000030) invert(${invert}) opacity(${opacity})`,
            // 'mix-blend-mode': 'lighten',
            'mix-blend-mode': blendMode,
            // 'mix-blend-mode': 'soft-light',
            // isolation: 'isolate',
          },
          attrs: {
            width: radius,
            height: radius,
            transform: `translate(${orbitX},${orbitY}) rotate(${hueRotate*rotoMod})`,
            // r: radius,
          }
        });
        
        // circ.setAttribute('cx', orbitX);
        // circ.setAttribute('cy', orbitY);
        // circ.setAttribute('transform', `translate(${orbitX},${orbitY})`);
        // svgCanvas.append(circ)
        svgEl.append(circ)
        circles.push(circ)
        
      } else {
        
        circles.shift().remove();
        
      }
      lastTime = timestamp;
      
    }
    
    // if (isRunning) {
    rafID = requestAnimationFrame(createRect);
    
    // } else {
    //   cancelAnimationFrame(rafID)
    //   rafID = null;
    // }
  }
  
  return {
    // start: createRect,
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
        
        // isRunning = false // !isRunning
        cancelAnimationFrame(rafID)
        rafID = null;
        
      }
    },
    isRunning,
  };
}