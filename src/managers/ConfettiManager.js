import * as PIXI from 'pixi.js';

export class ConfettiManager {
    constructor(app) {
        this.app = app;
        this.confettiContainer = new PIXI.Container();
        this.app.stage.addChild(this.confettiContainer);

        this.confettiArray = [];
        this.confettiInterval = null;

        this.updateConfetti = this.updateConfetti.bind(this);
    }

    createConfetti() {
        const confetti = new PIXI.Graphics();
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.beginFill(color);
        const width = 4 + Math.random() * 4;
        const height = 8 + Math.random() * 8;
        confetti.drawRect(0, 0, width, height);
        confetti.endFill();

        confetti.x = Math.random() * window.innerWidth;
        confetti.y = -50 - Math.random() * 200;
        confetti.rotation = Math.random() * Math.PI;
        confetti.speedY = 1 + Math.random() * 2;
        confetti.rotationSpeed = (Math.random() - 0.5) * 0.1;

        this.confettiContainer.addChild(confetti);
        this.confettiArray.push(confetti);
    }

    startRain() {
        if (this.confettiInterval) return;

        this.confettiInterval = setInterval(() => {
            for (let i = 0; i < 8; i++) {
                this.createConfetti();
            }
        }, 150);

        this.app.ticker.add(this.updateConfetti);
    }

    stopRain() {
        clearInterval(this.confettiInterval);
        this.confettiInterval = null;
        this.app.ticker.remove(this.updateConfetti);
    }

    updateConfetti() {
        for (let i = this.confettiArray.length - 1; i >= 0; i--) {
            const c = this.confettiArray[i];
            c.y += c.speedY;
            c.rotation += c.rotationSpeed;

            if (c.y > window.innerHeight + 100) {
                this.confettiContainer.removeChild(c);
                this.confettiArray.splice(i, 1);
            }
        }
    }
}
