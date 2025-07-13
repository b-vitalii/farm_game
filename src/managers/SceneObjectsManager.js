import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ObjectSpawner } from './ObjectSpawner.js';
import { setupAnimals } from './setupAnimals.js';
import { setupPlants } from './setupPlants.js';
import { dropZonesMap, showObjects } from '../data/ObjectCollections.js';

export class SceneObjectsManager {
    constructor(scene, mixers) {
        this.scene = scene;
        this.mixers = mixers;
        this.loader = new GLTFLoader();
        this.root = null;
        this.objectsGltf = null;
        this.spawner = null;
        this.animals = null;
    }

    loadObjects(path = '/models/objects.glb') {
        return new Promise((resolve, reject) => {
            this.loader.load(
                path,
                (gltf) => {
                    this.root = gltf.scene;
                    this.objectsGltf = gltf;

                    this.root.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    this.scene.add(this.root);

                    this.spawner = new ObjectSpawner(this.scene, this.objectsGltf, this.root, this.mixers);

                    this.animals = setupAnimals({
                        root: this.root,
                        gltf,
                        mixers: this.mixers,
                        spawner: this.spawner,
                        showObjects,
                        dropZonesMap,
                    });

                    setupPlants({
                        root: this.root,
                        spawner: this.spawner,
                        dropZonesMap,
                        showObjects,
                    });

                    resolve();
                },
                undefined,
                (err) => {
                    console.error('Error loading objects.glb', err);
                    reject(err);
                }
            );
        });
    }

    hideAllObjects() {
        Object.values(showObjects).forEach(array => {
            array.forEach(obj => obj.visible = false);
        });
    }
}
