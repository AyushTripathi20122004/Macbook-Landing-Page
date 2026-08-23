import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import macbookModel from './macbook-16-transformed.glb';

gsap.registerPlugin(ScrollTrigger);

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
    1000
);

camera.position.set(0, 30, 30);


// --------------------------------------------------
// CANVAS
// --------------------------------------------------

const canvas = document.querySelector('#Macbook-Model3');

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 30, 0);
controls.update();

let macbookModelObject = null;
let macbookScrollTimeline = null;

function updateMacbookScrollAnimation() {
    if (!macbookModelObject) return;

    if (macbookScrollTimeline) {
        macbookScrollTimeline.kill();
    }

    macbookScrollTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: canvas,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    macbookScrollTimeline
        .to(macbookModelObject.rotation, {
            y: Math.PI * 4,
            ease: 'none'
        },'start')
}




// --------------------------------------------------
// RENDERER
// --------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
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

const backLight = new THREE.DirectionalLight(0xffffff, 5);
backLight.position.set(0, -6,0);
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

// Use a real 1x1 canvas texture for the model during local nighttime.
const blackTextureCanvas = document.createElement('canvas');
blackTextureCanvas.width = 1;
blackTextureCanvas.height = 1;
const blackTextureContext = blackTextureCanvas.getContext('2d');
blackTextureContext.fillStyle = '#000000';
blackTextureContext.fillRect(0, 0, 1, 1);

const blackTexture = new THREE.CanvasTexture(blackTextureCanvas);
blackTexture.colorSpace = THREE.SRGBColorSpace;
blackTexture.needsUpdate = true;

const isNighttime = () => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
};

const updateMacbookLighting = (model) => {
    const nighttime = isNighttime();

    model.traverse((object) => {
        if (!object.isMesh || !object.material) {
            return;
        }

        const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

        materials.forEach((material) => {
            if (
                material.isMeshStandardMaterial ||
                material.isMeshPhysicalMaterial
            ) {
                if (!Object.prototype.hasOwnProperty.call(material, 'dayTexture')) {
                    material.dayTexture = material.map;
                }

                material.map = nighttime
                    ? blackTexture
                    : material.dayTexture;
                material.needsUpdate = true;
            }
        });
    });
};


// --------------------------------------------------
// LOAD MACBOOK MODEL
// --------------------------------------------------

loader.load(

    macbookModel,

    (gltf) => {

        const macbook = gltf.scene;

        macbookModelObject = macbook;
        macbook.position.y = 30;


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

                        material.map = blackTexture;
                        material.color.set(0xffffff);

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

        macbook.scale.set(
            0.5,0.5,0.5
        );

        // Keep the model at the top in its starting orientation.
        // macbook.position.set(0, 35, 0);
        macbook.rotation.set(
            THREE.MathUtils.degToRad(14),
            0,
            0
        );



        // ------------------------------------------
        // ADD TO SCENE
        // ------------------------------------------

        scene.add(
            macbook
        );

        updateMacbookScrollAnimation();

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