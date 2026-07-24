import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";

export class AssetManager {
  constructor(onProgress = () => {}) {
    this.onProgress = onProgress;
    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      if (itemsTotal === 0) {
        return;
      }
      const percent = Math.round((itemsLoaded / itemsTotal) * 100);
      this.onProgress(percent);
    };
    this.manager.onLoad = () => {
      this.onProgress(100);
    };
    this.manager.onError = (url) => {
      console.warn("Asset failed to load:", url);
    };

    this.loader = new GLTFLoader(this.manager);
    this.onProgress(0);
  }

  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        (error) => reject(error),
      );
    });
  }

  async loadModels(modelMap) {
    const loaders = Object.entries(modelMap).map(async ([key, url]) => {
      try {
        const scene = await this.loadModel(url);
        console.log(`Loaded GLTF model [${key}] from: ${url}`);
        return [key, scene];
      } catch (error) {
        console.warn(`Loading failed for ${url}:`, error);
        return [key, null];
      }
    });

    const loadedEntries = await Promise.all(loaders);
    return Object.fromEntries(loadedEntries);
  }
}
