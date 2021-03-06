import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
//const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d263b);

const axesHelper = new THREE.AxesHelper();
//scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load('/textures/matcaps/7.png');
const material = new THREE.MeshMatcapMaterial({
  matcap: matCapTexture,
});

let text;
const fontLoader = new FontLoader();
fontLoader.load('/fonts/Kosugi_Maru_Regular.json', (font) => {
  const textGeometry = new TextGeometry('セケイ', {
    font,
    size: 1,
    height: 0.2,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.02,
    bevelOffset: 0.001,
    bevelSegments: 16,
  });
  //textGeometry.computeBoundingBox();
  textGeometry.center();
  text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
});

const shapeGenParams = {
  iterations: 100,
  scaleRange: 10,
};
const shapeGenCube = new THREE.BoxGeometry(0.25, 0.25, 0.25);
const shapeGenSphere = new THREE.SphereGeometry(0.15, 32, 32);
const shapeGenTorus = new THREE.TorusBufferGeometry(0.1, 0.05, 16, 100);

const generateCubes = () => {
  for (let i = 0; i <= shapeGenParams.iterations; i++) {
    const cube = new THREE.Mesh(shapeGenCube, material);
    const sphere = new THREE.Mesh(shapeGenSphere, material);
    const torus = new THREE.Mesh(shapeGenTorus, material);
    scene.add(cube, sphere, torus);
    const randomizeProperties = (item) => {
      item.position.x = (Math.random() - 0.5) * shapeGenParams.scaleRange;
      item.position.y = (Math.random() - 0.5) * shapeGenParams.scaleRange;
      item.position.z = (Math.random() - 0.5) * shapeGenParams.scaleRange;
      item.rotation.x = (Math.random() - 0.5) * Math.PI;
      item.rotation.y = (Math.random() - 0.5) * Math.PI;
      const scale = Math.random() + 0.5;
      item.scale.set(scale, scale, scale);
    };
    randomizeProperties(cube);
    randomizeProperties(sphere);
    randomizeProperties(torus);
  }
};

generateCubes();

// const sphere = new THREE.Mesh(
//   new THREE.geom(1, 1, 1),
//   new THREE.MeshNormalMaterial()
// );

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  80,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  //Update camera
  gsap.to(camera.position, 1, { x: cursor.x });
  gsap.to(camera.position, 1, { y: -cursor.y * 2 });
  gsap.to(camera.position, 1, { z: cursor.x + 3 });
  gsap.to(camera.rotation, 1, { y: cursor.x + 2 });
  camera.position.x = (camera.position.x + Math.sin(elapsedTime * 0.25)) * 0.1;
  camera.position.y = (camera.position.y + Math.sin(elapsedTime * 0.25)) * 0.05;
  camera.rotation.z = (camera.position.y + Math.sin(elapsedTime) * 8) * 0.01;
  //camera.lookAt(text.position);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
