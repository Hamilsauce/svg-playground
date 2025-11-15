import { getSVGTemplate, applyAttributes, initCalculateFPS } from './utils.js';
import { randomCircleWalker, opacityLFO, runModulation } from '../effects/modulators.js';
import { initGradientMan } from './gradienter.js';
import { createPlotline } from './make-polyline.js';
import { frameRate } from './frame-rate.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { sleep, download } = ham;
import svg from 'https://hamilsauce.github.io/hamhelper/modules/svg.js';
const { createSVGElement } = svg;

class CircularBuffer {
	constructor(size) {
		this.size = size;
		this.index = 0;
		this.items = new Array(size);
	}
	
	next() {
		const item = this.items[this.index];
		this.index = (this.index + 1) % this.size;
		return item;
	}
	
	set(i, el) {
		this.items[i] = el;
	}
	
	[Symbol.iterator]() {
		return this.items.values();
	}
}

window.download = download

const orbitMods = []
window.orbitMods = orbitMods

const calcFPS = initCalculateFPS();
const fpsDisplay = document.querySelector('#fps');
const shapeCount = document.getElementById("shape-count");

const effectMode = {
	regular: 'regular',
	transparent: 'transparent',
	alternate: 'alternate',
	invert: 'invert',
}

const blendMode = {
	none: null,
	saturation: 'saturation',
	multiply: 'multiply',
	'soft-light': 'soft-light',
}

const renderedShapes = {
	circle: [],
	rect: [],
	polyline: [],
}

export const animState = {
	isRunning: false,
	effectMode: effectMode.regular,
	blendMode: blendMode.none,
	fillEffect: 0.8,
	invert: 0,
	isolate: true,
	transition: false,
	blur: false,
	follow: true,
	activeShapes: {
		circle: true,
		rect: true,
		polyline: true,
	},
	background: {
		filter: true,
		gradient: true,
		defaultFill: '#222222',
	},
	renderedShapes,
	lastPoint: { x: 0, y: 0 },
}

