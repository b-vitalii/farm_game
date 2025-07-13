import * as THREE from 'three';

export class DayNightManager {
    constructor(params) {
        this.scene = params.scene;
        this.directionalLight = params.directionalLight;
        this.ambientLight = params.ambientLight;

        this.isNight = false;

        this.daySettings = {
            background: 0xa0d0ff,
            directionalLightIntensity: 4.5,
            directionalLightColor: 0xfff3b0,
            directionalLightPosition: { x: 10, y: 20, z: 10 },
            ambientLightIntensity: 0.4,
        };

        this.nightSettings = {
            background: 0x0a0a1a,
            directionalLightIntensity: 1.2,
            directionalLightColor: 0x96c5ff,
            directionalLightPosition: { x: -20, y: 25, z: -20 },
            ambientLightIntensity: 0.2,
        };
    }

    toggle() {
        this.isNight = !this.isNight;
        const target = this.isNight ? this.nightSettings : this.daySettings;

        const currentBG = new THREE.Color(this.scene.background);
        const targetBG = new THREE.Color(target.background);
        gsap.to(currentBG, {
            r: targetBG.r,
            g: targetBG.g,
            b: targetBG.b,
            duration: 2,
            onUpdate: () => this.scene.background.setRGB(currentBG.r, currentBG.g, currentBG.b),
        });

        // Плавна зміна позиції DirectionalLight
        gsap.to(this.directionalLight.position, {
            x: target.directionalLightPosition.x,
            y: target.directionalLightPosition.y,
            z: target.directionalLightPosition.z,
            duration: 2,
        });

        const currentDLColor = new THREE.Color(this.directionalLight.color);
        const targetDLColor = new THREE.Color(target.directionalLightColor);
        gsap.to(currentDLColor, {
            r: targetDLColor.r,
            g: targetDLColor.g,
            b: targetDLColor.b,
            duration: 2,
            onUpdate: () => this.directionalLight.color.setRGB(currentDLColor.r, currentDLColor.g, currentDLColor.b),
        });

        gsap.to(this.directionalLight, {
            intensity: target.directionalLightIntensity,
            duration: 2,
        });

        gsap.to(this.ambientLight, {
            intensity: target.ambientLightIntensity,
            duration: 2,
        });
    }
}
