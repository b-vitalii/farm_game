import * as THREE from 'three';
import { animalConfigs } from '../data/ObjectConfig.js';

export function setupAnimals({ root, gltf, mixers, spawner, showObjects, dropZonesMap }) {
    const result = {};

    for (const animalKey of Object.keys(animalConfigs)) {
        const config = animalConfigs[animalKey];
        const base = root.getObjectByName(config.base.name);

        if (base) {
            const mixer = new THREE.AnimationMixer(base);
            mixers.push(mixer);

            const idleClip = gltf.animations.find(clip => clip.name === config.base.animation);
            if (idleClip) {
                mixer.clipAction(idleClip).play();
            } else {
                console.warn(`${config.base.animation} animation not found for ${animalKey}`);
            }

            base.scale.set(...config.base.scale);
            base.position.set(...config.base.position);
            base.rotation.set(...config.base.rotation);
        }

        const clones = config.clones.map(cfg =>
            spawner.spawnAnimal({
                name: config.base.name,
                animation: cfg.animation || config.base.animation,
                position: cfg.position,
                scale: config.base.scale,
                rotation: cfg.rotation,
            })
        );

        showObjects[animalKey].push(base, ...clones);
        if (base) dropZonesMap[animalKey].push(base);

        result[animalKey] = base;
    }

    return result;
}
