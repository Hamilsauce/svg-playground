import { circleMaker, rectMaker, animState, initMakeShapes } from './make-shapes.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, getPanZoom } = ham;


const svg = document.getElementById("demo");
const viewport = document.getElementById("viewport");
const circleOrbit = document.getElementById("circleOrbit");
const circleOsc = document.getElementById("circleOsc");
const radialGroup = document.getElementById("radialGroup");
const shapeContainer = document.getElementById("shape-container");
const arrow = document.getElementById("arrow");
const wavePath = document.getElementById("wavePath");
const compositeDot = document.getElementById("compositeDot");
const compositePath = document.getElementById("compositePath");

getPanZoom(svg)
const makeShapes = initMakeShapes(shapeContainer)
const makecircles = circleMaker(shapeContainer)
const makeRects = rectMaker(shapeContainer)

const cx = 250,
  cy = 250;
let angle = 0;
let t = 0;
let compositeMode = false;
let showWave = false;

// --- Radial layout (Polar to Cartesian)
const radius = 150;
// for (let i = 0; i < 16; i++) {
//   const a = (i / 16) * 2 * Math.PI;
//   const x = cx + radius * Math.cos(a);
//   const y = cy + radius * Math.sin(a);
//   const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//   dot.setAttribute("cx", x);
//   dot.setAttribute("cy", y);
//   dot.setAttribute("r", 4);
//   radialGroup.appendChild(dot);
// }

// console.warn('ns', SVGSVGElem)


function animate() {
  angle += 0.02;
  t += 0.05;
  
  // --- Circular motion (Orbit)
  const orbitX = cx + 100 * Math.cos(angle);
  const orbitY = cy + 100 * Math.sin(angle);
  circleOrbit.setAttribute("cx", orbitX);
  circleOrbit.setAttribute("cy", orbitY);
  
  // --- Oscillation (Horizontal sine motion)
  const oscX = cx + 80 * Math.sin(t);
  circleOsc.setAttribute("cx", oscX);
  circleOsc.setAttribute("cy", cy + 180);
  // --- Wave Path Drawing
  if (showWave) {
    let pathData = "M 50 " + (cy + Math.sin(t) * 20);
    for (let x = 50; x <= 450; x += 10) {
      const y = cy + Math.sin(t + x / 30) * 40;
      pathData += ` L ${x} ${y}`;
    }
    wavePath.setAttribute("d", pathData);
  } else {
    wavePath.setAttribute("d", "");
  }
  
  // --- Composite Demo: combine orbit + oscillation + rotation
  if (compositeMode) {
    const compX = cx + 120 * Math.cos(angle) + 40 * Math.sin(t);
    const compY = cy + 120 * Math.sin(angle) + 20 * Math.cos(t * 1.5);
    compositeDot.setAttribute("cx", compX);
    compositeDot.setAttribute("cy", compY);
    compositeDot.setAttribute("opacity", 1);
    compositePath.setAttribute("opacity", 1);
    
    let newPathData = `${compX},${compY}`;
    let oldPathData = compositePath.getAttribute('d')
    compositePath.setAttribute('d', `${oldPathData} ${newPathData}`);
    
    
  } else {
    compositePath.setAttribute('d', 'M')
    
    compositeDot.setAttribute("opacity", 0);
    compositePath.setAttribute("opacity", 0);
  }
  
  requestAnimationFrame(animate);
}

console.warn('makeShapes', makeShapes)
makeShapes()

// makecircles()
// makeRects.start()

// animate();

// --- Interactive rotation using atan2
svg.addEventListener('dblclick', async (e) => {
  
  const svgHTML = svg.outerHTML;
  // console.warn({ svgHTML })
  await navigator.clipboard.writeText(svgHTML)
});

svg.addEventListener('click', e => {
  // console.warn('makeRects.isRunning', makeRects.isRunning)
  // makeRects.isRunning = !makeRects.isRunning
  // makeRects.stop()
  animState.isRunning = !animState.isRunning
  // console.warn('animState.isRunning', animState.isRunning)
  
  if (makeRects.isRunning) {
    
    // makeRects.stop()
    
  }
  else {
    console.warn('should be started')
    // makeRects.start()
  }
});

svg.addEventListener("pointermove", e => {
  const rect = svg.getBoundingClientRect();
  const dx = e.clientX - rect.left - cx;
  const dy = e.clientY - rect.top - cy;
  const ang = Math.atan2(dy, dx) * 180 / Math.PI;
  arrow.setAttribute("transform", `translate(${cx},${cy}) rotate(${ang})`);
});

// --- Buttons for interaction
// document.getElementById("toggleComposite").addEventListener("click", () => {
//   compositeMode = !compositeMode;
// });

// document.getElementById("toggleWave").addEventListener("click", () => {
//   showWave = !showWave;
// });

// --- Click to add radial burst
// svg.addEventListener("click", e => {
//   const rect = svg.getBoundingClientRect();
//   const mx = e.clientX - rect.left;
//   const my = e.clientY - rect.top;
//   for (let i = 0; i < 8; i++) {
//     const a = (i / 8) * 2 * Math.PI;
//     const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//     dot.setAttribute("cx", mx + 40 * Math.cos(a));
//     dot.setAttribute("cy", my + 40 * Math.sin(a));
//     dot.setAttribute("r", 3);
//     dot.setAttribute("fill", "#0ff");
//     svg.appendChild(dot);
//     setTimeout(() => dot.remove(), 1500);
//   }
// });