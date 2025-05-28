import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Project2() {
  const createScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableX = true;
    controls.enableY = true;
    controls.enableZ = true;

    // Box
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
    box.position.x = -2;
    box.position.y = -2;
    scene.add(box);

    // Sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    sphere.position.x = -2;
    sphere.position.y = 0;
    scene.add(sphere);

    // Cone
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 2, 32),
      new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    );
    cone.position.x = -2;
    cone.position.y = 2;
    scene.add(cone);

    // Cylinder
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true })
    );
    cylinder.position.x = 0;
    cylinder.position.y = -2;
    scene.add(cylinder);

    // Torus
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.2, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
    );
    torus.position.x = 0;
    torus.position.y = 0;
    scene.add(torus);

    // TorusKnot
    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16),
      new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
    );
    torusKnot.position.x = 0;
    torusKnot.position.y = 2;
    scene.add(torusKnot);

    // Dodecahedron
    const dodecahedron = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.7),
      new THREE.MeshBasicMaterial({ color: 0xff8000, wireframe: true })
    );
    dodecahedron.position.x = 2;
    dodecahedron.position.y = -2;
    scene.add(dodecahedron);

    // Octahedron
    const octahedron = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.7),
      new THREE.MeshBasicMaterial({ color: 0x8000ff, wireframe: true })
    );
    octahedron.position.x = 2;
    octahedron.position.y = 0;
    scene.add(octahedron);

    // Icosahedron
    const icosahedron = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.7),
      new THREE.MeshBasicMaterial({ color: 0xff0080, wireframe: true })
    );
    icosahedron.position.x = 2;
    icosahedron.position.y = 2;
    scene.add(icosahedron);

    function animate() {
      requestAnimationFrame(animate);

      // Rotate all objects
      scene.children.forEach((child) => {
        if (child.type === "Mesh") {
          child.rotation.x += 0.01;
          child.rotation.y += 0.01;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(renderer.domElement);
    };
  };

  useEffect(() => {
    createScene();
  }, []);

  return <div />;
}
