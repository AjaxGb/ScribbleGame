export default class AssetStore {
	constructor(assetType, pathPrefix, pathSuffix) {
		this.assetType = assetType;
		this.pathPrefix = pathPrefix;
		this.pathSuffix = pathSuffix;
		this.assets = Object.create(null);
		this.requests = Object.create(null);
	}
	
	getPath(name) {
		return this.pathPrefix + name + this.pathSuffix;
	}
	
	add(name, meta=null) {
		if (name in this.assets) {
			throw new Error(`${this.assetType.name} named "${name}" already added`);
		}
		const asset = new this.assetType(this.getPath(name), meta);
		this.assets[name] = asset;
		this.requests[name] = asset.request;
		return this;
	}
	
	addAll(names) {
		if (Array.isArray(names)) {
			for (const name of names) {
				this.add(name);
			}
		} else {
			for (const name in names) {
				this.add(name, names[name]);
			}
		}
		return this;
	}
	
	get(name) {
		return this.assets[name].data;
	}
	
	getAsset(name) {
		return this.assets[name];
	}
	
	allFinished() {
		return Promise.allSettled(Object.values(this.requests));
	}
}

class BaseAsset {
	constructor(path, meta) {
		this.path = path;
		this.meta = this.parseMeta(meta);
		this.state = 'loading';
		this.data = null;
		this.request = this.loadData(path);
		this.request.then(data => {
			this.state = 'loaded';
			this.data = data;
		}, err => {
			this.state = 'error';
			this.data = err;
		});
	}
	
	parseMeta(meta) {
		return meta;
	}
	
	loadData(path) {
		throw new Error('Called abstract method');
		return new Promise();
	}
	
	cancelLoad() { }
	
	reloadData() {
		this.cancelLoad();
		this.state = 'loading';
		this.request = this.loadData(`${this.path}#${Date.now()}`);
		this.request.then(data => {
			this.state = 'loaded';
			this.data = data;
		}, err => {
			this.state = 'error';
			this.data = err;
		});
	}
}

export class ImageAsset extends BaseAsset {
	loadData(path) {
		return new Promise((resolve, reject) => {
			const image = new Image();
			this.data = image;
			image.onload = () => resolve(image);
			image.onerror = () => reject(image);
			image.src = path;
		});
	}
}
