import { SceneManager } from "./core/SceneManager.js";
import { StateMachine, STATES } from "./core/StateMachine.js";
import { AssetManager } from "./managers/AssetManager.js";
import { ThemeManager } from "./managers/ThemeManager.js";
import { QuestionBlock } from "./components/QuestionBlock.js";
import { SecretBanner } from "./components/SecretBanner.js";
import { Character } from "./components/Character.js";
import { UIManager } from "./ui/UIManager.js";

const uiManager = new UIManager();
const sceneManager = new SceneManager();
const stateMachine = new StateMachine();
const themeManager = new ThemeManager(sceneManager.scene, uiManager);
const questionBlock = new QuestionBlock(themeManager.isDarkMode);
const secretBanner = new SecretBanner(themeManager.isDarkMode);
const character = new Character(sceneManager.scene);

sceneManager.scene.add(questionBlock.mesh);
sceneManager.scene.add(secretBanner.mesh);

let spacePresses = 0;
let shiftPressed = false;
let hintVisible = false;

themeManager.onThemeChanged((isDarkMode) => {
  questionBlock.setDarkMode(isDarkMode);
  secretBanner.setMode(isDarkMode);
  character.setTheme(isDarkMode ? "dark" : "happy");
});

const assetManager = new AssetManager((progress) => {
  uiManager.setLoadingProgress(progress);
});

// Relative path pointing to /src/gmodels/
const assetBaseUrl = new URL("./gmodels/", import.meta.url);
const modelUrls = {
  dark: new URL("mario.glb", assetBaseUrl).toString(),
  happy: new URL("marioBobble.glb", assetBaseUrl).toString(),
};

uiManager.showLoadingOverlay();
assetManager
  .loadModels(modelUrls)
  .then((models) => {
    character.setModels(models);
    character.setTheme(themeManager.isDarkMode ? "dark" : "happy");
  })
  .catch((err) => {
    console.error("Error loading 3D assets:", err);
  })
  .finally(() => {
    uiManager.hideLoadingOverlay();
  });

function resetScene() {
  spacePresses = 0;
  shiftPressed = false;
  uiManager.setSpaceCount(0);
  uiManager.setShiftStatus(false);
  questionBlock.reset();
  secretBanner.reset();
  character.reset();
  themeManager.applyTheme(themeManager.isDarkMode);
}

function handleJumpRequest() {
  if (stateMachine.isBusy()) return;
  if (spacePresses < 2 || !shiftPressed) return;

  const jumpCompleted = stateMachine.transition(STATES.JUMPING, () => {
    return new Promise((resolve) => {
      const started = character.startJump(() => {
        questionBlock.setUsed(true);
        secretBanner.reveal();
      }, resolve);

      if (!started) resolve();
    });
  });

  if (jumpCompleted) {
    spacePresses = 0;
    uiManager.setSpaceCount(0);
  }
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "t") {
    stateMachine.transition(STATES.SWITCHING_THEME, async () => {
      themeManager.toggleTheme();
      await new Promise((resolve) => setTimeout(resolve, 320));
    });
    return;
  }

  if (key === "v") {
    hintVisible = !hintVisible;
    uiManager.toggleHint();
    return;
  }

  if (key === "r") {
    resetScene();
    return;
  }

  if (event.code === "Space") {
    spacePresses += 1;
    uiManager.setSpaceCount(spacePresses);
    handleJumpRequest();
    return;
  }

  if (key === "shift") {
    shiftPressed = true;
    uiManager.setShiftStatus(true);
    handleJumpRequest();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key.toLowerCase() === "shift") {
    shiftPressed = false;
    uiManager.setShiftStatus(false);
  }
});

sceneManager.start((delta) => {
  questionBlock.animate(delta);
  secretBanner.animate(delta);
  character.update(delta);
});
