// Config
const NUM_SLICES = 6;

let currentRotation = 0;
let spinning = false;

// Gesture tracking
let activePointerId = null;
let startY = null;
let startTime = null;

// ---- Same helpers here (polarToCartesian, createSlicePath, initSpinner...) ----
// (Assume everything before spinToRandomSlice() is identical to the previous version)

function spinWithPower(velocity) {
  if (spinning) return;
  spinning = true;
  
  // Normalize pixel/ms velocity into a usable 0–1 range.
  // Typical finger flicks land around 0.001–0.004 px/ms.
  const power = Math.min(velocity * 600, 1);
  // Low velocity -> small number, high velocity -> near 1.
  
  // Spin parameters scale with power:
  const minTurns = 2;
  const maxTurns = 8;
  const extraTurns = minTurns + power * (maxTurns - minTurns);
  
  // Faster gesture → shorter animation (feels “snappy”)
  const minDuration = 1000;
  const maxDuration = 3000;
  const SPIN_DURATION = maxDuration - power * (maxDuration - minDuration);
  
  const sliceAngle = 360 / NUM_SLICES;
  const targetIndex = Math.floor(Math.random() * NUM_SLICES);
  const sliceCenterAngle = targetIndex * sliceAngle + sliceAngle / 2;
  
  const startRotation = currentRotation;
  const targetRotation =
    currentRotation + extraTurns * 360 + sliceCenterAngle;
  
  const totalDelta = targetRotation - startRotation;
  const timeStart = performance.now();
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  function frame(now) {
    const elapsed = now - timeStart;
    const t = Math.min(elapsed / SPIN_DURATION, 1);
    const eased = easeOutCubic(t);
    const angle = startRotation + totalDelta * eased;
    
    applyRotation(angle);
    
    if (t < 1) {
      requestAnimationFrame(frame);
      return;
    }
    
    currentRotation = angle % 360;
    spinning = false;
  }
  
  requestAnimationFrame(frame);
}

// ---- Gesture handling ----

function attachGestureHandlers() {
  svg.addEventListener("pointerdown", (e) => {
    if (spinning) return;
    if (activePointerId !== null) return;
    
    activePointerId = e.pointerId;
    startY = e.clientY;
    startTime = performance.now();
  });
  
  svg.addEventListener("pointerup", (e) => {
    if (spinning) return;
    if (e.pointerId !== activePointerId) return;
    
    const endY = e.clientY;
    const dy = endY - startY;
    const distance = Math.abs(dy);
    const dt = performance.now() - startTime;
    
    const MIN_DISTANCE = 20;
    if (distance < MIN_DISTANCE) {
      activePointerId = null;
      return;
    }
    
    // ← NEW: gesture velocity
    const velocity = distance / dt; // px per ms
    spinWithPower(velocity);
    
    activePointerId = null;
  });
  
  svg.addEventListener("pointercancel", resetPointerState);
  svg.addEventListener("pointerleave", (e) => {
    if (e.pointerId === activePointerId) resetPointerState();
  });
}

function resetPointerState() {
  activePointerId = null;
  startY = null;
  startTime = null;
}