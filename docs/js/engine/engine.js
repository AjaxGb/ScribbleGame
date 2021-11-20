import AssetStore, { ImageAsset } from "./assetstore.js";

export default class ScribbleEngine {
	constructor({
		canvas,
	}) {
		this.canvas = canvas;
		this.g = canvas.getContext('2d', { alpha: false });
		
		this.images = new AssetStore(ImageAsset, 'assets/im/', '.png');
		
		this.scenes = Object.create(null);
		this.currScenes = [];
		
		this.drawLoopId = null;
		this.lastDrawTime = -1;
		
		this.onDraw = this.onDraw.bind(this);
	}
	
	async start(setup) {
		await this.images.allFinished();
		await setup(this);
		this.#enableDraw();
	}
	
	#enableDraw() {
		if (this.drawLoopId === null) {
			this.lastDrawTime = -1;
			this.drawLoopId = requestAnimationFrame(this.onDraw);
			return true;
		} else {
			return false;
		}
	}
	
	#disableDraw() {
		if (this.drawLoopId !== null) {
			cancelAnimationFrame(this.drawLoopId);
			this.drawLoopId = null;
			return true;
		} else {
			return false;
		}
	}
	
	onDraw(now) {
		const delta = (this.lastDrawTime < 0)
			? 0
			: (now - this.lastDrawTime) / 1000;
		this.lastDrawTime = now;
		this.drawLoopId = requestAnimationFrame(this.onDraw);
		
		this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		for (const sceneName of this.currScenes) {
			this.scenes[sceneName].sendEvent('draw', {
				engine: this,
				g: this.g,
				im: this.images,
				now, delta,
			});
		}
	}
}
