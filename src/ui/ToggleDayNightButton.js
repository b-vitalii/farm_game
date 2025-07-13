import * as PIXI from 'pixi.js';
import { clickSound } from '../managers/soundManager.js';

export class ToggleDayNightButton {
    constructor(toggleCallback, isMutedCallback, texture, position = { x: 50, y: 20 }) {
        this.toggleCallback = toggleCallback;
        this.isMutedCallback = isMutedCallback;
        this.textureCta = texture;
        this.positionCta = position;

        this.addCta();
        this.addText();
        this.addListeners();
    }

    addCta() {
        this.container = new PIXI.Container();

        this.sprite = new PIXI.Sprite(this.textureCta);
        this.sprite.scale.set(0.4);
        this.sprite.position.set(0, 0);
        this.container.addChild(this.sprite);

        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.position.set(this.positionCta.x, this.positionCta.y);
    }

    addText() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 26,
            fill: 0x000000,
            stroke: '#ffffff',
            strokeThickness: 4,
        });

        const text = new PIXI.Text('Day/Night', style);
        text.position.set(42, 14);

        this.container.addChild(text);
    }

    addListeners() {
        this.container.on('pointerdown', () => {
            if (!this.isMutedCallback()) clickSound.play();

            if (this.toggleCallback) this.toggleCallback();

            gsap.to(this.container.scale, {
                duration: 0.05,
                x: 0.98,
                y: 0.98,
                ease: "linear",
                yoyo: true,
                repeat: 1,
            });
        });
    }

    getView() {
        return this.container;
    }

    hide() {
        this.container.visible = false;
    }
}
