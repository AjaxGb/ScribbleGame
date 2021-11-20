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

export class ImageAsset {
	constructor(path, meta) {
		const image = new Image();
		this.data = image;
		this.meta = meta;
		this.state = 'loading';
		this.request = new Promise((resolve, reject) => {
			image.onload = () => {
				this.state = 'loaded';
				resolve(image);
			};
			image.onerror = err => {
				this.state = 'error';
				reject(err);
			}
		});
		image.src = path;
	}
}
