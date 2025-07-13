import * as PIXI from 'pixi.js';
import { ConfettiManager } from './ConfettiManager.js';
import { tadaED, bounceFromED } from '../utils/uiAnimations.js';
import { popupChestSound } from './soundManager.js';

export class WinManager {
    constructor(app) {
        this.app = app;

        this.winContainer = new PIXI.Container();
        this.winContainer.visible = false;
        this.winContainer.alpha = 0;
        this.app.stage.addChild(this.winContainer);

        this._createOverlay();
        this._createWinText();
        this._createCTA();

        this.confettiManager = null;

        window.addEventListener('resize', () => this.onResize());
    }

    _createOverlay() {
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.8);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();
        this.winContainer.addChild(overlay);
    }

    _createWinText() {
        this.winText = new PIXI.Text('YOU WIN', this._getWinTextStyle());
        this.winText.anchor.set(0.5);
        this._centerDisplayObject(this.winText);
        this.winContainer.addChild(this.winText);
    }

    _createCTA() {
        this.winCtaContainer = new PIXI.Container();
        this.winCtaContainer.position.set(window.innerWidth / 2, window.innerHeight / 2 + 60);
        this.winCtaContainer.visible = false;
        this.app.stage.addChild(this.winCtaContainer);

        const ctaTexture = PIXI.Assets.get('/images/cta.png');
        const ctaSprite = new PIXI.Sprite(ctaTexture);
        ctaSprite.scale.set(0.4);
        ctaSprite.position.set(-100, 0);
        this.winCtaContainer.addChild(ctaSprite);

        const downloadText = new PIXI.Text('DOWNLOAD', this._getCtaTextStyle());
        downloadText.anchor.set(0.5);
        downloadText.y = 32;
        this.winCtaContainer.addChild(downloadText);
    }

    showWin(isMuted = false) {
        if (!isMuted) {
            popupChestSound.play();
        }

        this.winContainer.visible = true;

        gsap.to(this.winContainer, {
            duration: 1,
            alpha: 1,
            ease: 'linear',
            onComplete: () => {
                tadaED(this.winText);

                if (!this.confettiManager) {
                    this.confettiManager = new ConfettiManager(this.app);
                }
                this.confettiManager.startRain();

                this.winCtaContainer.visible = true;
                bounceFromED(this.winCtaContainer);
            },
        });
    }

    _getWinTextStyle() {
        return new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 70,
            fill: 0xff0000,
            stroke: '#000000',
            strokeThickness: 4,
            fontWeight: '600',
        });
    }

    _getCtaTextStyle() {
        return new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0x000000,
            stroke: '#ffffff',
            strokeThickness: 4,
            fontWeight: '600',
        });
    }

    _centerDisplayObject(displayObject) {
        displayObject.x = window.innerWidth / 2;
        displayObject.y = window.innerHeight / 2;
    }

    onResize() {
        const overlay = this.winContainer.getChildAt(0); // припускаю, що overlay — перший дитина
        overlay.clear();
        overlay.beginFill(0x000000, 0.8);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();

        this._centerDisplayObject(this.winText);

        this.winCtaContainer.position.set(window.innerWidth / 2, window.innerHeight / 2 + 60);
    }
}
