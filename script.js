const svg = document.getElementById("demo");
const circleOrbit = document.getElementById("circleOrbit");
const circleOsc = document.getElementById("circleOsc");
const radialGroup = document.getElementById("radialGroup");
const arrow = document.getElementById("arrow");

const cx = 200,
  cy = 200;
let angle = 0;
let t = 0;

// --- Radial layout (Polar to Cartesian)
const radius = 120;
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * 2 * Math.PI;
  const x = cx + radius * Math.cos(a);
  const y = cy + radius * Math.sin(a);
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("cx", x);
  dot.setAttribute("cy", y);
  dot.setAttribute("r", 4);
  radialGroup.appendChild(dot);
}

function animate() {
  angle += 0.02;
  t += 0.05;
  
  // --- Circular motion (Orbit)
  const orbitX = cx + 80 * Math.cos(angle);
  const orbitY = cy + 80 * Math.sin(angle);
  circleOrbit.setAttribute("cx", orbitX);
  circleOrbit.setAttribute("cy", orbitY);
  
  // --- Oscillation (Horizontal sine motion)
  const oscX = cx + 60 * Math.sin(t);
  circleOsc.setAttribute("cx", oscX);
  circleOsc.setAttribute("cy", cy + 140);
  
  requestAnimationFrame(animate);
}

animate();

// --- Interactive rotation using atan2
svg.addEventListener("pointermove", e => {
  const rect = svg.getBoundingClientRect();
  const dx = e.clientX - rect.left - cx;
  const dy = e.clientY - rect.top - cy;
  const ang = Math.atan2(dy, dx) * 180 / Math.PI;
  arrow.setAttribute("transform", `translate(${cx},${cy}) rotate(${ang})`);
});