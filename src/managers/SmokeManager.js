import * as PIXI from 'pixi.js';

export class SmokeManager {
    constructor(stage, smokeTexture) {
        this.stage = stage;
        this.smokeTexture = smokeTexture;
    }

    createSmokeParticles(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const smoke = new PIXI.Sprite(this.smokeTexture);
            smoke.anchor.set(0.5);
            smoke.alpha = 0.8;
            smoke.scale.set(0);

            const offsetX = (Math.random() - 0.5) * 200;
            const offsetY = (Math.random() - 0.5) * 220;
            smoke.x = x + offsetX;
            smoke.y = y + offsetY;

            this.stage.addChild(smoke);

            const targetScale = 1.4 + Math.random() * 0.5;
            const moveX = (Math.random() - 0.5) * 120;
            const moveY = (Math.random() - 0.5) * 120;
            const duration = 1.4 + Math.random() * 0.4;

            gsap.to(smoke.scale, {
                x: targetScale,
                y: targetScale,
                duration: duration * 0.5,
                ease: "power2.out"
            });

            gsap.to(smoke, {
                x: smoke.x + moveX,
                y: smoke.y + moveY,
                alpha: 0,
                duration,
                ease: "power1.out",
                onComplete: () => {
                    this.stage.removeChild(smoke);
                }
            });
        }
    }
}
