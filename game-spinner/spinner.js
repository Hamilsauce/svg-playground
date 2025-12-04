import { getGradient } from '../gradient-gen.js';
// ---- CONFIG ----

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')


const NUM_SLICES = 6;
const cx = 150;
const cy = 150;
const radius = 120;

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

const spinnerGroup = document.getElementById("spinner-group");
const svg = document.getElementById("spinner-svg");
const spinnerCenter = document.getElementById("spinner-center");
const spinnerArrow = document.getElementById("spinner-arrow");

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

const initSpinner = () => {
  spinnerGroup.innerHTML = "";
  const sliceAngle = 360 / NUM_SLICES;
  
  for (let i = 0; i < NUM_SLICES; i++) {
    const s = -90 + i * sliceAngle;
    const e = s + sliceAngle;
    let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", createSlice(s, e));
    p.setAttribute("fill", `hsl(${i * 60}, 70%, 40%)`);
    p.setAttribute("stroke", "#111");
    spinnerGroup.appendChild(p);
    
    const mid = (s + e) / 2;
    const pos = polar(cx, cy, radius * 0.6, mid);
    let t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", pos.x);
    t.setAttribute("y", pos.y + 4);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "16");
    t.setAttribute("fill", "#fff");
    t.textContent = i + 1;
    spinnerGroup.appendChild(t);
  }
}

initSpinner();

// ---- Physics animation loop ----
let lastTime = performance.now();


let spinnerArrowState = 'initial'
let deltaAccumulator = 0


const tick = (now) => {
  const dt = now - lastTime;
  lastTime = now;
  deltaAccumulator += dt
  // Update physics
  angle += angularVelocity * dt; // v is degrees per ms
  angularVelocity *= friction; // slow down slightly
  angle %= 360;
  angularVelocity = angularVelocity < 0.05 ? 0 : angularVelocity
  
  // Apply rotation
  spinnerGroup.setAttribute("transform", `rotate(${angle} ${cx} ${cy})`);
  
  if (deltaAccumulator > 32 && angularVelocity > 0) {
    deltaAccumulator = 0
    spinnerArrowState = spinnerArrowState === 'initial' ? 'angled' : 'initial';
    const arrowAngle = spinnerArrowState === 'initial' ? 0 : 350
    
    spinnerArrow.setAttribute("transform", `rotate(${arrowAngle} 15  15)`);
  }
  const blur = angularVelocity / 5;
  const invert = angularVelocity > 2 ? 1 : 0
  spinnerGroup.style.filter = `blur(${blur}px) drop-shadow(0 0 10px #00000099) invert(${invert})`
  spinnerCenter.style.filter = `blur(${blur/1.5}px) drop-shadow(0 0 10px #00000099)`
  
  const stop1 = Math.min(50 + (50 * blur), 60);
  const stop2 = Math.max(-stop1 + 100, 40)
  console.warn({angularVelocity})
  app.style.background = getGradient(-angle, stop2, stop1)
  // app.style.filter = `blur(${blur}px) drop-shadow(0 0 6px #00000090)`
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

// ---- Gesture handling (adds velocity) ----
svg.addEventListener("pointerdown", e => {
  if (activePointerId !== null) return;
  
  activePointerId = e.pointerId;
  startY = e.clientY;
  startTime = performance.now();
});

svg.addEventListener("pointerup", e => {
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

svg.addEventListener("pointercancel", reset);
svg.addEventListener("pointerleave", e => { if (e.pointerId === activePointerId) reset(); });