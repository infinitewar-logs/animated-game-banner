import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();
    this.lastFrameTime = performance.now();

    window.addEventListener("resize", () => this.onResize());
    this.onResize();
  }

  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 2.5, 7.5);
    camera.lookAt(0, 2.5, 0);
    return camera;
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  start(renderCallback) {
    const frame = (now) => {
      const delta = (now - this.lastFrameTime) / 1000;
      this.lastFrameTime = now;
      renderCallback(delta);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }
}
