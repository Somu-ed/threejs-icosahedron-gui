import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

let geoRadius = 1.0;
let geoDetails = 2;
let geo = new THREE.IcosahedronGeometry(geoRadius, geoDetails);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
});
let mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    wireframe: true 
});
let wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);
mesh.add(wireMesh);

let hemiColor1 = 0x0099ff;
let hemiColor2 = 0xaa5500;
let hemiLight = new THREE.HemisphereLight(hemiColor1, hemiColor2);
scene.add(hemiLight);

const gui = new GUI();

const rotationFolder = gui.addFolder('Rotation Speed');
const rotationParams = {
    x: 0.0001,
    y: 0.0002
};
rotationFolder.add(rotationParams, 'x', 0, 0.001).step(0.0001);
rotationFolder.add(rotationParams, 'y', 0, 0.001).step(0.0001);

const Folder01 = gui.addFolder('Icosahedron');
Folder01.addColor(mat, 'color').onChange(() => {
    mat.needsUpdate = true;
});
Folder01.add(mat, 'flatShading').onChange(() => {
    mat.needsUpdate = true;
});
Folder01.add({ radius: geoRadius }, 'radius', 0.1, 2).step(0.1).onChange((value) => {
    geoRadius = value;
    updateGeometry();
});
Folder01.add({ details: geoDetails }, 'details', 0, 5).step(1).onChange((value) => {
    geoDetails = value;
    updateGeometry();
});

const Folder2 = gui.addFolder('Wireframe');
Folder2.addColor(wireMat, 'color').onChange(() => {
    wireMat.needsUpdate = true;
});
Folder2.add(wireMat, 'wireframe').onChange(() => {
    wireMat.needsUpdate = true;
});

const hemiFolder = gui.addFolder('Hemisphere Light');
hemiFolder.addColor({ color: hemiColor1 }, 'color').onChange((value) => {
    hemiColor1 = value;
    updateHemisphereLight();
});
hemiFolder.addColor({ groundColor: hemiColor2 }, 'groundColor').onChange((value) => {
    hemiColor2 = value;
    updateHemisphereLight();
});

function updateGeometry() {
    const newGeo = new THREE.IcosahedronGeometry(geoRadius, geoDetails);
    mesh.geometry.dispose();
    mesh.geometry = newGeo;
    wireMesh.geometry.dispose();
    wireMesh.geometry = newGeo;
}

function updateHemisphereLight() {
    hemiLight.color.set(hemiColor1);
    hemiLight.groundColor.set(hemiColor2);
}

function animate(t = 0) {
    requestAnimationFrame(animate);
    mesh.rotation.y = t * rotationParams.y;
    mesh.rotation.x = t * rotationParams.x;
    renderer.render(scene, camera);
    controls.update();
}
animate();