window.animState = animState;
window.orbitMods = orbitMods;
// runModulation()
export const circleMaker = (svgEl, angleStep = 0.02, tStep = 0.05) => {
	const BUFFER_SIZE = 50;
	const buffer = new CircularBuffer(BUFFER_SIZE);
	
	let hueRotate = 0;
	let angle = 0;
	let t = 0;
	let orbitStep = 2;
	let cx = 200;
	let cy = 200;
	let orbitX = cx;
	let orbitY = cy;
	let shouldNegativeOrbit1 = Math.random() >= 0.5 ? 1 : -1;
	let shouldNegativeOrbit2 = Math.random() >= 0.5 ? 1 : -1;
	let orbXMod = (5 * buffer.index) * (shouldNegativeOrbit1)
	let orbYMod = (5 * buffer.index) * (shouldNegativeOrbit2)
	
	let radius = 51;
	let radiusStep = 1;
	let opacityStep = 0.75;
	let opacity = 0.5;
	let circles = [];
	let circleCounter = 0;
	let rafID = null
	const svgCanvas = svgEl.closest('svg')
	let opa2 = 50;
	let opaNeg = 1;
	let opa2Step = -2;
	let blurStep = 0.25;
	let blur = '0px';
	let invert = 0
	const frameSize = 16
	let frameWindow = 0;
	
	let currentCirc = null;
	
	
	for (let i = 0; i < BUFFER_SIZE; i++) {
		const circ = getSVGTemplate(svgCanvas, 'basic-circle', {
			style: {
				fill: `hsla(${90}, 100%, 50%, ${0.5})`,
				stroke: `#FFFFFF80`,
				strokeWidth: `${opacity}`,
				filter: `invert(${0.0}) opacity(${0.5}) drop-shadow(0 0 5px #00000020)`,
				'mix-blend-mode': null,
				isolation: null,
			},
			attrs: {
				transform: `translate(${250},${250}) rotate(${0})`,
				r: radius,
			}
		});
		
		// randomCircleWalker(circ, () => {
		// 	orbitStep = cx >= 200 || cx <= 40 ? -orbitStep : orbitStep;
		// 	cx = cx + orbitStep * (Math.random() * 10);
		// 	cy = cy + orbitStep * (Math.random() * 10);
		// 	orbitX = cx - orbXMod * Math.cos(angle);
		// 	orbitY = cy + orbYMod * Math.sin(angle);
		
		// 	shouldNegativeOrbit1 = Math.random() >= 0.5 ? 1 : -1;
		// 	shouldNegativeOrbit2 = Math.random() >= 0.5 ? 1 : -1;;
		// 	orbXMod = (5 * buffer.index) * (shouldNegativeOrbit1)
		// 	orbYMod = (5 * buffer.index) * (shouldNegativeOrbit2)
		
		// 	orbitX = cx - orbXMod * Math.cos(angle);
		// 	orbitY = cy + orbYMod * Math.sin(angle);
		
		// 	return { x: orbitX, y: orbitY }
		// })
		
		renderedShapes.circle.push(circ)
		buffer.set(i, circ);
	}
	
	let lastPerf = 0;
	
	const createCircle = (delta = 0) => {
		frameWindow += delta;
		
		// if (animState.isRunning && frameWindow > frameSize) {
		// frameWindow = 0
		
		angle += angleStep;
		t += tStep;
		hueRotate++
		
		opacityStep = opacity > 0.8 || opacity <= 0.1 ? -opacityStep : opacityStep;
		opacityStep = opacity > 0.8 || opacity <= 0.1 ? -opacityStep : opacityStep;
		opacity = opacity + opacityStep;
		radiusStep = radius > 150 || radius <= 25 ? -radiusStep : radiusStep;
		radius = radius + radiusStep;
		
		orbitStep = cx >= 200 || cx <= 40 ? -orbitStep : orbitStep;
		cx = cx + orbitStep * (Math.random() * 10);
		cy = cy + orbitStep * (Math.random() * 10);
		
		shouldNegativeOrbit1 = Math.random() >= 0.5 ? 1 : -1;
		shouldNegativeOrbit2 = Math.random() >= 0.5 ? 1 : -1;;
		orbXMod = (5 * buffer.index) * (shouldNegativeOrbit1)
		orbYMod = (5 * buffer.index) * (shouldNegativeOrbit2)
		orbitX = cx - orbXMod * Math.cos(angle);
		orbitY = cy + orbYMod * Math.sin(angle);
		
		if (opa2 >= 80 || opa2 <= 10) {
			opa2Step = -opa2Step
		}
		
		opa2 = opa2 + opa2Step;
		opaNeg = opaNeg + opa2Step;
		
		let fillEffect
		let contrast
		
		switch (animState.fillEffect) {
			case 'regular':
				fillEffect = opa2 / 200;
				break;
			case 'transparent': {
				fillEffect = opa2 / 10000;
				contrast = 5
			}
			break;
			case 'alternate':
				fillEffect = opaNeg / 10;
				break;
			default:
				fillEffect = opa2 / 100;
		}
		
		// const rand = Math.random() * 10
		blur = animState.blur ? '10px' : '0.05px'
		const transition = animState.transition ? '3.25s ease-out !important' : '0.125s ease-out !important'
		// const shouldNegativeOrbit1 = Math.random() >= 0.5 ? 1 : -1;
		// const shouldNegativeOrbit2 = Math.random() >= 0.5 ? 1 : -1;;
		// const orbXMod = (5 * buffer.index) * (shouldNegativeOrbit1)
		// const orbYMod = (5 * buffer.index) * (shouldNegativeOrbit2)
		
		let invert = animState.invert
		const rand = Math.random() * 10
		
		if (animState.isRunning && frameWindow > frameSize) {
			const orbitMod = buffer.index % 1;
			
			if (!orbitMod) {
				const dur = (performance.now() - lastPerf) // Math.round((performance.now() - lastPerf)) // / 100)
				lastPerf = performance.now();
				currentCirc = buffer.next()
				
				window.orbitMods.push([lastPerf, dur]);
			}
			
			if (!orbitMod && currentCirc && currentCirc.dataset.rendered === 'true') {
				currentCirc.style.opacity = 0.2
				currentCirc = buffer.next()
				currentCirc.dataset.rendered = 'false'
			}
			else {
				currentCirc.style.opacity = 1
				currentCirc.dataset.rendered = 'true'
				currentCirc = buffer.next()
				
			}
			
			frameWindow = 0
			currentCirc = buffer.next();
			
			const strokeWidth = opacity * (Math.random() * 100);
			// 	blur = animState.blur ? '10px' : '0.05px'
			// const transition = animState.transition ? '3.25s ease-out !important' : '0.125s ease-out !important'
			// let invert = animState.invert
			// const rand = Math.random() * 10
			
			
			applyAttributes(currentCirc, {
				style: {
					fill: `hsla(${hueRotate - rand}, 100%, 50%, ${fillEffect})`,
					stroke: `#hsla(${-hueRotate-1}, ${frameWindow}%, 100%, ${opa2/100})`,
					strokeWidth,
					
					filter: `blur(${blur}) invert(${invert}) opacity(${opa2/10}) drop-shadow(0 0 5px #00000030)`,
					'mix-blend-mode': animState.blendMode,
					isolation: animState.isolate ? 'isolate' : null,
					// transition,
				},
				attrs: {
					transform: `translate(${orbitX},${orbitY}) rotate(${hueRotate-rand})`,
					r: radius - strokeWidth,
				}
			});
			
			if (!currentCirc.parentElement) {
				svgEl.append(currentCirc)
				currentCirc.dataset.rendered === 'true'
			}
			
		}
	}
	
	return createCircle;
}

