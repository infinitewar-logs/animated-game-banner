import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

export class Character {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.models = {
      dark: null,
      happy: null,
    };

    this.activeTheme = "dark";
    this.isJumping = false;
    this.jumpProgress = 0;
    this.hasRevealed = false;
    this.onReveal = null;
    this.onComplete = null;
  }

  setModels(models) {
    // Check if models exist, else create fallbacks
    this.models.dark = models.dark || this.createFallback("dark");
    this.models.happy = models.happy || this.createFallback("happy");

    // Auto-scale & Re-center BOTH loaded GLTF models perfectly
    this.normalizeModel(this.models.dark);
    this.normalizeModel(this.models.happy);

    this.setTheme(this.activeTheme);
  }

  createFallback(theme) {
    const fallbackGroup = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.7, 0.4),
      new THREE.MeshStandardMaterial({
        color: theme === "dark" ? 0x00d2ff : 0xe74c3c,
      }),
    );
    body.position.y = 0.35;

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xffcc99 }),
    );
    head.position.y = 0.85;

    fallbackGroup.add(body, head);
    return fallbackGroup;
  }

  normalizeModel(model) {
    if (!model) return;

    // Reset transform matrix
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    model.updateMatrixWorld(true);

    // Calculate original bounding box
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());

    // Scale to fixed height (1.4 units)
    const targetHeight = 1.4;
    const scale = targetHeight / (size.y || 1);
    model.scale.set(scale, scale, scale);
    model.updateMatrixWorld(true);

    // Re-calculate box post scaling
    const scaledBox = new THREE.Box3().setFromObject(model);
    const center = scaledBox.getCenter(new THREE.Vector3());

    // Recenter X & Z, and rest feet on ground Y = 0
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= scaledBox.min.y;

    // Enable shadows & visibility across all mesh nodes
    model.traverse((child) => {
      if (child.isMesh) {
        child.visible = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  setTheme(themeKey) {
    this.activeTheme = themeKey;
    this.updateModel();
  }

  updateModel() {
    // Clear previous model from group
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }

    const nextModel = this.models[this.activeTheme];
    if (nextModel) {
      nextModel.visible = true;
      nextModel.traverse((child) => {
        if (child.isMesh) child.visible = true;
      });
      this.group.add(nextModel);
    }
  }

  startJump(onReveal, onComplete) {
    if (this.isJumping) return false;

    this.isJumping = true;
    this.jumpProgress = 0;
    this.hasRevealed = false;
    this.onReveal = onReveal;
    this.onComplete = onComplete;
    return true;
  }

  update(delta) {
    if (!this.isJumping) return;

    this.jumpProgress += delta * 1.8;
    const progress = Math.min(this.jumpProgress, 1);
    const jumpHeight = Math.sin(progress * Math.PI) * 2.2;
    this.group.position.y = jumpHeight;

    if (!this.hasRevealed && this.jumpProgress >= 0.48) {
      this.hasRevealed = true;
      this.onReveal?.();
    }

    if (this.jumpProgress >= 1) {
      this.isJumping = false;
      this.group.position.y = 0;
      this.onComplete?.();
    }
  }

  reset() {
    this.isJumping = false;
    this.jumpProgress = 0;
    this.group.position.set(0, 0, 0);
  }
}
