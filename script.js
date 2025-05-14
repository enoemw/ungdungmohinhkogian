// Hàm tạo mô phỏng 3D
function setup3DCanvas(canvasId, createGeometry) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(Canvas with id ${canvasId} not found!);
        return null;
    }

    if (typeof THREE === 'undefined') {
        console.error("Three.js is not loaded!");
        canvas.innerHTML = "Three.js khong tai duoc!";
        return null;
    }

    if (typeof THREE.OrbitControls === 'undefined') {
        console.error("OrbitControls is not loaded!");
        canvas.innerHTML = "OrbitControls khong tai duoc!";
        return null;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    if (!renderer) {
        console.error("WebGL not supported!");
        canvas.innerHTML = "Trinh duyet khong ho tro WebGL!";
        return null;
    }
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    const geometry = createGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0x3498db, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    return { scene, mesh, geometry, renderer, camera };
}

// Khởi tạo mô phỏng 3D cho từng hình
const pyramid3D = setup3DCanvas('pyramid-canvas', () => new THREE.ConeGeometry(1, 2, 3));
const cube3D = setup3DCanvas('cube-canvas', () => new THREE.BoxGeometry(2, 2, 2));
const box3D = setup3DCanvas('box-canvas', () => new THREE.BoxGeometry(2, 1, 3));

if (!pyramid3D || !cube3D || !box3D) {
    console.error("Failed to initialize 3D canvases!");
}

// Hàm tính diện tích và cập nhật mô phỏng
function calculatePyramid() {
    const base = parseFloat(document.getElementById('pyramid-base').value) || 0;
    const height = parseFloat(document.getElementById('pyramid-height').value) || 0;
    let resultText = 'Dien tich: -- m²';

    if (base > 0 && height > 0 && pyramid3D) {
        const baseArea = (Math.sqrt(3) / 4) * base * base;
        const slantHeight = Math.sqrt(height * height + (base / 2) * (base / 2));
        const lateralArea = 3 * (base * slantHeight / 2);
        const totalArea = baseArea + lateralArea;
        resultText = Dien tich: ${totalArea.toFixed(2)} m²;

        pyramid3D.scene.remove(pyramid3D.mesh);
        pyramid3D.geometry.dispose(); // Giải phóng bộ nhớ
        pyramid3D.geometry = new THREE.ConeGeometry(base / 2, height, 3);
        pyramid3D.mesh = new THREE.Mesh(pyramid3D.geometry, pyramid3D.mesh.material);
        pyramid3D.scene.add(pyramid3D.mesh);
        pyramid3D.camera.position.z = Math.max(base, height) * 2;
    } else if (base <= 0 || height <= 0) {
        resultText = 'Vui long nhap so duong!';
    } else if (!pyramid3D) {
        resultText = 'Khong the hien thi mo phong 3D!';
    }

    document.getElementById('pyramid-result').textContent = resultText;
}

function calculateCube() {
    const edge = parseFloat(document.getElementById('cube-edge').value) || 0;
    let resultText = 'Dien tich: -- m²';

    if (edge > 0 && cube3D) {
        const area = 6 * edge * edge;
        resultText = Dien tich: ${area.toFixed(2)} m²;

        cube3D.scene.remove(cube3D.mesh);
        cube3D.geometry.dispose();
        cube3D.geometry = new THREE.BoxGeometry(edge, edge, edge);
        cube3D.mesh = new THREE.Mesh(cube3D.geometry, cube3D.mesh.material);
        cube3D.scene.add(cube3D.mesh);
        cube3D.camera.position.z = edge * 2;
    } else if (edge <= 0) {
        resultText = 'Vui long nhap so duong!';
    } else if (!cube3D) {
        resultText = 'Khong the hien thi mo phong 3D!';
    }

    document.getElementById('cube-result').textContent = resultText;
}

function calculateBox() {
    const length = parseFloat(document.getElementById('box-length').value) || 0;
    const width = parseFloat(document.getElementById('box-width').value) || 0;
    const height = parseFloat(document.getElementById('box-height').value) || 0;
    let resultText = 'Dien tich: -- m²';

    if (length > 0 && width > 0 && height > 0 && box3D) {
        const area = 2 * (length * width + length * height + width * height);
        resultText = Dien tich: ${area.toFixed(2)} m²;

        box3D.scene.remove(box3D.mesh);
        box3D.geometry.dispose();
        box3D.geometry = new THREE.BoxGeometry(length, height, width);
        box3D.mesh = new THREE.Mesh(box3D.geometry, box3D.mesh.material);
        box3D.scene.add(box3D.mesh);
        box3D.camera.position.z = Math.max(length, width, height) * 2;
    } else if (length <= 0 || width <= 0 || height <= 0) {
        resultText = 'Vui long nhap so duong!';
    } else if (!box3D) {
        resultText = 'Khong the hien thi mo phong 3D!';
    }

    document.getElementById('box-result').textContent = resultText;
}
