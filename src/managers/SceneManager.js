import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
    constructor(canvasContainer = document.body, mixers = []) {
        this.canvasContainer = canvasContainer;
        this.mixers = mixers;

        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initControls();
        this.initLights();

        this.clock = new THREE.Clock();

        window.addEventListener('resize', this.onResize.bind(this));
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa0d0ff);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 22, 25);
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.domElement.style.visibility = 'hidden';

        this.canvasContainer.appendChild(this.renderer.domElement);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    initLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xfff3b0, 4.5);
        this.directionalLight.position.set(10, 20, 10);
        this.directionalLight.castShadow = true;

        const shadow = this.directionalLight.shadow;
        shadow.mapSize.set(2048, 2048);
        shadow.camera.near = 1;
        shadow.camera.far = 80;
        shadow.camera.left = -80;
        shadow.camera.right = 80;
        shadow.camera.top = 80;
        shadow.camera.bottom = -50;

        this.scene.add(this.directionalLight);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addMixer(mixer) {
        this.mixers.push(mixer);
    }

    renderLoop() {
        requestAnimationFrame(() => this.renderLoop());

        const delta = this.clock.getDelta();
        this.mixers.forEach(mixer => mixer.update(delta));

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
