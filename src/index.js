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
  let ply = await fetch(filename);
  await che.loadPly(ply)
  document.querySelector("#vertexCount").textContent = che.vertexCount
  document.querySelector("#triangleCount").textContent = che.triangleCount
  document.querySelector("#heCount").textContent = che.triangleCount * 3
  che.loadLevel1()
  che.createMesh()
  che.addMesh();
  che.createControls();
  world.createLights();
  animate();
  await che.cleanL1();
  document.querySelector("#paintOppositeHe").disabled = true
  world.resetCamera();
}


load_che('plys/sphere.ply')
const files = ['sphere.ply', 'opensphere.ply', 'teapot.ply', 'cone.ply', 'chopper.ply', 'shoe.ply', 'bunny.ply', 'venusmilo.ply', 'che.ply']
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
  }
)


document.querySelector("#paintR00button").addEventListener(
  'click',
  function () {
    let vertexId = parseInt(prompt("Choose the vertex you want to paint the star"))
    che.paintR00(vertexId - 1)
  }
)


document.querySelector("#paintR10button").addEventListener(
  'click',
  function () {
    let heId = parseInt(prompt("Choose the half-edge"))
    che.paintR10(heId)
  }
)

document.querySelector("#paintR02button").addEventListener(
  'click',
  function () {
    let vertexId = parseInt(prompt("Choose the vertex you want to paint the star"))
    che.paintR02(vertexId)
  }
)


document.querySelector("#paintR12button").addEventListener(
  'click',
  function () {
    let halfEdgeId = parseInt(prompt("Choose the half-edge you want to paint the star"))
    che.paintR12(halfEdgeId)
  }
)

document.querySelector("#paintR22button").addEventListener(
  'click',
  function () {
    let triangleId = parseInt(prompt("Choose the triangle you want to paint the star"))
    console.time('r22')
    let start = performance.now()
    che.paintR22(triangleId)
    console.timeEnd('r22')
    let end = performance.now()
    console.log(`Tempo R22: ${end - start}`)
  }
)

select.addEventListener('change', () => {
  world.clearScene()
  document.querySelector("#enableTriangleObj").checked = true
  document.querySelector("#enableVertexObj").checked = false
  document.querySelector("#enableEdgeObj").checked = false
  document.querySelector("#enablePhong").checked = false
  che.cleanL1();
  document.querySelector("#enableL1").checked = false;
  che.cleanL2();
  document.querySelector("#enableL2").checked = false;
  che.cleanL3();
  document.querySelector("#enableL3").checked = false;
  che = null;

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


document.querySelector("#enablePhong").addEventListener(
  'change',
  function () {
    if (this.checked) {
      che.setPhongMaterial();
    } else {
      che.setBasicMaterial();
    }
  }
)



document.querySelector("#enableL1").addEventListener(
  'change',
  async function () {
    if (this.checked) {
      che.loadLevel1();
      document.querySelector("#paintOppositeHe").disabled = false
    } else {
      document.querySelector("#paintOppositeHe").disabled = true
      await che.cleanL1();
    }
  }
)



document.querySelector("#enableL2").addEventListener(
  'change',
  function () {
    if (this.checked) {
      che.loadLevel2();
    } else {
      che.cleanL2();
    }
  }
)



document.querySelector("#enableL3").addEventListener(
  'change',
  function () {
    if (this.checked) {
      che.loadLevel3();
    } else {
      che.cleanL3();
    }
  }
)

let halfEdgeId = 0
document.querySelector("#paintHe").addEventListener(
  'click',
  () => {
    che.paintHalfEdges(118 / 255, 88 / 255, 152 / 255)
    halfEdgeId = parseInt(prompt("Choose the half-edge you want to show"))
    document.querySelector("#currentHe").textContent = halfEdgeId
    che.createHalfEdge(halfEdgeId, 82 / 255, 208 / 255, 83 / 255)
  }
)

document.querySelector("#paintOppositeHe").addEventListener(
  'click',
  () => {
    che.paintHalfEdges(118 / 255, 88 / 255, 152 / 255)

    halfEdgeId = che._che.getOppositeHalfEdge(halfEdgeId);
    document.querySelector("#currentHe").textContent = halfEdgeId
    che.createHalfEdge(halfEdgeId, 82 / 255, 208 / 255, 83 / 255)
  }
)


document.querySelector("#paintNextHe").addEventListener(
  'click',
  () => {
    che.paintHalfEdges(118 / 255, 88 / 255, 152 / 255)

    halfEdgeId = che._che.nextHalfEdge(halfEdgeId);
    document.querySelector("#currentHe").textContent = halfEdgeId
    che.createHalfEdge(halfEdgeId, 82 / 255, 208 / 255, 83 / 255)
  }
)


document.querySelector("#paintPreviousHe").addEventListener(
  'click',
  () => {
    che.paintHalfEdges(118 / 255, 88 / 255, 152 / 255)
    halfEdgeId = che._che.previousHalfEdge(halfEdgeId);
    document.querySelector("#currentHe").textContent = halfEdgeId
    che.createHalfEdge(halfEdgeId, 82 / 255, 208 / 255, 83 / 255)
  }
)



document.querySelector("#clearHe").addEventListener(
  'click',
  () => {
    che.removeHalfEdges();
  }
)

document.querySelector("#screenshot").addEventListener(
  'click',
  () => {
    var imgData, imgNode;
    var strDownloadMime = "image/octet-stream";

    try {
      var strMime = "image/jpeg";
      imgData = world._renderer.domElement.toDataURL(strMime);

      saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");

    } catch (e) {
      console.log(e);
      return;
    }

  }

)

var saveFile = function (strData, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = strData;
    link.click();
    document.body.removeChild(link); //remove the link when done
  } else {
    location.replace(uri);
  }
}

function animate() {
  requestAnimationFrame(animate);
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.02;
  //world.controls.update();
  world.renderer.render(world.scene, world.camera);
}