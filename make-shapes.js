import { getSVGTemplate, initCalculateFPS } from './utils.js';
import { initGradientMan } from './gradienter.js';
import svg from 'https://hamilsauce.github.io/hamhelper/modules/svg.js';
const { createSVGElement } = svg;

const calcFPS = initCalculateFPS();
const fpsDisplay = document.querySelector('#fps');

export const animState = {
  isRunning: false,
}

// console.warn('performance', JSON.stringify(performance.getEntries(), null, 2))
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
  
  let lastTime = 0;
  
  const createCircle = (timestamp = 0) => {
    // if (!animState.isRunning) return;
    const delta = (timestamp - lastTime);
    
    if (animState.isRunning && delta > 48) {
      
      const fps = calcFPS(delta)
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
            // filter: `opacity(${opacity})`,
            filter: `opacity(${opacity}) drop-shadow(0 0 2px #00000025)`,
            
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
  let cx = 150;
  let cy = 150;
  let radius = 41;
  let radiusStep = 0.9;
  let opacityStep = 0.0075;
  let orbitStep = 2;
  
  let opacity = 0.6;
  let circles = [];
  let circleCounter = 0;
  let rotoMod = 2
  const svgCanvas = svgEl.closest('svg')
  let lastTime = 0;
  
  
  const createRect = (timestamp) => {
    
    const delta = (timestamp - lastTime);
    
    if (animState.isRunning && delta > 48) {
      
      console.warn(isRunning)
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
      
      opacityStep = opacity > 0.6 || opacity <= 0.1 ? -opacityStep : opacityStep;
      opacity = opacity + opacityStep;
      radiusStep = radius > 60 || radius <= 40 ? -radiusStep : radiusStep;
      radius = radius + radiusStep;
      
      
      rotoMod = rotoMod === 2 ? 6 : 2
      
      orbitStep = cx >= 250 || cx <= 100 ? -orbitStep : orbitStep;
      cx = cx + orbitStep;
      cy = cy + orbitStep;
      
      
      if (circles.length <= 200) {
        const orbitX = cx + 100 * Math.cos(angle);
        const orbitY = cy + 100 * Math.sin(angle);
        
        const circ = getSVGTemplate(svgCanvas, 'basic-rect', {
          style: {
            stroke: `hsla(${hueRotate*2}, 100%, 50%, ${0.35})`,
            fill: `hsla(${hueRotate}, 100%, 50%, ${opacity})`,
            // filter: `contrast(1.2)`,
            filter: `drop-shadow(0 0 5px #00000030)`,
            
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