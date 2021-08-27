import * as THREE from 'three';
import {
  CHE_THREE
} from './che_three'

import {
  World
} from './world'

const world = new World()
world.setCameraPos(0, 0, 8);
let che = null;

async function load_che(filename) {

  che = new CHE_THREE(world);
  window.che = che;
  await che.loadPly(filename)
  document.querySelector("#vertexCount").textContent = che.vertexCount
  document.querySelector("#triangleCount").textContent = che.triangleCount
  che.loadLevel1()
  che.createMesh()

  che.addMesh();



  animate();
}


load_che('plys/sphere.ply')
const files = ['sphere.ply', 'teapot.ply', 'cone.ply', 'chopper.ply', 'shoe.ply', 'bunny.ply']
let select = document.querySelector("#ply_select")
for (let file of files) {
  let option = document.createElement("option")
  option.text = file.split('.')[0]
  option.value = file
  select.add(option)
}

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

document.querySelector("#paintVertexTriangleStarButton").addEventListener(
  'click',
  function () {
    let vertexId = parseInt(prompt("Choose the vertex you want to paint the star"))
    che.paintR02(vertexId - 1)
  }
)


document.querySelector("#paintEdgeTriangleStarButton").addEventListener(
  'click',
  function () {
    let halfEdgeId = parseInt(prompt("Choose the half-edge you want to paint the star"))
    che.paintR12(halfEdgeId - 1)
  }
)

document.querySelector("#paintTriangleTriangleStarButton").addEventListener(
  'click',
  function () {
    let triangleId = parseInt(prompt("Choose the triangle you want to paint the star"))
    che.paintR22(triangleId - 1)
  }
)

select.addEventListener('change', () => {
  world.clearScene()
  document.querySelector("#enableVertexObj").checked = false
  document.querySelector("#enableEdgeObj").checked = false
  load_che(`plys/${select.value}`)
})

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  world.camera.aspect = window.innerWidth / window.innerHeight;
  world.camera.updateProjectionMatrix();

  world.renderer.setSize(window.innerWidth, window.innerHeight);

}

window.world = world
document.querySelector("#enableTriangleObj").addEventListener(
  'change',
  function () {
    if (this.checked) {
      che.addMesh();
    } else {
      che.removeMesh();
    }
  }
)

document.querySelector("#enableEdgeObj").addEventListener(
  'change',
  function () {
    if (this.checked) {
      che.addEdges();
    } else {
      che.removeEdges();
    }
  }
)
document.querySelector("#enableVertexObj").addEventListener(
  'change',
  function () {
    if (this.checked) {
      che.addVertex();
    } else {
      che.removeVertex();
    }
  }
)

function animate() {
  requestAnimationFrame(animate);
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.02;
  world.controls.update();
  world.renderer.render(world.scene, world.camera);
}