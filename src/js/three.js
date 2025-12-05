// import * as T from 'three';
// // eslint-disable-next-line import/no-unresolved
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import fragment from '../shaders/fragment.glsl';
// import vertex from '../shaders/vertex.glsl';

// const device = {
//   width: window.innerWidth,
//   height: window.innerHeight,
//   pixelRatio: window.devicePixelRatio
// };

// export default class Three {
//   constructor(canvas) {
//     this.canvas = canvas;

//     this.scene = new T.Scene();

//     this.camera = new T.PerspectiveCamera(
//       75,
//       device.width / device.height,
//       0.1,
//       100
//     );
//     this.camera.position.set(0, 0, 2);
//     this.scene.add(this.camera);

//     this.renderer = new T.WebGLRenderer({
//       canvas: this.canvas,
//       alpha: true,
//       antialias: true,
//       preserveDrawingBuffer: true
//     });
//     this.renderer.setSize(device.width, device.height);
//     this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));

//     this.controls = new OrbitControls(this.camera, this.canvas);

//     this.clock = new T.Clock();

//     this.setLights();
//     this.setGeometry();
//     this.render();
//     this.setResize();
//   }

//   setLights() {
//     this.ambientLight = new T.AmbientLight(new T.Color(1, 1, 1, 1));
//     this.scene.add(this.ambientLight);
//   }

//   setGeometry() {
//     this.planeGeometry = new T.PlaneGeometry(1, 1, 128, 128);
//     this.planeMaterial = new T.ShaderMaterial({
//       side: T.DoubleSide,
//       wireframe: true,
//       fragmentShader: fragment,
//       vertexShader: vertex,
//       uniforms: {
//         progress: { type: 'f', value: 0 }
//       }
//     });

//     this.planeMesh = new T.Mesh(this.planeGeometry, this.planeMaterial);
//     this.scene.add(this.planeMesh);
//   }

//   render() {
//     const elapsedTime = this.clock.getElapsedTime();

//     this.planeMesh.rotation.x = 0.2 * elapsedTime;
//     this.planeMesh.rotation.y = 0.1 * elapsedTime;

//     this.renderer.render(this.scene, this.camera);
//     requestAnimationFrame(this.render.bind(this));
//   }

//   setResize() {
//     window.addEventListener('resize', this.onResize.bind(this));
//   }

//   onResize() {
//     device.width = window.innerWidth;
//     device.height = window.innerHeight;

//     this.camera.aspect = device.width / device.height;
//     this.camera.updateProjectionMatrix();

//     this.renderer.setSize(device.width, device.height);
//     this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
//   }
// }

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


const initThreeJS = () => {
    // 1. Setup
    const canvas = document.querySelector('#webgl');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.05); // Density fog

    const sizes = { width: window.innerWidth, height: window.innerHeight };
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 5;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false }); // False for crisp pixels
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. The Ryoji Ikeda / Matrix Tunnel Object
    // We use points for a "particle data" look
    const geometry = new THREE.BufferGeometry();
    const count = 10000;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for(let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Create a tunnel shape
        const radius = 2 + Math.random() * 3;
        const angle = Math.random() * Math.PI * 2;
        const z = (Math.random() - 0.5) * 50; 

        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.sin(angle) * radius;
        positions[i3 + 2] = z;

        randoms[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // CUSTOM SHADER: The "Data Stream" look
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#ffffff') }
        },
        transparent: true,
        vertexShader: `
            uniform float uTime;
            attribute float aRandom;
            varying float vAlpha;

            void main() {
                vec3 pos = position;
                
                // Move particles towards camera
                pos.z = mod(position.z + uTime * 10.0, 50.0) - 25.0;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;

                // Size depends on depth (closer = bigger)
                gl_PointSize = (50.0 / -mvPosition.z);

                // Flash effect based on randomness and time
                vAlpha = step(0.9, sin(uTime * 10.0 + aRandom * 100.0));
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            varying float vAlpha;

            void main() {
                // Square pixels for "digital" look
                if (vAlpha < 0.5) discard;
                gl_FragColor = vec4(uColor, 1.0);
            }
        `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Post Processing (The "Ksawery Komputery" Glow & Glitch)
    const composer = new EffectComposer(renderer);
    
    // Render Pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom Pass (Glow)
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // Strength
        0.4, // Radius
        0.85 // Threshold
    );
    composer.addPass(bloomPass);

    // Glitch Pass (Optional - Uncomment if you want the screen to shake)
    /*
    const glitchPass = new GlitchPass();
    glitchPass.goWild = false; 
    composer.addPass(glitchPass); 
    */

    // 4. Resize Handle
    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        composer.setSize(sizes.width, sizes.height);
    });

    // 5. Animate
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Update Shader
        material.uniforms.uTime.value = elapsedTime;

        // Camera subtle rotation
        camera.rotation.z = elapsedTime * 0.1;

        // Render via Composer (important!)
        composer.render();
        window.requestAnimationFrame(tick);
        
        // Update FPS counter
        document.getElementById('fps').innerText = Math.round(1 / clock.getDelta());
    };

    tick();
};

export default initThreeJS;