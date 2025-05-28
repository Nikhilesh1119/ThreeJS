import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Project3() {
  const createScene = () => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 7;
    // Set up scene background
    scene.background = new THREE.Color(0x1a1a1a);

    // Helper function to rotate a face
    const rotateFace = (axis, layer, angle) => {
      const rotationMatrix = new THREE.Matrix4();
      const pivotPoint = new THREE.Vector3();
      
      if (axis === 'x') rotationMatrix.makeRotationX(angle);
      if (axis === 'y') rotationMatrix.makeRotationY(angle); 
      if (axis === 'z') rotationMatrix.makeRotationZ(angle);

      // Find center of rotation
      let centerX = 0, centerY = 0, centerZ = 0;
      const affectedCubelets = cubelets.filter(cubelet => {
        if (axis === 'x') return Math.abs(cubelet.position.x - layer * (size + gap)) < 0.01;
        if (axis === 'y') return Math.abs(cubelet.position.y - layer * (size + gap)) < 0.01;
        if (axis === 'z') return Math.abs(cubelet.position.z - layer * (size + gap)) < 0.01;
      });

      affectedCubelets.forEach(cubelet => {
        centerX += cubelet.position.x;
        centerY += cubelet.position.y;
        centerZ += cubelet.position.z;
      });

      pivotPoint.set(
        centerX / affectedCubelets.length,
        centerY / affectedCubelets.length,
        centerZ / affectedCubelets.length
      );

      affectedCubelets.forEach(cubelet => {
        // Store original position
        const originalPosition = cubelet.position.clone();

        // Apply rotation around pivot
        cubelet.position.sub(pivotPoint);
        cubelet.position.applyMatrix4(rotationMatrix);
        cubelet.position.add(pivotPoint);

        // Apply rotation to cubelet itself
        if (axis === 'x') {
          cubelet.rotateX(angle);
        } else if (axis === 'y') {
          cubelet.rotateY(angle);
        } else if (axis === 'z') {
          cubelet.rotateZ(angle);
        }

        // Snap to grid
        cubelet.position.x = Math.round(cubelet.position.x / (size + gap)) * (size + gap);
        cubelet.position.y = Math.round(cubelet.position.y / (size + gap)) * (size + gap);
        cubelet.position.z = Math.round(cubelet.position.z / (size + gap)) * (size + gap);
      });
    };

    // Add keyboard controls
    const handleKeyDown = (event) => {
      const rotationAngle = Math.PI / 2;
      switch(event.key.toLowerCase()) {
        case 'r': // Right face
          rotateFace('x', 1, rotationAngle);
          break;
        case 'l': // Left face
          rotateFace('x', -1, -rotationAngle);
          break;
        case 'u': // Up face
          rotateFace('y', 1, -rotationAngle);
          break;
        case 'd': // Down face
          rotateFace('y', -1, rotationAngle);
          break;
        case 'f': // Front face
          rotateFace('z', 1, -rotationAngle);
          break;
        case 'b': // Back face
          rotateFace('z', -1, rotationAngle);
          break;
        case 's': // Scramble
          const scrambleSequence = async () => {
            for(let i = 0; i < 20; i++) {
              const faces = ['x', 'y', 'z'];
              const layers = [-1, 1];
              const randomFace = faces[Math.floor(Math.random() * faces.length)];
              const randomLayer = layers[Math.floor(Math.random() * layers.length)];
              const randomAngle = Math.PI / 2 * (Math.random() < 0.5 ? 1 : -1);
              rotateFace(randomFace, randomLayer, randomAngle);
              // Add small delay between moves
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          };
          scrambleSequence();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = false;
    controls.rotateSpeed = 0.5;
    controls.minPolarAngle = Math.PI/4;
    controls.maxPolarAngle = Math.PI*3/4;

    // Create Rubik's Cube
    const cubeGroup = new THREE.Group();
    const cubelets = [];
    const size = 1;
    const gap = 0.01; // Original gap
    const colors = [
      0xff0000, // red - right
      0xff8c00, // orange - left
      0xffffff, // white - top
      0xffff00, // yellow - bottom
      0x00ff00, // green - front
      0x0000ff, // blue - back
    ];

    // Create 27 small cubes (3x3x3)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(size * 0.9, size * 0.9, size * 0.9); // Even smaller cubes
          const materials = [];

          // Assign colors to faces based on position
          materials.push(new THREE.MeshBasicMaterial({ 
            color: x === 1 ? colors[0] : (x === -1 ? colors[1] : 0x282828),
            side: THREE.DoubleSide
          }));  // right/left
          materials.push(new THREE.MeshBasicMaterial({ 
            color: x === -1 ? colors[1] : (x === 1 ? colors[0] : 0x282828),
            side: THREE.DoubleSide
          })); // left/right
          materials.push(new THREE.MeshBasicMaterial({ 
            color: y === 1 ? colors[2] : (y === -1 ? colors[3] : 0x282828),
            side: THREE.DoubleSide
          }));  // top/bottom
          materials.push(new THREE.MeshBasicMaterial({ 
            color: y === -1 ? colors[3] : (y === 1 ? colors[2] : 0x282828),
            side: THREE.DoubleSide
          })); // bottom/top
          materials.push(new THREE.MeshBasicMaterial({ 
            color: z === 1 ? colors[4] : (z === -1 ? colors[5] : 0x282828),
            side: THREE.DoubleSide
          }));  // front/back
          materials.push(new THREE.MeshBasicMaterial({ 
            color: z === -1 ? colors[5] : (z === 1 ? colors[4] : 0x282828),
            side: THREE.DoubleSide
          })); // back/front

          const cubelet = new THREE.Mesh(geometry, materials);
          cubelet.position.set(
            x * (size + gap),
            y * (size + gap),
            z * (size + gap)
          );

          cubelets.push(cubelet);
          cubeGroup.add(cubelet);
        }
      }
    }

    scene.add(cubeGroup);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.removeChild(renderer.domElement);
    };
  };

  useEffect(() => {
    createScene();
  }, []);

  return (
    <div style={{position: 'relative'}}>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        Controls:<br/>
        R - Right face<br/>
        L - Left face<br/>
        U - Up face<br/>
        D - Down face<br/>
        F - Front face<br/>
        B - Back face<br/>
        S - Scramble
      </div>
    </div>
  );
}
