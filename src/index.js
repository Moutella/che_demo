import * as THREE from 'three';
import CHE_, {
  CHE_THREE
} from './che_three'
import {
  OrbitControls
} from './OrbitControls';
const rendererElement = document.querySelector("body")

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
rendererElement.appendChild(renderer.domElement);
camera.position.z = 8;



const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);
controls.keys = {
  LEFT: 'KeyA', //left arrow
  UP: 'KeyW', // up arrow
  RIGHT: 'KeyD', // right arrow
  BOTTOM: 'KeyS' // down arrow
}

function setCameraZ(position) {
  camera.position.z = position
}


const che = new CHE_THREE();

async function load_che(filename) {
  await che.loadPly(filename)
  document.querySelector("#vertexCount").textContent = che.vertexCount
  document.querySelector("#triangleCount").textContent = che.triangleCount
  che.loadLevel1()
  che.createMesh()

  let mesh = che.mesh;
  scene.add(mesh);

  function animate() {
    requestAnimationFrame(animate);
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    controls.update();
    renderer.render(scene, camera);
  }
  var geo = new THREE.WireframeGeometry(mesh.geometry); // or 
  var mat = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  var wireframe = new THREE.LineSegments(geo, mat);
  mesh.add(wireframe);
  animate();
}

load_che('plys/sphere.ply')
const files = ['cone', 'example', 'sphere', 'teste']

function resetScene() {
  scene.clear()
}

document.querySelector("#paintCompound").addEventListener(
  'click',
  function (event) {
    che.paintCompounds()
    console.log("paintCompounds")
  }
)
// document.querySelector("#vertexPicker").addEventListener(
//   'input',
//   function (event) {
//     let vertexId = document.querySelector("#vertexPicker").value
//     che.paintStar(vertexId - 1)
//   }
// )


document.querySelector("#paintVertexTriangleStarButton").addEventListener(
  'click',
  function () {
    let vertexId = parseInt(prompt("Choose the vertex you want to paint the star"))
    che.paintVertexStar(vertexId - 1)
  }
)

document.querySelector("#paintTriangleTriangleStarButton").addEventListener(
  'click',
  function () {
    let triangleId = parseInt(prompt("Choose the triangle you want to paint the star"))
    che.paintTriangleStar(triangleId - 1)
  }
)