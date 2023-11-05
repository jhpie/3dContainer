// import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";


// 씬, 카메라 및 렌더러 초기화
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 텍스처 로더
const textureLoader = new THREE.TextureLoader();

// 각 면에 텍스처를 적용할 재질 배열 생성
const materials = [
    new THREE.MeshBasicMaterial({ map: textureLoader.load('http://localhost:8080/image/textureFront.png') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('http://localhost:8080/image/textureBack.png') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('http://localhost:8080/image/textureTop.png') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('http://localhost:8080/image/textureBottom.png') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('http://localhost:8080/image/textureRight.png') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('http://localhost:8080/image/textureLeft.png') })
];

// 상자 형상 및 메시 생성
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// 카메라 위치 설정
camera.position.z = 5;

// 애니메이션 함수
function animate() {
    requestAnimationFrame(animate);
    // 상자 회전
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // 렌더링
    renderer.render(scene, camera);
}

// 애니메이션 시작
animate();