import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, control, orbit, objects = [], selected = null;

init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);
    camera = new THREE.PerspectiveCamera(75, (window.innerWidth - 560) / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 10, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 560, window.innerHeight);
    document.getElementById('viewport').appendChild(renderer.domElement);

    scene.add(new THREE.GridHelper(50, 50, 0x444444, 0x222222));
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    orbit = new OrbitControls(camera, renderer.domElement);
    control = new TransformControls(camera, renderer.domElement);
    control.addEventListener('dragging-changed', (e) => orbit.enabled = !e.value);
    scene.add(control);

    document.getElementById('addPart').onclick = () => {
        const part = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({color: 0x0a84ff}));
        part.name = "Part_" + objects.length;
        scene.add(part);
        objects.push(part);
        select(part);
    };

    document.getElementById('saveWorld').onclick = serializeAndDownload;
    animate();
}

function select(obj) {
    selected = obj;
    control.attach(obj);
    const props = document.getElementById('prop-fields');
    props.innerHTML = `
        <label>Name</label><input type="text" id="p-name" value="${obj.name}">
        <label>Color</label><input type="color" id="p-color" value="#${obj.material.color.getHexString()}">
        <label>Script</label><textarea id="p-script" style="height:100px; width:100%">${obj.customScript || ""}</textarea>
        <button class="btn" id="p-save">Apply</button>
    `;
    document.getElementById('p-save').onclick = () => {
        obj.name = document.getElementById('p-name').value;
        obj.material.color.set(document.getElementById('p-color').value);
        obj.customScript = document.getElementById('p-script').value;
    };
}

function serializeAndDownload() {
    const data = objects.map(o => ({
        name: o.name, pos: o.position, rot: o.rotation, scale: o.scale,
        color: o.material.color.getHex(), script: o.customScript || ""
    }));
    const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = "game_data.json"; a.click();
}

function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
