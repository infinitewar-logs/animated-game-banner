import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

export class QuestionBlock {
  constructor(isDarkMode = true) {
    this.isDarkMode = isDarkMode;
    this.isUsed = false;

    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    this.material = new THREE.MeshStandardMaterial({
      roughness: 0.25,
      metalness: 0.1,
      map: this.createTexture(),
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(0, 2.8, 0);
    this.mesh.castShadow = true;
  }

  createTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const baseColor = this.isUsed
      ? "#444455"
      : this.isDarkMode
        ? "#ffaa00"
        : "#f39c12";
    const accentColor = this.isUsed
      ? "#222233"
      : this.isDarkMode
        ? "#804000"
        : "#d35400";
    const rivetColor = this.isUsed
      ? "#222233"
      : this.isDarkMode
        ? "#552800"
        : "#7f8c8d";

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 32;
    ctx.strokeStyle = accentColor;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

    ctx.fillStyle = rivetColor;
    [
      [45, 45],
      [467, 45],
      [45, 467],
      [467, 467],
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!this.isUsed) {
      ctx.font = "900 320px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.lineWidth = 18;
      ctx.strokeStyle = this.isDarkMode ? "#4a2500" : "#6e2c00";
      ctx.strokeText("?", canvas.width / 2, canvas.height / 2);

      ctx.fillStyle = "#ffffff";
      ctx.fillText("?", canvas.width / 2, canvas.height / 2);
    }

    return new THREE.CanvasTexture(canvas);
  }

  updateTexture() {
    if (this.material.map) {
      this.material.map.dispose();
    }
    this.material.map = this.createTexture();
    this.material.needsUpdate = true;
  }

  setDarkMode(isDarkMode) {
    this.isDarkMode = isDarkMode;
    this.updateTexture();
  }

  setUsed(isUsed) {
    this.isUsed = isUsed;
    this.updateTexture();
  }

  animate() {
    this.mesh.rotation.y += 0.015;
  }

  reset() {
    this.isUsed = false;
    this.mesh.position.set(0, 2.8, 0);
    this.updateTexture();
  }
}
