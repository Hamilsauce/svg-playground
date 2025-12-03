// Config
const NUM_SLICES = 6; // Change this to any integer >= 2
const SPIN_DURATION = 3000; // ms
const EXTRA_TURNS_MIN = 3;
const EXTRA_TURNS_MAX = 5;

const svg = document.getElementById('spinner-svg');
const spinnerGroup = document.getElementById('spinner-group');
const statusEl = document.getElementById('status');

const cx = 150;
const cy = 150;
const radius = 120;

let currentRotation = 0;
let spinning = false;

// Gesture tracking
let activePointerId = null;
let startY = null;
let startTime = null;

initSpinner(NUM_SLICES);
attachGestureHandlers();

// ---- Geometry / drawing ----

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createSlicePath(startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  
  // Wedge path
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

function initSpinner(numSlices) {
  spinnerGroup.innerHTML = '';
  const sliceAngle = 360 / numSlices;
  
  for (let i = 0; i < numSlices; i++) {
    const startAngle = -90 + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', createSlicePath(startAngle, endAngle));
    // Mild alternating colors
    const hue = (i * (360 / numSlices)) % 360;
    path.setAttribute('fill', `hsl(${hue}, 70%, 40%)`);
    path.setAttribute('stroke', '#111');
    path.setAttribute('stroke-width', '1.5');
    spinnerGroup.appendChild(path);
    
    // Label
    const midAngle = (startAngle + endAngle) / 2;
    const labelPos = polarToCartesian(cx, cy, radius * 0.6, midAngle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', labelPos.x);
    text.setAttribute('y', labelPos.y + 4); // small vertical tweak
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '16');
    text.setAttribute('fill', '#fff');
    text.textContent = i + 1;
    spinnerGroup.appendChild(text);
  }
  
  // Start with 0 rotation
  applyRotation(currentRotation);
}

function applyRotation(angle) {
  spinnerGroup.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
}

// ---- Spinning / easing ----

function easeOutCubic(t) {
  // decelerating to zero velocity
  return 1 - Math.pow(1 - t, 3);
}

function spinToRandomSlice() {
  if (spinning) return;
  spinning = true;
  
  const sliceAngle = 360 / NUM_SLICES;
  
  // Random target slice index
  const targetIndex = Math.floor(Math.random() * NUM_SLICES);
  
  // Center of the slice (relative to -90 being top)
  const sliceCenterAngle = targetIndex * sliceAngle + sliceAngle / 2;
  
  // We want a few full spins + landing at sliceCenterAngle
  const extraTurns =
    EXTRA_TURNS_MIN + Math.floor(Math.random() * (EXTRA_TURNS_MAX - EXTRA_TURNS_MIN + 1));
  
  // Target rotation absolute
  const targetRotation = currentRotation + extraTurns * 360 + sliceCenterAngle;
  
  const startRotation = currentRotation;
  const totalDelta = targetRotation - startRotation;
  
  const startTime = performance.now();
  
  statusEl.textContent = 'Spinning...';
  
  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / SPIN_DURATION, 1);
    const eased = easeOutCubic(t);
    const angle = startRotation + totalDelta * eased;
    applyRotation(angle);
    
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      // Normalize rotation so it doesn't grow without bound
      currentRotation = angle % 360;
      spinning = false;
      
      // Determine winning slice (pointer is at -90deg)
      const effectiveAngle = (360 - (currentRotation + 90)) % 360;
      let index = Math.floor(effectiveAngle / sliceAngle);
      if (index < 0) index += NUM_SLICES;
      if (index >= NUM_SLICES) index = NUM_SLICES - 1;
      
      statusEl.textContent = `Result: slice ${index + 1}`;
    }
  }
  
  requestAnimationFrame(frame);
}

// ---- Gesture handling ----

function attachGestureHandlers() {
  svg.addEventListener('pointerdown', (e) => {
    if (spinning) return;
    if (activePointerId !== null) return; // already tracking a pointer
    
    activePointerId = e.pointerId;
    startY = e.clientY;
    startTime = performance.now();
  });
  
  svg.addEventListener('pointerup', (e) => {
    if (spinning) return;
    if (e.pointerId !== activePointerId) return;
    
    const endY = e.clientY;
    const dy = endY - startY;
    const distance = Math.abs(dy);
    const dt = performance.now() - startTime;
    
    // crude 1-finger swipe detection (up or down)
    const MIN_DISTANCE = 30; // px
    const MAX_DURATION = 800; // ms, optional
    
    if (distance >= MIN_DISTANCE && dt <= MAX_DURATION) {
      spinToRandomSlice();
    } else {
      statusEl.textContent = 'Swipe up or down with a bit more distance to spin.';
    }
    
    activePointerId = null;
    startY = null;
    startTime = null;
  });
  
  svg.addEventListener('pointercancel', resetPointerState);
  svg.addEventListener('pointerleave', (e) => {
    if (e.pointerId === activePointerId) resetPointerState();
  });
}

function resetPointerState() {
  activePointerId = null;
  startY = null;
  startTime = null;
}