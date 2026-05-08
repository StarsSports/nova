import * as THREE from 'three';

let scene, camera, renderer, player, clock = new THREE.Clock();
let keys = {};

async function start() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add Player (The Noob)
    player = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshLambertMaterial({color: 0xffff00}));
    player.position.y = 1;
    scene.add(player);

    // LOAD THE PUBLISHED DATA
    const response = await fetch('game_data.json');
    const data = await response.json();

    data.forEach(p => {
        const part = new THREE.Mesh(new THREE.BoxGeometry(p.scale.x, p.scale.y, p.scale.z), new THREE.MeshLambertMaterial({color: p.color}));
        part.position.copy(p.pos);
        scene.add(part);
        
        // Execute Script
        if(p.script) {
            const func = new Function('me', p.script);
            func(part);
        }
    });

    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);
    
    loop();
}

function loop() {
    requestAnimationFrame(loop);
    const speed = 0.1;
    if(keys['KeyW']) player.position.z -= speed;
    if(keys['KeyS']) player.position.z += speed;
    if(keys['KeyA']) player.position.x -= speed;
    if(keys['KeyD']) player.position.x += speed;

    camera.position.set(player.position.x, player.position.y + 5, player.position.z + 10);
    camera.lookAt(player.position);
    renderer.render(scene, camera);
}

start();
