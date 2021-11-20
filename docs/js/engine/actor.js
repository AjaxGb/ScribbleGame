export class Eventor {
	constructor(actor, data) {
		this.actor = actor;
		if (typeof data === 'function') {
			this.callback = data;
		} else {
			this.callback = data.callback;
			this.getPriority = data.getPriority || null;
		}
	}
	
	static sortCompare(a, b) {
		const pA = a.getPriority ? a.getPriority(a.actor) : Infinity;
		const pB = b.getPriority ? b.getPriority(b.actor) : Infinity;
		return pA - pB;
	}
}

export default class Actor {
	events = {
		draw: ({g, im}) => {
			g.drawImage(im.get('a'), this.x, this.y);
		}
	}
	
	constructor() {
		this.eventors = {};
		for (const eventType in this.events) {
			this.eventors[eventType] = new Eventor(this, this.events[eventType]);
		}
		this.id = 'f';
		this.x = 0;
		this.y = 0;
	}
}
