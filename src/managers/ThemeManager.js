import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

export class ThemeManager {
  constructor(scene, uiManager) {
    this.scene = scene;
    this.uiManager = uiManager;
    this.isDarkMode = true;
    this.listeners = [];

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.mainLight = new THREE.PointLight(0xffaa00, 2, 15);
    this.mainLight.position.set(0, 5, 3);
    this.rimLight = new THREE.DirectionalLight(0x00d2ff, 0.8);
    this.rimLight.position.set(-4, 6, 2);

    this.backgroundData = this.createCanvasTexture(512, 512);
    this.floorData = this.createCanvasTexture(512, 512);

    this.backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 20),
      new THREE.MeshBasicMaterial({ map: this.backgroundData.texture }),
    );
    this.backgroundMesh.position.set(0, 5, -8);

    this.floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshStandardMaterial({
        map: this.floorData.texture,
        roughness: 0.4,
      }),
    );
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = 0;
    this.floorMesh.receiveShadow = true;

    this.scene.add(this.ambientLight, this.mainLight, this.rimLight);
    this.scene.add(this.backgroundMesh, this.floorMesh);

    this.applyTheme(this.isDarkMode);
  }

  createCanvasTexture(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    return { canvas, ctx, texture };
  }

  onThemeChanged(callback) {
    this.listeners.push(callback);
  }

  notifyThemeChanged() {
    this.listeners.forEach((callback) => callback(this.isDarkMode));
  }

  applyTheme(isDarkMode) {
    this.isDarkMode = isDarkMode;
    document.body.style.backgroundColor = isDarkMode ? "#05070f" : "#5fa4e6";
    document.body.style.transition = "background-color 0.8s ease";

    if (isDarkMode) {
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 0.6;
      this.mainLight.color.setHex(0xffaa00);
      this.mainLight.intensity = 2;
      this.rimLight.color.setHex(0x00d2ff);

      this.drawDarkBackground();
      this.drawDarkFloor();

      this.uiManager.setThemeBadge("DARK CYBERPUNK (mario.glb)", true);
    } else {
      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 0.85;
      this.mainLight.color.setHex(0xfffaed);
      this.mainLight.intensity = 1.4;
      this.rimLight.color.setHex(0xffb732);

      this.drawHappyBackground();
      this.drawHappyFloor();

      this.uiManager.setThemeBadge("HAPPY KIDDISH (marioBobble.glb)", false);
    }

    this.backgroundData.texture.needsUpdate = true;
    this.floorData.texture.needsUpdate = true;
    this.notifyThemeChanged();
    return this.isDarkMode;
  }

  toggleTheme() {
    return this.applyTheme(!this.isDarkMode);
  }

  drawDarkBackground() {
    const ctx = this.backgroundData.ctx;
    const gradient = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
    gradient.addColorStop(0, "#1a1f3d");
    gradient.addColorStop(0.5, "#0b0e1e");
    gradient.addColorStop(1, "#030408");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  drawHappyBackground() {
    const ctx = this.backgroundData.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#4a90e2");
    gradient.addColorStop(0.4, "#5fa4e6");
    gradient.addColorStop(0.7, "#7cb5ec");
    gradient.addColorStop(1, "#b3e5fc");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  drawDarkFloor() {
    const ctx = this.floorData.ctx;
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, "#00ffcc");
    gradient.addColorStop(0.3, "#0d3b66");
    gradient.addColorStop(0.8, "#0d1117");
    gradient.addColorStop(1, "#05070f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  drawHappyFloor() {
    const ctx = this.floorData.ctx;
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, "#a8e6cf");
    gradient.addColorStop(0.35, "#56ab2f");
    gradient.addColorStop(0.75, "#388e3c");
    gradient.addColorStop(1, "#2e7d32");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }
}
