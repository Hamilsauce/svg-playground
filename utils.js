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

const toPointInContainer = (target, { x, y }) => {
  return new DOMPoint(x, y).matrixTransform(
    target.getScreenCTM().inverse()
  );
}

export const svgPoint = (svg, target, x, y) => {
  var pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(target.getScreenCTM().inverse());
}

export const toSVGPoint = ({ x, y }) => {
  return svgPoint(svgCanvas, x, y)
}

export const applyAttributes = (template, options) => {
  const { dataset, attrs, style } = options;
  
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
    const deltaSecs = (delta / 1000);
    frameTimes.push(delta);
    
    const avgDelta = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
    fps = Math.round(avgDelta);
    
    return fps;
  }
};