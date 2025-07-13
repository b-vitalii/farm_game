import * as PIXI from 'pixi.js';

export class LoadingScreen {
    constructor(app, textures) {
        this.app = app;
        this.textures = textures;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.createOverlay();
        this.createLoadingContainer();
        this.centerLoadingContainer();
    }

    createOverlay() {
        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(0x000000, 1);
        this.overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        this.overlay.endFill();

        this.container.addChild(this.overlay);
    }

    createLoadingContainer() {
        const { barBack, progressFull } = this.textures;

        this.loadingContainer = new PIXI.Container();
        this.container.addChild(this.loadingContainer);

        this.addGameTitle();
        this.addLoadingText();
        this.addProgressBar(barBack, progressFull);
    }

    addGameTitle() {
        this.gameNameText = new PIXI.Text('Garden Makeover', new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fill: 0xff0000,
            stroke: '#ffffff',
            strokeThickness: 4,
        }));

        this.gameNameText.position.set(30, -120);
        this.loadingContainer.addChild(this.gameNameText);
    }

    addLoadingText() {
        this.loadText = new PIXI.Text('Loading', new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 22,
            fill: 0x5CE65C,
            stroke: '#000000',
            strokeThickness: 4,
        }));

        this.loadText.position.set(220, -20);
        this.loadingContainer.addChild(this.loadText);
    }

    addProgressBar(barBack, progressFull) {
        this.progressBg = new PIXI.Sprite(barBack);
        this.progressBg.position.set(50, 20);
        this.loadingContainer.addChild(this.progressBg);

        this.progressBar = new PIXI.Sprite(progressFull);
        this.progressBar.scale.set(0, 0.84);
        this.progressBar.position.set(63, 27);
        this.loadingContainer.addChild(this.progressBar);
    }

    centerLoadingContainer() {
        const centerX = window.innerWidth / 2 - this.progressBg.width / 2;
        const centerY = window.innerHeight / 2 - this.progressBg.height / 2;
        this.loadingContainer.position.set(centerX, centerY);
    }

    playAnimation(onComplete) {
        const baseScale = 0.93;

        gsap.to(this.progressBar.scale, {
            duration: 2,
            x: baseScale,
            ease: 'linear',
            onComplete: () => {
                this.container.removeChild(this.loadingContainer);

                gsap.to(this.overlay, {
                    duration: 0.5,
                    alpha: 0,
                    onComplete: () => {
                        this.app.stage.removeChild(this.container);
                        if (onComplete) onComplete();
                    },
                });
            },
        });
    }

    resize(width, height) {
        this.overlay.clear();
        this.overlay.beginFill(0x000000, 1);
        this.overlay.drawRect(0, 0, width, height);
        this.overlay.endFill();

        const centerX = width / 2 - this.progressBg.width / 2;
        const centerY = height / 2 - this.progressBg.height / 2;
        this.loadingContainer.position.set(centerX, centerY);
    }
}
