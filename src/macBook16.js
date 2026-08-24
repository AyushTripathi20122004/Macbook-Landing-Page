import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import gsap from 'gsap';

import macbookModel from './macbook-16-transformed.glb';

// --------------------------------------------------
// SCENE
// --------------------------------------------------

const scene = new THREE.Scene();


// --------------------------------------------------
// CAMERA
// --------------------------------------------------

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 15, 40);


// --------------------------------------------------
// CANVAS
// --------------------------------------------------

const canvas = document.querySelector('#Macbook-16');

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 15, 40);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;
controls.enableDamping = false;
controls.update();

const overlay = document.querySelector('#macbook-overlay');

let macbookModelObject = null;

let isDraggingMacbook = false;
let lastMouseX = 0;
let lastMouseY = 0;

overlay.addEventListener('mousedown', (event) => {

    if (!macbookModelObject) return;

    isDraggingMacbook = true;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    overlay.style.cursor = 'grabbing';
});


window.addEventListener('mousemove', (event) => {

    if (!isDraggingMacbook || !macbookModelObject) return;

    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    gsap.to(macbookModelObject.rotation, {
        x: macbookModelObject.rotation.x + deltaY * 0.01,
        y: macbookModelObject.rotation.y + deltaX * 0.01,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: true
    });
});


window.addEventListener('mouseup', () => {

    if (!isDraggingMacbook) return;

    isDraggingMacbook = false;

    overlay.style.cursor = 'grab';

    gsap.to(macbookModelObject.rotation, {
        x: THREE.MathUtils.degToRad(14),
        y: 0,
        z: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

overlay.style.cursor = 'grab';
// --------------------------------------------------
// RENDERER
// --------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);



//Very soft overall light
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.15
);

scene.add(ambientLight);

// Additional lights to illuminate the model from below, both sides, and the front.
const bottomLeftLight = new THREE.DirectionalLight(0xffffff, 0.8);
bottomLeftLight.position.set(-4, -3, 3);
scene.add(bottomLeftLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, -2, 0);
scene.add(backLight);


const bottomRightLight = new THREE.DirectionalLight(0xffffff, 0.8);
bottomRightLight.position.set(4, -3, 3);
scene.add(bottomRightLight);


// Very soft fill light
const fillLight = new THREE.DirectionalLight(
    0xffffff,
    0.5
);

fillLight.position.set(
    4,
    2,
    4
);

scene.add(fillLight);


// Soft rim light from behind
const rimLight = new THREE.DirectionalLight(
    0xffffff,
    1
);

rimLight.position.set(
    0,
    5,
    -5
);

scene.add(rimLight);


// --------------------------------------------------
// ENVIRONMENT
// --------------------------------------------------

const environment = new RoomEnvironment();

const pmremGenerator = new THREE.PMREMGenerator(
    renderer
);

scene.environment =
    pmremGenerator.fromScene(
        environment
    ).texture;

scene.environmentIntensity = 0.09;


environment.dispose();

pmremGenerator.dispose();


// --------------------------------------------------
// DRACO LOADER
// --------------------------------------------------

const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
);


// --------------------------------------------------
// GLTF LOADER
// --------------------------------------------------

const loader = new GLTFLoader();

loader.setDRACOLoader(
    dracoLoader
);

let blackTexture = null;
const originalMaterialMaps = new WeakMap();

function createBlackTexture() {
    const blackTextureCanvas = document.createElement('canvas');
    blackTextureCanvas.width = 1;
    blackTextureCanvas.height = 1;
    const blackTextureContext = blackTextureCanvas.getContext('2d');
    blackTextureContext.fillStyle = '#000000';
    blackTextureContext.fillRect(0, 0, 1, 1);

    blackTexture = new THREE.CanvasTexture(blackTextureCanvas);
    blackTexture.colorSpace = THREE.SRGBColorSpace;
    blackTexture.needsUpdate = true;
}

function setBlackTexture(enabled) {
    if (!macbookModelObject) {
        return;
    }

    if (enabled && !blackTexture) {
        createBlackTexture();
    }

    macbookModelObject.traverse((object) => {
        if (!object.isMesh || !object.material) {
            return;
        }

        const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

        materials.forEach((material) => {
            if (!material.isMeshStandardMaterial && !material.isMeshPhysicalMaterial) {
                return;
            }

            if (!originalMaterialMaps.has(material)) {
                originalMaterialMaps.set(material, material.map);
            }

            material.map = enabled
                ? blackTexture
                : originalMaterialMaps.get(material);
            material.needsUpdate = true;
        });
    });
}

document.querySelectorAll('#removeTextureButton, [data-texture="black"]').forEach((button) => {
    button.addEventListener('click', () => {
        document
            .querySelectorAll('#removeTextureButton, #blackTextureButton, [data-texture="black"], [data-texture="remove"]')
            .forEach((textureButton) => {
                textureButton.classList.remove('active');
                textureButton.style.border = '';
            });

        button.classList.add('active');
        button.style.border = '2px solid #fff';
        setBlackTexture(true);
    });
});

document.querySelectorAll('#blackTextureButton, [data-texture="remove"]').forEach((button) => {
    button.addEventListener('click', () => {
        document
            .querySelectorAll('#removeTextureButton, #blackTextureButton, [data-texture="black"], [data-texture="remove"]')
            .forEach((textureButton) => {
                textureButton.classList.remove('active');
                textureButton.style.border = '';
            });

        button.classList.add('active');
        button.style.border = '2px solid #000';
        setBlackTexture(false);
    });
});


// --------------------------------------------------
// LOAD MACBOOK MODEL
// --------------------------------------------------

loader.load(

    macbookModel,

    (gltf) => {

        const macbook = gltf.scene;

        macbookModelObject = macbook;


        macbook.traverse((object) => {

            if (
                !object.isMesh ||
                !object.material
            ) {
                return;
            }


            const materials =
                Array.isArray(object.material)
                    ? object.material
                    : [object.material];


            // ------------------------------------------
            // LAPTOP BODY MATERIALS
            // ------------------------------------------

            materials.forEach(
                (material) => {

                    if (
                        material.isMeshStandardMaterial ||
                        material.isMeshPhysicalMaterial
                    ) {

                        material.metalness =
                            Math.min(
                                material.metalness,
                                0.85
                            );

                        material.roughness =
                            Math.max(
                                material.roughness,
                                0.28
                            );

                        material.needsUpdate =
                            true;
                    }

                }
            );

        });


        // ------------------------------------------
        // MODEL SCALE
        // ------------------------------------------

        macbook.rotation.x = THREE.MathUtils.degToRad(14);

        macbook.position.y = 14;

        // ------------------------------------------
        // ADD TO SCENE
        // ------------------------------------------

        scene.add(
            macbook
        );

    },

    undefined,

    (error) => {

        console.error(
            'Failed to load MacBook model:',
            error
        );

    }
);


// --------------------------------------------------
// RESIZE
// --------------------------------------------------

function resizeRenderer() {

    const width =
        canvas.clientWidth ||
        window.innerWidth;

    const height =
        canvas.clientHeight ||
        window.innerHeight;


    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        width,
        height,
        false
    );
}


window.addEventListener(
    'resize',
    resizeRenderer
);

resizeRenderer();


// --------------------------------------------------
// ANIMATION
// --------------------------------------------------

function render() {

    requestAnimationFrame(
        render
    );

    renderer.render(
        scene,
        camera
    );
}

render();