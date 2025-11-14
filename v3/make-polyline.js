import { getSVGTemplate, svgPoint } from '../utils.js';


export const createPlotline = (container, points) => {
  const svgCanvas = container.ownerSVGElement;
  
  const pline = getSVGTemplate(svgCanvas, 'plot-line', {});
  
  const toSVGPoint = ({ x, y }) => {
    return svgPoint(svgCanvas, svgCanvas, x, y)
  }
  
  pline.appendPoint = (point) => {
    const pt = toSVGPoint(point);
    pline.firstElementChild.points.appendItem(pt)
    return point
  }
  
  const plotLine = points.reduce((line, { timestamp: x, duration: y, }, i) => {
    const point = toSVGPoint({ x: x / 5, y: (y * -1) })
    
    line.appendPoint(point)
    
    return line;
  }, pline);
  
  return plotLine;
};