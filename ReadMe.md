# 🎮 3D Quest: Interactive Mario Environment

An interactive 3D WebGL experience built with **Three.js** featuring dynamic lighting, procedural gradient environments, high-contrast texturing, and dual character/banner state toggles.

---

## 🌟 Key Features & Updates

### 1. Dynamic Mode & Character Swapping (`T` Key)

- **Model Switch:** Smoothly toggles between `mario.glb` _(Dark Cyberpunk Vibe)_ and `marioBobble.glb` _(Happy Kiddish Vibe)_ using `THREE.Box3()` for seamless auto-scaling and bounding alignment.
- **Environment & Gradient Blending:**
  - **Dark Cyberpunk Mode:** Deep space radial backdrop, glowing neon cyan floor, deep blue rim lighting, and high-contrast ambient glow.
  - **Happy Kiddish Mode:** Soft multi-stop linear sky gradient (`#4a90e2` to `#b3e5fc`) merging naturally into a lush, radial green grass floor with warm sunlight.

### 2. Mode-Specific Dynamic Secret Banner

Hit the Question Block to trigger the floating secret banner. The high-resolution canvas text dynamically adapts depending on the active theme:

- **Dark Cyberpunk Mode:** _"Good Night Sleep Well"_ 🌙
- **Happy Kiddish Mode:** _"Good morning , Stay Bright"_ ☀️

### 3. Secret Super Jump Protocol

- **Interactive Combo:** Double press **`SPACE`**, hold **`SHIFT`**, and launch Mario into a Super Jump!
- **Question Block Collision:** Mario hits the overhead `?` block, switching its texture to an "activated" state and releasing the floating Secret Banner into the sky.

---

## 🕹️ Controls & Hotkeys

| Hotkey                     | Action                                                       |
| :------------------------- | :----------------------------------------------------------- |
| **`T`**                    | Toggle Theme Mode & Secret Banner Text                       |
| **`V`**                    | Toggle On-Screen Hint Box                                    |
| **`R`**                    | Instant Reset (Resets Block, Mario Position & Secret Banner) |
| **`SPACE` (x2) + `SHIFT`** | Execute Super Jump to unlock the Secret Banner               |

---

## 🚀 Git & GitHub Workflow

### 1. Repository Setup & Initial Commit

```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_REPO_NAME>

# Add base files and initial commit
git add .
git commit -m "feat: base foundation for static/roaming objects and hint logic"
git push origin main
```
