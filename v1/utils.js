export const getSVGTemplate = (context, type, options) => {
  const { dataset, attrs, style } = options;
  const template = context
    .querySelector('#templates')
    .querySelector(`[data-template="${type}"]`)
    .cloneNode(true)
  
  template.dataset.type = type;
  template.removeAttribute('data-template');
  delete template.dataset.template;
  
  if (dataset) {
    Object.assign(template.dataset, dataset)
  }
  
  if (attrs) {
    [...Object.entries(attrs)].forEach(([k, v], i) => {
      template.setAttribute(k, v);
    });
  }
  
  if (style && typeof style === 'string') {
    template.style = style
  }
  
  if (style && typeof style === 'object') {
    [...Object.entries(style)].forEach(([k, v], i) => {
      template.style[k] = v;
    });
  }
  
  return template;
}

const state = {
  sampleIndex: 0,
  fpsSamples: [0, 0, 0, 0, 0],
  elapsed: 0,
  deltaMs: 0,
  setFPS(delta) {
    const i = this.sampleIndex;
    this.fpsSamples[i] = Math.round((1 / (delta / 1000)))
    this.sampleIndex = i >= 5 ? 0 : i + 1;
    
  },
  get deltaMs() { return Math.round(((1 / (this.deltaMs / 1000)) + this.fpsSamples) / 2); },
  get fps() { return Math.round(this.fpsSamples.reduce((sum, curr, i) => sum + curr, 0) / this.fpsSamples.length) },
}


export const frameRate = (delta) => {
  state.setFPS(delta);
  
  return state.fps;
};

window.fpsState = state




// export const initCalculateFPS = (smoothingWindowSize = 30) => {
//   let fps = 0;
//   let frameTimes = [];
//   let lastTime = 0;
  
  
//   return (timestamp) => {
//     const delta = (timestamp - lastTime) / 1000;
//     lastTime = timestamp;
    
//     frameTimes.push(delta);

//     if (frameTimes.length > smoothingWindowSize) frameTimes.shift(); // keep last 30 frames
    
//     const avgDelta = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
//     fps = Math.round(1 / avgDelta);
    
//     return fps;
//   }
// };