import { getGradient } from '../gradient-gen.js';
// ---- CONFIG ----

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const NUM_SLICES = 6;
const cx = 150;
const cy = 150;
const radius = 120;
const pegOffsets = [-30, -15, 0, 15];

// Physics parameters
const friction = 0.995; // < 1 means it slows down gradually
const velocityMultiplier = 2.2; // how much a swipe adds
let angle = 0;
let angularVelocity = 0;

// Gesture tracking
let activePointerId = null;
let startY = null;
let startTime = null;

const reset = () => {
  activePointerId = null;
  startY = null;
  startTime = null;
}

const spinnerGroup = document.getElementById('spinner-group');
const svg = document.getElementById('spinner-svg');
const spinnerCenter = document.getElementById('spinner-center');
const spinnerArrow = document.getElementById('spinner-arrow');

// ---- Build spinner ----
const polar = (cx, cy, r, angleDeg) => {
  const rad = angleDeg * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const createSlice = (startAngle, endAngle) => {
  const a = polar(cx, cy, radius, startAngle);
  const b = polar(cx, cy, radius, endAngle);
  const big = endAngle - startAngle > 180 ? 1 : 0;
  
  return `M ${cx} ${cy}
          L ${a.x} ${a.y}
          A ${radius} ${radius} 0 ${big} 1 ${b.x} ${b.y}
          Z`;
}

const createSliceText = (pos, textContent) => {
  let t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.classList.add('slice-text')
  t.setAttribute('x', pos.x);
  t.setAttribute('y', pos.y + 4);
  t.setAttribute('text-anchor', 'middle');
  t.setAttribute('font-size', '16');
  t.setAttribute('fill', '#fff');
  t.textContent = textContent;
  
  return t;
}
const createSlicePeg = (offset, mid) => {
  let peg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  const pos = polar(cx, cy, radius * 0.95, mid - offset);
  peg.setAttribute('cx', pos.x);
  peg.setAttribute('cy', pos.y);
  peg.setAttribute('r', 4);
  peg.setAttribute('fill', 'hsla(31, 71%, 22%, 1)')
  peg.setAttribute('stroke', '#000000');
  
  return peg;
}

const getSliceTextEls = () => {
  return [...document.querySelectorAll('.slice-text')]
};

const moveSliceText = (radiusMod = 0.6) => {
  const sliceTextEls = getSliceTextEls()
  
  const sliceAngle = 360 / NUM_SLICES;
  
  sliceTextEls.forEach((el, i) => {
    const s = -90 + i * sliceAngle;
    const e = s + sliceAngle;
    const mid = (s + e) / 2;
    const pos = polar(cx, cy, radius * radiusMod, mid);
    
    el.setAttribute('x', pos.x);
    el.setAttribute('y', pos.y + 4);
  });
}


const initSpinner = () => {
  spinnerGroup.innerHTML = '';
  const sliceAngle = 360 / NUM_SLICES;
  
  for (let i = 0; i < NUM_SLICES; i++) {
    const s = -90 + i * sliceAngle;
    const e = s + sliceAngle;
    let p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', createSlice(s, e));
    p.setAttribute('fill', `hsl(${i * 60}, 70%, 40%)`);
    p.setAttribute('stroke', '#111');
    spinnerGroup.appendChild(p);
    
    const mid = (s + e) / 2;
    const pos = polar(cx, cy, radius * 0.6, mid);
    let t = createSliceText(pos, i + 1)
    spinnerGroup.appendChild(t);
    spinnerArrow.setAttribute('transform', `rotate(${345} 15  15)`);
  }
  
  for (let i = 0; i < NUM_SLICES; i++) {
    const s = -90 + i * sliceAngle;
    const e = s + sliceAngle;
    const mid = (s + e) / 2;
    
    pegOffsets.forEach((offset, i) => {
      spinnerGroup.appendChild(createSlicePeg(offset, mid));
    });
  }
}

initSpinner();

// ---- Physics animation loop ----
let lastTime = performance.now();


let spinnerArrowState = 'initial'
let deltaAccumulator = 0

let currentRadiusMod = 0.6
let velModStep = 0.075
let velMod = 0
let radiusModStep = 0.075
let lastAngle = 0

const tick = (now) => {
  const dt = now - lastTime;
  lastTime = now;
  
  // slow down faster
  velMod = (angularVelocity * 0.0025)
  
  angularVelocity = angularVelocity - velMod
  
  deltaAccumulator += angularVelocity
  
  // Update physics
  angle += angularVelocity * dt; // v is degrees per ms
  angularVelocity *= (friction); // slow down slightly
  angle %= 360;
  
  angularVelocity = angularVelocity < 0.05 ? 0 : angularVelocity
  
  // Apply rotation
  spinnerGroup.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
  
  if (deltaAccumulator > 1.5 && angularVelocity > 0) {
    deltaAccumulator = 0
    spinnerArrowState = spinnerArrowState === 'initial' ? 'angled' : 'initial';
    const arrowAngle = spinnerArrowState === 'initial' ? 0 : 345
    
    spinnerArrow.setAttribute('transform', `rotate(${arrowAngle} 15  15)`);
    radiusModStep = currentRadiusMod <= 0.3 || currentRadiusMod >= 0.7 ? -radiusModStep : radiusModStep;
    
    currentRadiusMod = currentRadiusMod + (radiusModStep * (angularVelocity / 5))
    moveSliceText(currentRadiusMod)
  }
  
  const blur = angularVelocity / 5;
  const invert = angularVelocity > 2 ? 1 : 0
  const saturate = angularVelocity > 0.0 ? 1.5 : 1.2
  spinnerGroup.style.filter = `blur(${blur}px) drop-shadow(0 0 8px #000000D4) invert(${invert}) brightness(${saturate})`
  spinnerCenter.style.filter = `blur(${blur/1.5}px) drop-shadow(0 0 10px #00000099)`
  
  const stop1 = Math.min(50 + (50 * blur), 60);
  const stop2 = Math.max(-stop1 + 100, 40)
  
  app.style.background = getGradient(-angle, stop2, stop1)
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

// ---- Gesture handling (adds velocity) ----
svg.addEventListener('pointerdown', e => {
  if (activePointerId !== null) return;
  
  activePointerId = e.pointerId;
  startY = e.clientY;
  startTime = performance.now();
});

document.addEventListener('pointerup', e => {
  if (e.pointerId !== activePointerId) return;
  
  const dy = e.clientY - startY;
  const distance = Math.abs(dy);
  const dt = performance.now() - startTime;
  
  const MIN_DIST = 20;
  if (distance >= MIN_DIST) {
    const velocity = distance / dt; // px/ms
    const boost = velocity * velocityMultiplier * (dy < 0 ? -1 : 1); // up = CCW, down = CW
    angularVelocity += boost; // ← ADD to existing velocity (the key)
  }
  
  activePointerId = null;
  startY = null;
  startTime = null;
});

svg.addEventListener('pointercancel', reset);
svg.addEventListener('pointerleave', e => { if (e.pointerId === activePointerId) reset(); });