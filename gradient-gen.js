function* circleLooper(sourceArray = [], startIndex = 0) {
  let index = startIndex;
  let indexOverride
  const loopIncrementIndex = initIndexIncrementLooper(index, 0, sourceArray.length)
  
  while (true) {
    indexOverride = yield sourceArray[index]
    index = loopIncrementIndex(indexOverride)
  }
}

export const makeCircular = (sourceArray) => {
  return circleLooper(sourceArray)
};

export const getGradient = (angle, stop1 = 50, stop2 = 50) => {
  const hsla1 = `hsla(${-(angle - 45)}, 90%, 45%, 1)`;
  const hsla2 = `hsla(${angle+90}, 90%, 45%, 1)`;
  
  return `linear-gradient(${angle}deg, ${hsla1} ${stop1}%, ${hsla2} ${stop2}%)`
};

export const initGradientMan = (interval = 16) => {
  let increment = 1;
  let rotation = 0;
  let bgString = `linear-gradient(${rotation}deg, #342D3A 40%, #233744 100%);`
  let p1 = 0
  let p2 = 100
  let flip = false
  let invert = 0
  let roto1 = 272
  let roto2 = 0
  let hsla1 = `hsla(${roto1}, 80%, 50%, 0.6)`;
  let hsla2 = `hsla(${roto2}, 80%, 50%, 0.6)`;
  
  setInterval(() => {
    const perc1 = Math.round(Math.random() * 100)
    const perc2 = 100 - perc1
    
    if (p1 <= 100 && !flip) { p1 = p1 + 0.1 }
    else if (p1 >= 0 && flip) { p1 = p1 - 0.1 }
    
    if (p2 <= 100 && flip) { p2 = p2 + 0.1 }
    else if (p2 >= 0 && !flip) { p2 = p2 - 0.1 }
    
    if (p1 >= 100 || p1 < 0 || p2 >= 100 || p2 < 0) {
      flip = !flip
    }
    
    
    rotation += increment + 1 //(perc1 / 2)
    roto1 = roto1 + Math.round(roto1 + 1)
    roto2 = roto2 + Math.round(roto2 + 1)
    hsla1 = `hsla(${roto1}, 100%, 50%, 1)`;
    hsla2 = `hsla(${-roto2}, 50%, 50%, 1)`;
    bgString = `linear-gradient(${rotation}deg, ${hsla1} ${25}%, ${hsla2} ${75}%)`
    
    postMessage({ bgString, flip, invert: `invert(${invert})` })
    
  }, interval)
  
  return () => ({ background: bgString, flip, transform: `invert(${invert})` })
  // return (incr = 1) => {
  //   increment = incr
  //   return bgString
  // }
}