export const rectMaker = (svgEl, angleStep = 0.02, tStep = 0.05) => {
	let rafID = null;
	let isRunning = false;
	let hueRotate = 180;
	let angle = 0;
	let t = 0;
	let cx = 200;
	let cy = 250;
	let radius = 41;
	let radiusStep = 0.9;
	let opacityStep = 0.0075;
	let orbitStep = 2;
	
	let borderRadius = 1
	let borderRadiusStep = 0.5
	
	let opacity = 0.6;
	let circleCounter = 0;
	let rotoMod = 2
	const svgCanvas = svgEl.closest('svg')
	
	const frameSize = 0
	let frameWindow = 0;
	
	
	const createRect = (delta) => {
		frameWindow += delta
		
		if (animState.isRunning && frameWindow > frameSize) {
			frameWindow = 0
			
			angle -= angleStep;
			t += tStep;
			hueRotate++
			
			opacityStep = opacity > 0.6 || opacity <= 0.1 ? -opacityStep : opacityStep;
			opacity = opacity + opacityStep;
			
			radiusStep = radius > 180 || radius <= 12 ? -radiusStep : radiusStep;
			radius = radius + radiusStep;
			
			rotoMod = rotoMod === 2 ? 6 : 2
			
			borderRadiusStep = borderRadius >= 20 || borderRadius <= 0 ? -borderRadiusStep : borderRadiusStep;
			borderRadius = borderRadius + borderRadiusStep;
			orbitStep = cx >= 50 || cx <= 2 ? -orbitStep : orbitStep;
			
			cx = cx + orbitStep;
			cy = cy + orbitStep;
			
			if (renderedShapes.rect.length <= 20) {
				const orbitX = cx + 100 * Math.cos(angle);
				const orbitY = cy + 100 * Math.sin(angle);
				
				const rect = getSVGTemplate(svgCanvas, 'basic-rect', {
					style: {
						fill: `hsla(${hueRotate}, 100%, 50%, ${opacity/2})`,
						filter: `drop-shadow(0 0 5px #00000030)`,
						// 'mix-blend-mode': 'overlay',
						// 'mix-blend-mode': 'darken',
						'mix-blend-mode': 'color',
						isolation: 'isolate',
						rx: borderRadius,
						ry: borderRadius,
					},
					attrs: {
						width: radius,
						height: radius,
						transform: `translate(${orbitX},${orbitY}) rotate(${hueRotate*rotoMod})`,
						rx: borderRadius,
						ry: borderRadius,
						
					}
				});
				
				svgEl.append(rect)
				renderedShapes.rect.push(rect)
			} else {
				renderedShapes.rect.shift().remove();
			}
			
		}
	}
	
	return createRect
}

