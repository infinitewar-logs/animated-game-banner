import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

export class UIManager {
  constructor() {
    this.createStyles();
    this.createHud();
    this.createLoadingOverlay();
  }

  createStyles() {
    const style = document.createElement("style");
    style.textContent = `
      body {
        margin: 0;
        overflow: hidden;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background-color: #05070f;
        color: #fff;
      }
      .hud-overlay {
        position: absolute;
        top: 18px;
        left: 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        z-index: 10;
      }
      .hud-badge {
        color: #00ffcc;
        background: rgba(10, 14, 26, 0.88);
        border: 1px solid #00ffcc;
        box-shadow: 0 0 16px rgba(0, 255, 204, 0.24);
        padding: 12px 16px;
        border-radius: 10px;
        font-size: 13px;
        line-height: 1.4;
      }
      .theme-badge {
        font-weight: 700;
      }
      .hint-box {
        display: none;
        max-width: 260px;
      }
      .controls-prompt {
        position: absolute;
        bottom: 16px;
        left: 18px;
        color: rgba(255, 255, 255, 0.82);
        font-size: 13px;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.45);
        padding: 8px 14px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 10;
      }
      .loading-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(3, 6, 14, 0.95);
        color: #ffffff;
        z-index: 100;
        opacity: 1;
        transition: opacity 0.35s ease;
      }
      .loading-overlay.hidden {
        opacity: 0;
        pointer-events: none;
      }
      .loading-panel {
        width: min(420px, calc(100vw - 40px));
        padding: 28px;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(10, 14, 26, 0.96);
        box-shadow: 0 0 48px rgba(0, 0, 0, 0.35);
      }
      .loading-title {
        margin: 0 0 14px;
        font-size: 18px;
        letter-spacing: 0.03em;
      }
      .loading-bar {
        width: 100%;
        height: 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
        margin-top: 14px;
      }
      .loading-fill {
        width: 0%;
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #00ffc8, #00a5ff);
        transition: width 0.25s ease;
      }
      .loading-label {
        margin-top: 12px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
      }
    `;
    document.head.appendChild(style);
  }

  createHud() {
    this.hudContainer = document.createElement("div");
    this.hudContainer.className = "hud-overlay";

    this.themeBadge = document.createElement("div");
    this.themeBadge.className = "hud-badge theme-badge";
    this.themeBadge.textContent = "MODE: DARK CYBERPUNK (mario.glb)";

    this.hintBox = document.createElement("div");
    this.hintBox.className = "hud-badge hint-box";
    this.hintBox.innerHTML = `🕹️ <strong>Secret Protocol:</strong><br>
      1. Press <strong>SPACE</strong> twice<br>
      2. Hold <strong>SHIFT</strong> to Super Jump!<br>
      3. Press <strong>R</strong> to Reset Box & Banner!<br>
      <small>Space Count: <span class="space-count">0</span> | Shift: <span class="shift-status">OFF</span></small>`;

    this.hudContainer.append(this.themeBadge, this.hintBox);
    document.body.appendChild(this.hudContainer);

    this.controlsPrompt = document.createElement("div");
    this.controlsPrompt.className = "controls-prompt";
    this.controlsPrompt.innerHTML = `Press [ <strong>T</strong> ] Toggle Theme & Banner | Press [ <strong>V</strong> ] Hints | Press [ <strong>R</strong> ] Reset`;
    document.body.appendChild(this.controlsPrompt);

    this.spaceCount = this.hintBox.querySelector(".space-count");
    this.shiftStatus = this.hintBox.querySelector(".shift-status");
  }

  createLoadingOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.className = "loading-overlay";

    const panel = document.createElement("div");
    panel.className = "loading-panel";

    const title = document.createElement("h2");
    title.className = "loading-title";
    title.textContent = "Preparing 3D Quest...";

    this.loadingBar = document.createElement("div");
    this.loadingBar.className = "loading-bar";

    this.loadingFill = document.createElement("div");
    this.loadingFill.className = "loading-fill";
    this.loadingBar.appendChild(this.loadingFill);

    this.loadingLabel = document.createElement("div");
    this.loadingLabel.className = "loading-label";
    this.loadingLabel.textContent = "Loading 0%";

    panel.append(title, this.loadingBar, this.loadingLabel);
    this.overlay.appendChild(panel);
    document.body.appendChild(this.overlay);
  }

  showLoadingOverlay() {
    this.overlay.classList.remove("hidden");
  }

  hideLoadingOverlay() {
    this.overlay.classList.add("hidden");
  }

  setLoadingProgress(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    this.loadingFill.style.width = `${clamped}%`;
    this.loadingLabel.textContent = `Loading ${clamped}%`;
  }

  setThemeBadge(label, isDarkMode) {
    this.themeBadge.textContent = `MODE: ${label}`;
    this.themeBadge.style.color = isDarkMode ? "#00ffcc" : "#ffaa00";
    this.themeBadge.style.borderColor = isDarkMode ? "#00ffcc" : "#ffaa00";
    this.themeBadge.style.boxShadow = isDarkMode
      ? "0 0 16px rgba(0, 255, 204, 0.24)"
      : "0 0 16px rgba(255, 170, 0, 0.25)";
  }

  setSpaceCount(value) {
    this.spaceCount.textContent = String(value);
  }

  setShiftStatus(isPressed) {
    this.shiftStatus.textContent = isPressed ? "ON" : "OFF";
  }

  toggleHint() {
    this.hintBox.style.display =
      this.hintBox.style.display === "block" ? "none" : "block";
  }
}
