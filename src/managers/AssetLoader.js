import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SkeletonUtils } from '../utils/skeletonUtils.js';

export class AssetLoader {
    constructor(sceneManager) {
        this.scene = sceneManager.scene;
        this.mixerArray = sceneManager.mixers;
        this.sceneManager = sceneManager;

        this.loader = new GLTFLoader();
        this.root = null;
        this.objectsGltf = null;
    }

    loadGroundModel() {
        return new Promise((resolve, reject) => {
            this.loader.load('/models/ground.glb', (gltf) => {
                const shadowBlocklist = ['terrain_1'];

                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        const isExcluded = shadowBlocklist.includes(child.name);
                        child.castShadow = !isExcluded;
                        child.receiveShadow = true;
                    }
                });

                this.scene.add(gltf.scene);
                resolve(gltf.scene);
            }, undefined, reject);
        });
    }

    loadObjectModels() {
        return new Promise((resolve, reject) => {
            this.loader.load('/models/objects.glb', (gltf) => {
                this.root = gltf.scene;
                this.objectsGltf = gltf;

                this.root.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                this.scene.add(this.root);
                resolve(gltf);
            }, undefined, reject);
        });
    }

    spawnAnimal({ name, animation, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
        if (!this.root || !this.objectsGltf) {
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
        this.mixerArray.push(mixer);

        const clip = this.objectsGltf.animations.find(a => a.name === animation);
        if (clip) {
            const action = mixer.clipAction(clip);
            action.play();
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

    getRoot() {
        return this.root;
    }

    getGLTF() {
        return this.objectsGltf;
    }
}