export const polylinerMaker = (svgEl, angleStep = 0.02, tStep = 0.05) => {
	let rafID = null;
	let isRunning = false;
	let hueRotate = 180;
	let angle = 0;
	let t = 0;
	let cx = 200;
	let cy = 250;
	let orbitX = cx;
	let orbitY = cy;
	
	let radius = 41;
	let radiusStep = 0.9;
	let opacityStep = 0.0075;
	let orbitStep = 2;
	
	let borderRadius = 1
	let borderRadiusStep = 0.5
	
	let opacity = 0.6;
	let circleCounter = 0;
	let rotoMod = 2
	const svgCanvas = svgEl.closest('svg')
	
	let opa2 = 50;
	let opaNeg = 1;
	let opa2Step = -2;
	let blurStep = 0.25;
	let blur = '0px';
	let invert = 0
	
	
	const frameSize = 256
	let frameWindow = 0;
	
	const polyline = createPlotline(svgEl, [])
	svgEl.append(polyline)
	
	
	const updatePolyline = (delta = 0) => {
		frameWindow += delta;
		
		// if (animState.isRunning && frameWindow > frameSize) {
		// frameWindow = 0
		
		angle += angleStep;
		t += tStep;
		hueRotate++
		
		opacityStep = opacity > 0.8 || opacity <= 0.1 ? -opacityStep : opacityStep;
		opacity = opacity + opacityStep;
		radiusStep = radius > 150 || radius <= 25 ? -radiusStep : radiusStep;
		radius = radius + radiusStep;
		
		orbitStep = cx >= 200 || cx <= 40 ? -orbitStep : orbitStep;
		cx = cx + orbitStep * (Math.random() * 10);
		cy = cy + orbitStep * (Math.random() * 10);
		
		orbitX = cx * Math.cos(angle);
		orbitY = cy * Math.sin(angle);
		
		if (opa2 >= 80 || opa2 <= 10) {
			opa2Step = -opa2Step
		}
		
		opa2 = opa2 + opa2Step;
		opaNeg = opaNeg + opa2Step;
		
		let fillEffect
		let contrast
		
		switch (animState.fillEffect) {
			case 'regular':
				fillEffect = opa2 / 200;
				break;
			case 'transparent': {
				fillEffect = opa2 / 10000;
				contrast = 5
			}
			break;
			case 'alternate':
				fillEffect = opaNeg / 10;
				break;
			default:
				fillEffect = opa2 / 100;
		}
		
		
		const rand = Math.random() * 10
		const strokeWidth = opacity * (Math.random() * 10);
		blur = animState.blur ? '10px' : '0.05px'
		const transition = animState.transition ? '10.25s ease-out !important' : '1.125s ease-out !important'
		let invert = animState.invert
		animState.lastPoint = polyline.appendPoint({ x: orbitX, y: orbitY })
		
		if (animState.isRunning && frameWindow > frameSize) {
			frameWindow = 0
			
			
			applyAttributes(polyline.firstElementChild, {
				style: {
					fill: `hsla(${hueRotate - rand}, 100%, 50%, ${fillEffect})`,
					stroke: `#hsla(${-hueRotate-1}, ${frameWindow}%, 100%, ${opa2/100})`,
					strokeWidth,
					
					filter: `blur(${blur}) invert(${invert}) opacity(${opa2/10}) drop-shadow(0 0 5px #00000030)`,
					'mix-blend-mode': animState.blendMode,
					isolation: animState.isolate ? 'isolate' : null,
					transition,
				},
				attrs: {
					// transform: `translate(${orbitX},${orbitY}) rotate(${0})`,
					// r: radius - strokeWidth,
				}
			});
			
		}
	}
	
	
	return updatePolyline
}

const rectMakerGPT = (svgEl, baseAngleStep = 0.02, baseRadius = 80, hueMod, classID = 5) => {
	let angle = Math.random() * Math.PI * 2;
	let radius = baseRadius;
	let radiusDrift = 0.15;
	let angleDrift = (Math.random() - 0.5) * 0.002;
	let hue = Math.random() * 360;
	let opacity = 0.4;
	let cx = 250,
		cy = 250;
	const rects = [];
	let opacityStep = 0.0075;
	
	const frameWindow = 16;
	let frameSize = 0;
	
	return (delta) => {
		frameSize += delta
		if (!animState.isRunning || frameSize <= frameWindow) return;
		frameSize = 0
		
		
		angle += baseAngleStep + angleDrift;
		radius += radiusDrift;
		hue += 0.7;
		
		if (radius > 120 || radius < 20) radiusDrift *= -1;
		
		const orbitX = cx + radius * Math.cos(angle);
		const orbitY = cy + radius * Math.sin(angle);
		
		opacityStep = opacity > 0.4 || opacity <= 0.1 ? -opacityStep : opacityStep;
		opacity = opacity + opacityStep;
		
		if (rects.length <= 5) {
			
			const rect = getSVGTemplate(svgEl.closest('svg'), 'basic-rect', {
				style: {
					fill: `hsla(${hue}, 100%, 50%, ${opacity})`,
					filter: `drop-shadow(0 0 5px #00000030)`,
				},
				attrs: {
					width: radius / 2,
					height: radius / 2,
					transform: `translate(${orbitX},${orbitY}) rotate(${(hue * 2)})`,
				}
			});
			
			svgEl.append(rect);
			rects.push(rect);
		}
		else {
			rects.shift().remove();
			
		}
	};
};

