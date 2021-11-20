import Actor from "./js/engine/actor.js";
import ScribbleEngine from "./js/engine/engine.js";
import Scene from "./js/engine/scene.js";

const engine = new ScribbleEngine({
	canvas: document.getElementById('canvas'),
});
window.engine = engine;

engine.images.add('a').add('b');

engine.start(async e => {
	const x = new Scene('x');
	
	x.addActor(new Actor());
	
	e.scenes['x'] = x;
	e.currScenes = ['x'];
});
