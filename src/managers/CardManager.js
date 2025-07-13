import * as PIXI from 'pixi.js';
import { animateDropTarget } from '../utils/uiAnimations.js';
import { clickSound, cowSound, sheepSound, chickenSound, throwSpearSound } from './soundManager.js';
import { showObjects } from "../data/ObjectCollections";
import { isIntersecting } from '../utils/intersection.js';

export class CardManager {
    constructor(options) {
        this.app = options.app;
        this.cardTexture = options.cardTexture;
        this.interactiveObj = options.interactiveObj;
        this.dropZoneManager = options.dropZoneManager;
        this.camera = options.camera;
        this.showObjects = options.showObjects;
        this.smokeManager = options.smokeManager;
        this.tutorialManager = options.tutorialManager;
        this.soundButton = options.soundButton;
        this.winManager = options.winManager;
        this.toggleButton = options.toggleButton;

        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        this._attachGlobalEvents();

        this.cards = [];
        this.cardStartPositions = [];
        this.draggingCard = null;

        this._createCards();

        window.addEventListener('resize', () => this.onResize());

        this.onResize();
    }

    _attachGlobalEvents() {
        this.app.stage.on('pointermove', (event) => {
            if (!this.draggingCard) return;

            const pos = event.data.getLocalPosition(this.draggingCard.parent);
            const dragOffset = this.draggingCard._dragOffset;

            this.draggingCard.x = pos.x - dragOffset.x;
            this.draggingCard.y = pos.y - dragOffset.y;
        });
    }

    _createCards() {
        for (let i = 0; i < this.interactiveObj.length; i++) {
            const data = this.interactiveObj[i];

            const container = new PIXI.Container();
            container.cardType = data.type;

            const card = new PIXI.Sprite(this.cardTexture);
            card.scale.set(0.5);

            const icon = new PIXI.Sprite(data.texture);
            icon.anchor.set(0.5);
            icon.scale.set(0.25);
            icon.x = card.width / 2;
            icon.y = card.height / 2;

            container.addChild(card);
            container.addChild(icon);

            container.x = 100 + i * 100;
            container.y = window.innerHeight - 130;

            this.cardStartPositions.push({ x: container.x, y: container.y });

            container.interactive = true;
            container.buttonMode = true;
            container.eventMode = 'static';

            this._attachEvents(container, i);
            this.cards.push(container);
            this.app.stage.addChild(container);
        }
    }

    _attachEvents(container, index) {
        let dragging = false;
        let dragOffset = { x: 0, y: 0 };
        container._dragOffset = dragOffset;

        container.on('pointerdown', (event) => {
            dragging = true;
            this._onPointerDown(container, event);
        });

        container.on('pointerup', () => {
            dragging = false;
            this._onPointerUp(container, index);
        });

        container.on('pointerupoutside', () => {
            dragging = false;
            this._onPointerUpOutside(container, index);
        });

        // container.on('pointermove', (event) => {
        //     if (!dragging) return;
        //     this._onPointerMove(container, event, dragOffset);
        // });
    }

    _onPointerDown(container, event) {
        if (this.tutorialManager) this.tutorialManager.stopTutorial();

        container.alpha = 0.7;
        this.draggingCard = container;

        if (!this.soundButton.getMuted()) clickSound.play();

        this._showDropOverlays(container.cardType);
        container.parent.addChild(container);

        const pos = event.data.getLocalPosition(container.parent);
        container._dragOffset.x = pos.x - container.x;
        container._dragOffset.y = pos.y - container.y;
    }

    _onPointerUp(container, index) {
        container.alpha = 1;
        this.draggingCard = null;

        const overlays = this.dropZoneManager.getOverlays(container.cardType);
        let dropped = false;

        for (const { graphic, target } of overlays) {
            if (graphic.visible && isIntersecting(container, graphic)) {
                animateDropTarget(target);

                if (!this.soundButton.getMuted()) {
                    switch (target.name) {
                        case 'cow_1':
                            cowSound.play();
                            break;
                        case 'sheep_1':
                            sheepSound.play();
                            break;
                        case 'chicken_1':
                            chickenSound.play();
                            break;
                        default:
                            if (['corn_1', 'tomato_1', 'grape_1', 'strawberry_1', 'grape_2', 'strawberry_2', 'grape_3', 'strawberry_3'].includes(target.name)) {
                                throwSpearSound.play();
                            }
                    }
                }

                this.app.stage.removeChild(container);
                this.smokeManager.createSmokeParticles(graphic.position.x, graphic.position.y, 50);

                const objectsToShow = this.showObjects[container.cardType];
                if (objectsToShow) {
                    gsap.delayedCall(0.5, () => {
                        for (const obj of objectsToShow) {
                            obj.visible = true;
                        }
                        this.checkAllVisibleAndShowWin();
                    });
                }

                dropped = true;
                break;
            }
        }

        if (!dropped) {
            const startPos = this.cardStartPositions[index];
            gsap.to(container, {
                x: startPos.x,
                y: startPos.y,
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        this._hideDropOverlays();
    }

    _onPointerUpOutside(container, index) {
        container.alpha = 1;
        this.draggingCard = null;

        this._hideDropOverlays();

        const startPos = this.cardStartPositions[index];
        gsap.to(container, {
            x: startPos.x,
            y: startPos.y,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    _onPointerMove(container, event, dragOffset) {
        const pos = event.data.getLocalPosition(container.parent);
        container.x = pos.x - dragOffset.x;
        container.y = pos.y - dragOffset.y;
    }

    _showDropOverlays(type) {
        this.dropZoneManager.show(type);
    }

    _hideDropOverlays() {
        this.dropZoneManager.hideAll();
    }

    getDraggingCard() {
        return this.draggingCard;
    }

    getCards() {
        return this.cards;
    }

    checkAllVisibleAndShowWin() {
        const allVisible = Object.values(showObjects).every(arr =>
            arr.length > 0 && arr.every(obj => obj.visible)
        );

        if (allVisible) {
            this.winManager.showWin(this.soundButton.getMuted());

            this.soundButton.hide();
            this.toggleButton.hide();
        }
    }

    onResize() {
        this.app.stage.hitArea = this.app.screen;

        const startX = (window.innerWidth - (this.cards.length - 1) * 100) / 2;
        this.cardStartPositions.forEach((pos, i) => {
            const card = this.cards[i];
            pos.x = startX + i * 100;
            pos.y = window.innerHeight - 130;

            // Оновити позиції карток, якщо вони не у процесі перетягування
            if (this.draggingCard !== card) {
                card.x = pos.x;
                card.y = pos.y;
            }
        });
    }
}
