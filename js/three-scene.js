(function () {
    'use strict';

    let scene, camera, renderer;
    let mainGroup, coreMesh, wireMesh, innerCore, satelliteGroup, satellites = [];
    let starParticles, particleGeo;
    let pointLight1, pointLight2, ambientLight;

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    let clock;
    let canvasContainer;

    function initThree() {
        canvasContainer = document.getElementById('webgl-hero-container');
        if (!canvasContainer) return;

        if (typeof THREE === 'undefined') {
            console.warn('Three.js CDN not loaded yet, retrying...');
            setTimeout(initThree, 200);
            return;
        }

        clock = new THREE.Clock();
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x070b14, 0.0015);

        camera = new THREE.PerspectiveCamera(
            60,
            canvasContainer.clientWidth / canvasContainer.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 18;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        canvasContainer.appendChild(renderer.domElement);

        ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        pointLight1 = new THREE.PointLight(0x00f5ff, 4, 50);
        pointLight1.position.set(10, 10, 10);
        scene.add(pointLight1);

        pointLight2 = new THREE.PointLight(0x7c3aed, 4, 50);
        pointLight2.position.set(-10, -10, 10);
        scene.add(pointLight2);

        mainGroup = new THREE.Group();
        scene.add(mainGroup);

        const icoGeo = new THREE.IcosahedronGeometry(4.8, 2);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x00f5ff,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
        });
        wireMesh = new THREE.Mesh(icoGeo, wireMat);
        mainGroup.add(wireMesh);

        const coreGeo = new THREE.IcosahedronGeometry(3.6, 1);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x070b14,
            metalness: 0.85,
            roughness: 0.15,
            wireframe: false,
            emissive: 0x7c3aed,
            emissiveIntensity: 0.3,
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        mainGroup.add(coreMesh);

        const innerGeo = new THREE.SphereGeometry(2.2, 32, 32);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x00f5ff,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
        });
        innerCore = new THREE.Mesh(innerGeo, innerMat);
        mainGroup.add(innerCore);

        satelliteGroup = new THREE.Group();
        mainGroup.add(satelliteGroup);

        const satGeometries = [
            new THREE.OctahedronGeometry(0.75), // Robotics
            new THREE.TetrahedronGeometry(0.8),  // Drone
            new THREE.TorusGeometry(0.55, 0.2, 16, 32), // Music
            new THREE.BoxGeometry(0.7, 0.7, 0.7) // CS
        ];

        const satColors = [0x00f5ff, 0x10b981, 0xec4899, 0x7c3aed];

        for (let i = 0; i < 4; i++) {
            const satMat = new THREE.MeshStandardMaterial({
                color: satColors[i],
                emissive: satColors[i],
                emissiveIntensity: 0.6,
                metalness: 0.9,
                roughness: 0.1,
            });
            const sat = new THREE.Mesh(satGeometries[i], satMat);
            const angle = (i / 4) * Math.PI * 2;
            const radius = 8.5;
            sat.position.set(Math.cos(angle) * radius, (i - 1.5) * 1.5, Math.sin(angle) * radius);
            sat.userData = { angle: angle, speed: 0.8 + i * 0.2, radius: radius };
            satelliteGroup.add(sat);
            satellites.push(sat);
        }

        const particleCount = 600;
        particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0x00f5ff);
        const color2 = new THREE.Color(0x7c3aed);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.25,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
        });

        starParticles = new THREE.Points(particleGeo, particleMat);
        scene.add(starParticles);

        window.addEventListener('resize', onWindowResize, { passive: true });
        document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
        document.addEventListener('click', onDocumentClick, { passive: true });

        syncThemeColors();
        const observer = new MutationObserver(syncThemeColors);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        animate();
    }

    function syncThemeColors() {
        const isLight = document.documentElement.hasAttribute('data-theme');
        if (scene) {
            scene.fog.color.setHex(isLight ? 0xf0f4ff : 0x070b14);
        }
    }

    function onWindowResize() {
        if (!canvasContainer || !renderer || !camera) return;
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.0012;
        mouseY = (event.clientY - windowHalfY) * 0.0012;
    }

    function onDocumentClick() {
        if (!mainGroup) return;
        let scale = 1.35;
        const duration = 400;
        const startTime = performance.now();

        function pulse() {
            const now = performance.now();
            const progress = (now - startTime) / duration;
            if (progress < 1) {
                const factor = 1 + Math.sin(progress * Math.PI) * 0.25;
                mainGroup.scale.set(factor, factor, factor);
                requestAnimationFrame(pulse);
            } else {
                mainGroup.scale.set(1, 1, 1);
            }
        }
        pulse();
    }

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX * 12;
        camera.position.y = -targetY * 12;
        camera.lookAt(scene.position);

        if (wireMesh) wireMesh.rotation.y = time * 0.15;
        if (wireMesh) wireMesh.rotation.x = time * 0.1;
        if (coreMesh) coreMesh.rotation.y = -time * 0.2;
        if (coreMesh) coreMesh.rotation.z = time * 0.12;
        if (innerCore) innerCore.rotation.x = time * 0.3;

        satellites.forEach((sat, i) => {
            sat.userData.angle += sat.userData.speed * delta * 0.8;
            const a = sat.userData.angle;
            const r = sat.userData.radius;
            sat.position.x = Math.cos(a) * r;
            sat.position.z = Math.sin(a) * r;
            sat.position.y = Math.sin(a * 2 + time) * 2;
            sat.rotation.x += delta * 2;
            sat.rotation.y += delta * 1.5;
        });

        if (starParticles) {
            starParticles.rotation.y = time * 0.02;
            starParticles.rotation.x = time * 0.01;
        }

        if (pointLight1) {
            pointLight1.position.x = Math.sin(time * 0.7) * 15;
            pointLight1.position.y = Math.cos(time * 0.5) * 15;
        }

        if (pointLight2) {
            pointLight2.position.x = Math.cos(time * 0.6) * -15;
            pointLight2.position.y = Math.sin(time * 0.8) * 15;
        }

        renderer.render(scene, camera);
    }

    document.addEventListener('DOMContentLoaded', initThree);
})();