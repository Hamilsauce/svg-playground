const initGradientMan = (interval = 16) => {
  let increment = 1;
  let rotation = 0;
  let bgString = `linear-gradient(${rotation}deg, #342D3A 40%, #233744 100%);`
  let p1 = 50
  let p2 = 50
  let flip = false
  let invert = 0
  let roto1 = 272
  let roto2 = 254
  let hsla1 = `hsla(${roto1}, 13%, 25%, 1)`;
  let hsla2 = `hsla(${roto2}, 32%, 25%, 1)`;

  setInterval(() => {
    const perc1 = Math.round(Math.random() * 100)
    const perc2 = 100 - perc1
    // invert 
    // p2 = p2 <= 0 ? 100 : p2 - 1
    
    // if ((p1 >= 100 || p2 <= 0) || (p1 >= 100 || p2 <= 0)) {
    //   flip = !flip
    //   console.warn('flip', flip)
    // }
    
    if (p1 <= 60 && !flip) { p1 = p1 + 0.1 }
    else if (p1 >= 40 && flip) { p1 = p1 - 0.1 }
    
    if (p2 <= 60 && flip) { p2 = p2 + 0.1 }
    else if (p2 >= 40 && !flip) { p2 = p2 - 0.1 }
    
    if (p1 >= 60 || p1 < 40 || p2 >= 60 || p2 < 40) {
      flip = !flip
    }
    
    rotation += increment + (perc1 / 2)
    roto1 = Math.round(roto1 + 0.5)
    roto2 = Math.round(roto2 - 1)
    hsla1 = `hsla(${roto1}, 40%, 25%, 1)`;
    hsla2 = `hsla(${roto2}, 100%, 35%, 1)`;
    bgString = `linear-gradient(${rotation}deg, ${hsla1} ${p1}%, ${hsla2} ${p2}%)`
    
    postMessage({ bgString, flip, invert: `invert(${invert})` })
    
  }, interval)
}
const gradienter = initGradientMan()
onmessage = (e) => {
  console.warn('I AM WORKER MAN')
  console.log('message: ')
  console.warn(e)
  
}