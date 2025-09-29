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

export const initCalculateFPS = (smoothingWindowSize = 30) => {
  let fps = 0;
  let frameTimes = [];
  let lastTime = 0;
  
  
  return (delta) => {
    const deltaSecs = (delta / 1000)
    // lastTime = timestamp;
    console.warn('delta', delta)
    frameTimes.push(delta);
    
    if (frameTimes.length > smoothingWindowSize) frameTimes.shift(); // keep last 30 frames
    
    const avgDelta = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
    fps = Math.round(avgDelta);
    // console.warn('avgDelta', avgDelta)    
    return fps;
  }
};