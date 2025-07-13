import * as PIXI from 'pixi.js';

export class TutorialManager {
    constructor(app, draggableCards, dropZoneOverlays, handTexture, txtPanel) {
        this.app = app;
        this.draggableCards = draggableCards;
        this.dropZoneOverlays = dropZoneOverlays;
        this.txtPanel = txtPanel;

        this.createPanel();

        this.handSprite = new PIXI.Sprite(handTexture);
        this.handSprite.anchor.set(0.5);
        this.handSprite.scale.set(0.7);
        this.handSprite.alpha = 0;
        this.app.stage.addChild(this.handSprite);

        this.tutorialTimeline = null;

        window.addEventListener('resize', () => this.onResize());
        this.onResize();
    }

    startTutorial() {
        const cornCard = this.draggableCards.find(c => c.cardType === 'corn');
        if (!cornCard) return;

        this.showTutorPanel();

        const fromX = cornCard.x + cornCard.width / 2;
        const fromY = cornCard.y + cornCard.height / 2;

        const cornOverlay = this.dropZoneOverlays.getOverlays('corn')?.[0];
        if (!cornOverlay) return;

        const toX = cornOverlay.graphic.position.x;
        const toY = cornOverlay.graphic.position.y;

        this.handSprite.visible = true;
        this.handSprite.alpha = 1;
        this.handSprite.scale.set(0.7);
        this.handSprite.position.set(fromX + 40, fromY + 40);

        this.tutorialTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });

        this.tutorialTimeline.to(this.handSprite.scale, {
            x: 0.6,
            y: 0.6,
            duration: 0.2,
            ease: "power1.inOut",
            onStart: () => {
                cornOverlay.graphic.clear();
                cornOverlay.graphic.beginFill(0x00ff00, 0.5);
                cornOverlay.graphic.drawRoundedRect(-45, -45, 90, 90, 6);
                cornOverlay.graphic.endFill();
                cornOverlay.graphic.visible = true;
            }
        });

        this.tutorialTimeline.to(this.handSprite, {
            x: toX + 50,
            y: toY + 50,
            duration: 1,
            ease: "power2.inOut"
        });

        this.tutorialTimeline.to(this.handSprite.scale, {
            x: 0.7,
            y: 0.7,
            duration: 0.2,
            ease: "power1.out",
            onStart: () => {
                cornOverlay.graphic.clear();
                cornOverlay.graphic.beginFill(0xff0000, 0.5);
                cornOverlay.graphic.drawRoundedRect(-45, -45, 90, 90, 6);
                cornOverlay.graphic.endFill();
                cornOverlay.graphic.visible = false;
            }
        });

        this.tutorialTimeline.to(this.handSprite, {
            alpha: 0,
            duration: 0.4,
            onComplete: () => {
                this.handSprite.alpha = 1;
                this.handSprite.position.set(fromX + 40, fromY + 40);
            }
        });
    }

    createPanel() {
        this.txtPanelContainer = new PIXI.Container();
        this.app.stage.addChild(this.txtPanelContainer);
        this.txtPanelContainer.visible = false;
        this.txtPanelContainer.alpha = 0;

        const txtPanelSprite = new PIXI.Sprite(this.txtPanel);
        txtPanelSprite.anchor.set(0.5);
        txtPanelSprite.scale.set(1);
        // txtPanelSprite.alpha = 0;
        this.txtPanelContainer.addChild(txtPanelSprite);
        this.txtPanelContainer.position.set(500, window.innerHeight - 300)

        const tutorTxt = new PIXI.Text({
            text: 'Power Up the Farm!\nDrag the selected one\nto the desired area.',
            style: new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 35,
                fill: 0x000000,
                stroke: '#000000',
                strokeWidth: 4,
                fontWeight: 600,
                align: 'center'
            }),
        });
        tutorTxt.anchor.set(0.5);
        this.txtPanelContainer.addChild(tutorTxt);
    }

    showTutorPanel() {
        this.txtPanelContainer.visible = true;
        gsap.to(this.txtPanelContainer, {
            duration: 0.3,
            alpha: 1,
            ease: "linear",
        });
    }

    stopTutorial() {
        if (this.tutorialTimeline) {
            this.tutorialTimeline.kill();
            this.tutorialTimeline = null;
        }
        this.handSprite.visible = false;
        this.txtPanelContainer.visible = false;
    }

    onResize() {
        if (this.tutorialTimeline && this.handSprite.visible) {
            this.tutorialTimeline.kill();
            this.tutorialTimeline = null;
            this.startTutorial()
        }
        this.txtPanelContainer.position.set(window.innerWidth / 2 + 60, window.innerHeight - 220);

    }
}
