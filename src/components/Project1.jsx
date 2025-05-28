import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Project1() {
  // Function to setup and manage the 3D scene
  const createScene = () => {
    // Create a new Three.js scene
    const scene = new THREE.Scene();

    // Setup the camera with perspective projection
    const camera = new THREE.PerspectiveCamera(
      100, // Field of view in degrees
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      100 // Far clipping plane
    );
    camera.position.z = 3; // Move camera back to view the scene

    // Initialize the WebGL renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a green cube mesh
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1), // Create cube geometry
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }) // Green material
    );
    scene.add(cube); // Add cube to the scene
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20), // Create cube geometry
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }) // Green material
    );
    scene.add(sphere); // Add cube to the scene

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;

    // Animation loop function
    function animate() {
      requestAnimationFrame(animate); // Request next frame
      // Rotate cube on x and y axes
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera); // Render the scene
    }
    animate(); // Start animation loop

    // Handle window resize events
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove event listener and renderer
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(renderer.domElement);
    };
  };

  // Initialize scene when component mounts
  useEffect(() => {
    createScene();
  }, []);

  // Return empty div as React requires a return value
  return <div />;
}
