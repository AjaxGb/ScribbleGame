import { Eventor } from "./actor.js";

export default class Scene {
	constructor(name) {
		this.name = name;
		
		this.actors = Object.create(null);
		this.eventors = {};
	}
	
	addActor(actor) {
		if (actor.id in this.actors) {
			throw new Error(`Actor with id ${actor.id} already exists in scene`);
		}
		this.actors[actor.id] = actor;
		for (const eventType in actor.eventors) {
			const eventors = this.eventors[eventType] || (this.eventors[eventType] = Object.create(null));
			eventors[actor.id] = actor.eventors[eventType];
		}
	}
	
	removeActor(id) {
		const actor = this.actors[id];
		if (!actor) {
			throw new Error(`Actor with id ${actor.id} does not exist in scene`);
		}
		delete this.actors[id];
		for (const eventType in actor.eventors) {
			delete this.eventors[eventType][id];
		}
	}
	
	sendEvent(type, data) {
		const eventorObj = this.eventors[type];
		if (eventorObj) {
			const eventors = Object.values(eventorObj);
			eventors.sort(Eventor.sortCompare);
			for (const eventor of eventors) {
				eventor.callback.call(eventor.actor, data);
			}
		}
	}
}
