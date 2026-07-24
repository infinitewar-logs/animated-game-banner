import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export class SecretBanner {
  constructor(isDarkMode = true) {
    this.isDarkMode = isDarkMode;
    this.isRevealed = false;
    this.bannerText = this.getBannerText();

    const geometry = new THREE.PlaneGeometry(3.6, 1.8);
    this.material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      map: this.createTexture(),
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(0, 2.8, 0);
  }

  getBannerText() {
    return this.isDarkMode
      ? "Good Night Sleep Well"
      : "Good Morning , Stay Bright";
  }

  createTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = this.isDarkMode ? "#0d1322" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 14;
    ctx.strokeStyle = this.isDarkMode ? "#00ffcc" : "#ff9900";
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    ctx.lineWidth = 6;
    ctx.strokeStyle = this.isDarkMode ? "#ffaa00" : "#27ae60";
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

    ctx.fillStyle = this.isDarkMode ? "#ffffff" : "#2c3e50";
    ctx.font = "900 52px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚡ SECRET UNLOCKED ⚡", canvas.width / 2, 130);

    ctx.fillStyle = this.isDarkMode ? "#00ffcc" : "#e67e22";
    ctx.font = "Bold 42px Arial, sans-serif";
    ctx.fillText(this.bannerText, canvas.width / 2, 260);

    ctx.fillStyle = this.isDarkMode ? "#ffaa00" : "#2980b9";
    ctx.font = "32px Arial, sans-serif";
    ctx.fillText("🤫 Only You & Me Know This!", canvas.width / 2, 370);

    return new THREE.CanvasTexture(canvas);
  }

  setMode(isDarkMode) {
    this.isDarkMode = isDarkMode;
    this.bannerText = this.getBannerText();
    this.updateTexture();
  }

  updateTexture() {
    if (this.material.map) {
      this.material.map.dispose();
    }
    this.material.map = this.createTexture();
    this.material.needsUpdate = true;
  }

  reveal() {
    this.isRevealed = true;
  }

  reset() {
    this.isRevealed = false;
    this.mesh.position.set(0, 2.8, 0);
    this.material.opacity = 0;
    this.setMode(this.isDarkMode);
  }

  animate() {
    if (!this.isRevealed) {
      return;
    }

    if (this.mesh.position.y < 4.8) {
      this.mesh.position.y += 0.05;
    }

    if (this.material.opacity < 1) {
      this.material.opacity = Math.min(1, this.material.opacity + 0.08);
    }

    this.mesh.position.y += Math.sin(performance.now() * 0.003) * 0.002;
    this.mesh.rotation.y = Math.sin(performance.now() * 0.001) * 0.05;
  }
}
