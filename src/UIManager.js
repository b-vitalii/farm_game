import * as PIXI from 'pixi.js';
import { camera, dropZonesMap, showObjects } from './main.js';
import { CardManager } from './managers/CardManager.js';
import { DropZoneManager } from './managers/DropZoneManager.js';
import { WinManager } from './managers/WinManager.js';
import { SmokeManager } from './managers/SmokeManager.js';
import { TutorialManager } from './managers/TutorialManager.js';
import { SoundButton } from './ui/SoundButton.js';
import { ToggleDayNightButton } from './ui/ToggleDayNightButton.js';
import { LoadingScreen } from './ui/LoadingScreen.js';
import { isIntersecting } from './utils/intersection.js';
import { uiConfig } from './data/uiConfig.js';

export class UIManager {
    constructor(toggleCallback) {
        this.toggleCallback = toggleCallback;
        this.app = new PIXI.Application();

        this.textures = null;
        this.dropZoneManager = null;
        this.cardManager = null;
        this.winManager = null;
        this.smokeManager = null;
        this.tutorialManager = null;
        this.soundButton = null;
        this.toggleButton = null;
        this.loadingScreen = null;

        window.addEventListener('resize', this._onResize.bind(this));
    }

    async init() {
        await this._initApp();
        await this._loadTextures();
        this._createManagers();
        this._setupUIElements();
        this._setupGameLogic();
        this._startLoadingAnimation();
        this.app.ticker.add(this._onTick.bind(this));
    }

    async _initApp() {
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
        });
        document.body.appendChild(this.app.canvas);
    }

    async _loadTextures() {
        this.textures = await PIXI.Assets.load(uiConfig.assetsToLoad);
    }

    _createManagers() {
        this.dropZoneManager = new DropZoneManager(dropZonesMap, camera, this.app.stage);
        this.winManager = new WinManager(this.app);
        this.smokeManager = new SmokeManager(this.app.stage, this.textures[uiConfig.textureKeys.smoke]);
    }

    _setupUIElements() {
        this.soundButton = new SoundButton({
            on: this.textures[uiConfig.textureKeys.soundOn],
            off: this.textures[uiConfig.textureKeys.soundOff],
        });
        this.app.stage.addChild(this.soundButton.getView());

        this.toggleButton = new ToggleDayNightButton(
            this.toggleCallback,
            () => this.soundButton.getMuted(),
            this.textures[uiConfig.textureKeys.cta]
        );
        this.app.stage.addChild(this.toggleButton.getView());
    }

    _setupGameLogic() {
        const interactiveObj = uiConfig.interactiveObjectsConfig.map(({ textureKey, type }) => ({
            texture: this.textures[uiConfig.textureKeys[textureKey]],
            type,
        }));

        this.cardManager = new CardManager({
            app: this.app,
            cardTexture: this.textures[uiConfig.textureKeys.card],
            interactiveObj,
            dropZoneManager: this.dropZoneManager,
            camera,
            showObjects,
            smokeManager: this.smokeManager,
            soundButton: this.soundButton,
            winManager: this.winManager,
            toggleButton: this.toggleButton
        });

        const draggableCards = this.cardManager.getCards();

        this.tutorialManager = new TutorialManager(
            this.app,
            draggableCards,
            this.dropZoneManager,
            this.textures[uiConfig.textureKeys.hand],
            this.textures[uiConfig.textureKeys.txtPanel]
        );

        this.cardManager.tutorialManager = this.tutorialManager;

        this.loadingScreen = new LoadingScreen(this.app, {
            ctaTexture: this.textures[uiConfig.textureKeys.cta],
            barBack: this.textures[uiConfig.textureKeys.barBack],
            progressFull: this.textures[uiConfig.textureKeys.progressFull],
        });
    }

    _startLoadingAnimation() {
        this.loadingScreen.playAnimation(() => {
            this.tutorialManager.startTutorial();
        });
    }

    _onTick() {
        if (!this.dropZoneManager || !this.cardManager) return;

        this.dropZoneManager.update();

        const draggingCard = this.cardManager.getDraggingCard();
        if (draggingCard) {
            const overlays = this.dropZoneManager.getOverlays(draggingCard.cardType);
            if (!overlays) return;

            overlays.forEach(({ graphic }) => this._updateOverlayColor(draggingCard, graphic));
        }
    }

    _updateOverlayColor(draggingCard, graphic) {
        if (graphic.visible && isIntersecting(draggingCard, graphic)) {
            graphic.clear();
            graphic.beginFill(0x00ff00, 0.5);
        } else {
            graphic.clear();
            graphic.beginFill(0xff0000, 0.5);
        }
        graphic.drawRoundedRect(-45, -45, 90, 90, 6);
        graphic.endFill();
    }

    _onResize() {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        if (this.loadingScreen) this.loadingScreen.resize(window.innerWidth, window.innerHeight);
    }
}
