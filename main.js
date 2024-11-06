import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

//

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({
    // Locate the DOM element with the ID "bg", assuming it is a canvas (draw surface)
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);
camera.position.setX(-3);

// Create a cube
const cube = (() => {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({color: 0xFF6347});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z = -15;
    cube.position.x = -15;
    cube.rotation.x = 2;
    cube.rotation.y = .5;
    return cube;
})();
scene.add(cube);

// Create an icosahedron
const ico = (() => {
    const geometry = new THREE.IcosahedronGeometry(10);
    const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    const ico = new THREE.Mesh(geometry, material);
    ico.position.z = -15;
    ico.position.x = 15;
    return ico;
})();
scene.add(ico);

// Lights
function setupLights(scene) {
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, -10, 10);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.position.set(25, -15, -400);

    scene.add(pointLight);
    scene.add(ambientLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(lightHelper)
}

setupLights(scene);

// Grid
function setupGrid(scene) {
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper)
}

setupGrid(scene);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)

// Background
const spaceTexture = new THREE.TextureLoader().load('images/night_sky.jpg')
scene.background = spaceTexture;

// Object texture mapping
const smileTexture = new THREE.TextureLoader().load('images/smile.jpg')
const sphereGeometry = new THREE.SphereGeometry(10, 22, 10);
const smileMaterial = new THREE.MeshBasicMaterial({map: smileTexture})
const smileMesh = new THREE.Mesh(sphereGeometry, smileMaterial);
scene.add(smileMesh);

const normalTexture = new THREE.TextureLoader().load('images/normals/textureNormal.png');
// Normal Texture Map

const torusGeo = new THREE.TorusKnotGeometry(5, 1, 250, 5, 9, 15);
const torusMaterial = new THREE.MeshStandardMaterial({
    normalMap: normalTexture,
    roughness: 10,
    metalness: .8
});

const torusKnot = new THREE.Mesh(torusGeo, torusMaterial);

scene.add(torusKnot);
torusKnot.position.y = 20

// START Draw Logic
// Should always be placed last, after all objects are set up!

// Drawing
function draw(delta) {
    // Rotate the cube
    cube.rotation.x += delta;
    cube.rotation.y += delta;

    // Rotate the icosahedron
    ico.rotation.z += delta * -3;
    ico.rotation.y += delta * -3;

    // Rotate the smiley sphere
    smileMesh.rotation.y += delta * 5;

    // Process controls
    controls.update()

    // Render the screen
    renderer.render(scene, camera);
}

// Loop
function queueAnimate(lastFrame) {
    window.requestAnimationFrame(() => {
        // Calculate delta time, ms between frames (necessary for smooth motion)
        const now = window.performance.now();
        const delta = (now - lastFrame) / 1000;

        // Paint the frame
        draw(delta)

        // Queue the next frame
        queueAnimate(now);
    });
}

// Start the animation loop
queueAnimate(window.performance.now());

// END Draw Logic
