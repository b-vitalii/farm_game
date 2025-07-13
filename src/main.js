import { SceneManager } from './managers/SceneManager.js';
import { AssetLoader } from './managers/AssetLoader.js';
import { DayNightManager } from './managers/DayNightManager.js';
import { UIManager } from './UIManager.js';
import { SceneObjectsManager } from './managers/SceneObjectsManager.js';

import { dropZonesMap, showObjects } from './data/ObjectCollections.js';

export class App {
    constructor() {
        this.mixers = [];
        this.sceneManager = new SceneManager(document.body, this.mixers);

        this.scene = this.sceneManager.scene;
        this.camera = this.sceneManager.camera;
        this.renderer = this.sceneManager.renderer;
        this.directionalLight = this.sceneManager.directionalLight;
        this.ambientLight = this.sceneManager.ambientLight;

        this.assetLoader = new AssetLoader(this.sceneManager);

        this.dayNightManager = new DayNightManager({
            scene: this.scene,
            directionalLight: this.directionalLight,
            ambientLight: this.ambientLight,
        });

        this.sceneObjectsManager = new SceneObjectsManager(this.scene, this.mixers);

        this.uiManager = null;
    }

    async init() {
        await this.assetLoader.loadGroundModel();
        await this.sceneObjectsManager.loadObjects();
        this.sceneObjectsManager.hideAllObjects();

        this.initUI();

        this.renderer.domElement.style.visibility = 'visible';

        this.sceneManager.renderLoop();
    }

    initUI() {
        this.uiManager = new UIManager(() => this.toggleDayNight());
        this.uiManager.init();
    }

    toggleDayNight() {
        this.dayNightManager.toggle();
    }
}

const app = new App();
await app.init();

export const camera = app.camera;
export const renderer = app.renderer;
export { dropZonesMap, showObjects };