export const initMakeShapes = (svgEl, angleStep = 0.02, tStep = 0.05) => {
	let circs = [];
	let rects = [];
	let lastTime = 0;
	let makerArrayIndex = 0
	const frameSize = 0
	
	let frameWindow = 0
	
	const svgCanvas = svgEl.closest('svg')
	const viewport = svgCanvas.querySelector('#viewport')
	const getGradient = initGradientMan(64)
	const lastPointDisplay = document.getElementById("last-point");
	
	const makeCircles1 = circleMaker(svgEl);
	// const makeCircles2 = circleMaker(svgEl, 2, 0.02);
	// const makeCircles3 = circleMaker(svgEl, 0.04, 0.1);
	// const makeCircles4 = circleMaker(svgEl);
	// const makeRects = rectMaker(svgEl);
	// const makeRectsGPT = rectMakerGPT(svgEl, 0.018, 100)
	const updatePolyline = polylinerMaker(svgEl, )
	const gptMakers = [
		// rectMakerGPT(svgEl, 0.003, 90, 0, 1, 3),
		// rectMakerGPT(svgEl, 0.001, 110, 1),
		// rectMakerGPT(svgEl, -0.007, 70, 2),
		// rectMakerGPT(svgEl, 0.039, 140, 3),
	];
	
	let startTime = null;
	let animWindowStart = null;
	let currentTime = 0;
	
	const makeShapes = async (timestamp = 0) => {
		const delta = (timestamp - lastTime);
		lastTime = timestamp;
		frameWindow += delta;
		
		if (animState.isRunning && frameWindow > frameSize) {
			frameWindow = 0;
			
			animWindowStart = animWindowStart ? animWindowStart : timestamp
			currentTime = timestamp;
			const els = [...svgCanvas.querySelectorAll('circle')]
			const fps = frameRate(delta)
			fpsDisplay.textContent = `fps: ${fps}`;
			// shapeCount.textContent = `cnt: ${animState.renderedShapes.circle.length}`;
			shapeCount.textContent = `cnt: ${els.length}`;
			
			
			// console.warn('maker', maker)
			// let maker = gptMakers[makerArrayIndex]
			// console.warn('makerArrayIndex', makerArrayIndex)
			
			// makerArrayIndex = makerArrayIndex >= gptMakers.length - 1 ? 0 : makerArrayIndex + 1;
			// makerArrayIndex = maker ? makerArrayIndex + 1 : 0
			// await sleep(80)
			
			// maker(delta)
			
			// maker = gptMakers[makerArrayIndex]
			// await sleep(100)
			// maker(delta)
			
			if (animState.activeShapes.polyline) {
				updatePolyline(delta)
				const { x, y } = animState.lastPoint
				lastPointDisplay.textContent = `${Math.round(x)}, ${Math.round(y)}`
				
				if (animState.follow && currentTime - animWindowStart > 0) {
					viewport.setAttribute('transform', `translate(${(x)},${y})`)
				}
				
			}
			
			if (animState.activeShapes.circle) {
				makeCircles1(delta);
				if (currentTime - animWindowStart > 20) {
					
				}
				if (currentTime - animWindowStart > 60) {
					// makeCircles2(delta);
					// makeCircles3(delta);
					
				}
				if (currentTime - animWindowStart > 66) {
					
				}
				
				if (currentTime - animWindowStart > 120) {
					// makeCircles2(delta);
					
					// makeCircles4(delta);
					animWindowStart = currentTime
				}
			}
			else if (renderedShapes.circle.length) {
				renderedShapes.circle.shift().remove()
			}
			
			if (animState.activeShapes.rect) {
				// makeRects(delta);
			} else if (renderedShapes.rect.length) {
				renderedShapes.rect.shift().remove()
			}
			
			// svgCanvas.style.flip = flip
			// Object.assign(svgCanvas.style, getGradient());
		}
		
		const { filter: shouldFilter, gradient } = animState.background
		const { background, filter, flip } = getGradient()
		svgCanvas.style.background = gradient ? background : animState.background.defaultFill;
		svgCanvas.style.filter = shouldFilter ? filter : null;
		
		
		requestAnimationFrame(makeShapes);
	}
	
	return makeShapes;
};