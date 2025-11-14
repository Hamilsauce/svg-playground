// const updaters = [circleRadius, rectX, rectOpacity];
const state = {
	running: true,
	updaters: [],
}

export const runModulation = () => {
	if (state.running) state.updaters.forEach(update => update());
	
	requestAnimationFrame(runModulation);
	// return () => {
	// 	state.running = !state.running
	// }
}

// const initRunner = () => {

// 	updaters.forEach(update => update());
// 	requestAnimationFrame(animate);

// 	return () => {
// 		state.running = !state.running

// 	}
// }


/*-------------------------
  1.  Basic modulators
--------------------------*/
function* sineLFO({ freq = 1, amp = 1, offset = 0 } = {}) {
	const TWO_PI = Math.PI * 2;
	let t = 0;
	
	while (true) {
		yield offset + Math.sin(t * TWO_PI * freq) * amp;
		t += 1 / 60;
	}
}

function* randomWalk({ step = 0.02, amp = 1, offset = 0 } = {}) {
	let value = offset;
	
	while (true) {
		value += (Math.random() - 0.5) * step;
		value = Math.max(-amp, Math.min(amp, value));
		yield value;
	}
}

/*-------------------------
  2.  Binding logic
--------------------------*/
const bind = (generator, element, attr, transform = v => v) => {
	return () => {
		const { value } = generator.next();
		element.setAttribute(attr, transform(value));
	};
}

/*-------------------------
  3.  Setup scene
--------------------------*/
const circle = document.querySelector('#circle');
const rect = document.querySelector('#rect');

const circleRadius = bind(
	sineLFO({ freq: 0.25, amp: 20, offset: 50 }),
	circle,
	'r',
	v => v.toFixed(2)
);

const rectX = bind(
	randomWalk({ step: 0.1, amp: 40, offset: 100 }),
	rect,
	'x',
	v => 150 + v
);

export const opacityLFO = (el, valueCallback) => {
	const attached = bind(
		sineLFO({ freq: 0.5, amp: 0.3, offset: 0.5 }),
		el,
		'opacity'
	);
	
	state.updaters.push(attached)
}

export const randomCircleWalker = (el, cb) => {
	const attached = bind(
		sineLFO({ freq: 0.25, amp: 20, offset: 50 }),
		el,
		'r',
		cb
	);
	
	state.updaters.push(attached)
}

/*-------------------------
  4.  Animation clock
--------------------------*/

// animate();