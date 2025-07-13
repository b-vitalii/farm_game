import * as PIXI from 'pixi.js';
import * as THREE from 'three';

export class DropZoneManager {
    constructor(dropZonesMap, camera, stage) {
        this.dropZonesMap = dropZonesMap;
        this.camera = camera;
        this.stage = stage;

        this.dropZoneOverlays = new Map();

        this._createDropZoneGraphics();
    }

    _createDropZoneGraphics() {
        for (const [type, zones] of Object.entries(this.dropZonesMap)) {
            const graphicsList = [];

            zones.forEach((obj3D) => {
                const g = new PIXI.Graphics();
                g.beginFill(0xff0000, 0.5);
                g.drawRoundedRect(-45, -45, 90, 90, 6);
                g.endFill();
                g.visible = false;
                this.stage.addChild(g);

                graphicsList.push({ graphic: g, target: obj3D });
            });

            this.dropZoneOverlays.set(type, graphicsList);
        }
    }

    update() {
        for (const overlays of this.dropZoneOverlays.values()) {
            overlays.forEach(({ graphic, target }) => {
                const pos = target.getWorldPosition(new THREE.Vector3());
                pos.project(this.camera);

                const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-(pos.y * 0.5) + 0.5) * window.innerHeight;

                graphic.position.set(x, y);
            });
        }
    }

    show(type) {
        for (const [t, overlays] of this.dropZoneOverlays) {
            overlays.forEach(({ graphic }) => {
                graphic.visible = (t === type);
            });
        }
    }

    hideAll() {
        for (const overlays of this.dropZoneOverlays.values()) {
            overlays.forEach(({ graphic }) => {
                graphic.visible = false;
            });
        }
    }

    getOverlays(type) {
        return this.dropZoneOverlays.get(type) || [];
    }
}
