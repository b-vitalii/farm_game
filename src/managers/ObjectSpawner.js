import * as THREE from 'three';
import { SkeletonUtils } from '../utils/skeletonUtils.js';

export class ObjectSpawner {
    constructor(scene, gltf, root, mixers) {
        this.scene = scene;
        this.gltf = gltf;
        this.root = root;
        this.mixers = mixers;
        this.animationCount = 0;
    }

    spawnAnimal({ name, animation, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
        if (!this.root || !this.gltf) {
            return;
        }

        const original = this.root.getObjectByName(name);
        if (!original) {
            return;
        }

        const clone = SkeletonUtils.clone(original);
        clone.position.set(...position);
        clone.scale.set(...scale);
        clone.rotation.set(...rotation);
        this.scene.add(clone);

        const mixer = new THREE.AnimationMixer(clone);
        this.mixers.push(mixer);

        const clip = this.gltf.animations.find(a => a.name === animation);
        if (clip) {
            const action = mixer.clipAction(clip);
            const delay = this.animationCount * 150;
            this.animationCount++;
            setTimeout(() => action.play(), delay);
        } else {
        }

        return clone;
    }

    spawnPlant({ name, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
        if (!this.root) {
            return;
        }

        const original = this.root.getObjectByName(name);
        if (!original) {
            return;
        }

        const clone = SkeletonUtils.clone(original);
        clone.position.set(...position);
        clone.scale.set(...scale);
        clone.rotation.set(...rotation);
        this.scene.add(clone);

        return clone;
    }
}