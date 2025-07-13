import * as PIXI from 'pixi.js';
import { music, clickSound, muteAll } from '../managers/soundManager.js';

export class SoundButton {
    constructor(textures, position = { x: 270, y: 20 }) {
        this.isMuted = true;
        this.hasStarted = false;
        this.position = position;
        this.textures = textures;

        this.createContainer();
        this.createSprites();
        this.setInitialState();
        this.addListeners();
    }

    createContainer() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;
    }

    createSprites() {
        this.spriteOn = new PIXI.Sprite(this.textures.on);
        this.spriteOff = new PIXI.Sprite(this.textures.off);

        const scale = 0.13;
        this.spriteOn.scale.set(scale);
        this.spriteOff.scale.set(scale);

        this.spriteOn.position.set(this.position.x, this.position.y);
        this.spriteOff.position.set(this.position.x, this.position.y);

        this.container.addChild(this.spriteOn, this.spriteOff);
    }

    setInitialState() {
        this.spriteOn.visible = false;
        this.spriteOff.visible = true;
    }

    addListeners() {
        this.container.on('pointerdown', () => this.toggle());
    }

    toggle() {
        if (!this.hasStarted) {
            music.play();
            this.hasStarted = true;
        }

        this.isMuted = !this.isMuted;
        muteAll(this.isMuted);

        this.spriteOn.visible = !this.isMuted;
        this.spriteOff.visible = this.isMuted;

        if (!this.isMuted) {
            clickSound.play();
        }
    }

    setMuted(value) {
        this.isMuted = value;
        muteAll(this.isMuted);

        this.spriteOn.visible = !this.isMuted;
        this.spriteOff.visible = this.isMuted;
    }

    getMuted() {
        return this.isMuted;
    }

    getView() {
        return this.container;
    }

    hide() {
        this.container.visible = false;
    }
}
