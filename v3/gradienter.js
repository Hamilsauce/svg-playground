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
    
    if (p1 <= 100 && !flip) { p1 = p1 + 0.3 }
    else if (p1 >= 0 && flip) { p1 = p1 - 0.3 }
    
    if (p2 <= 100 && flip) { p2 = p2 + 0.3 }
    else if (p2 >= 0 && !flip) { p2 = p2 - 0.3 }
    
    if (p1 >= 100 || p1 < 0 || p2 >= 100 || p2 < 0) {
      flip = !flip
    }
    
    
    rotation += increment + 1 //(perc1 / 2)
    roto1 = Math.round(roto1 + 1)
    roto2 = Math.round(roto2 + 1)
    hsla1 = `hsla(${roto1}, 50%, 60%, 0.6)`;
    hsla2 = `hsla(${-roto2}, 50%, 40%, 0.7)`;
    bgString = `linear-gradient(${rotation+77}deg, ${hsla1} ${20}%, ${hsla2} ${100}%)`
    
    postMessage({ bgString, flip, invert: `invert(${invert})` })
    
  }, interval)
  
  return () => ({ background: bgString, flip, transform: `invert(${invert})` })
  // return (incr = 1) => {
  //   increment = incr
  //   return bgString
  // }
}