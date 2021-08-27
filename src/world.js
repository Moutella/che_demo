import * as THREE from 'three';
import {
  OrbitControls
} from './OrbitControls';



export class World {
  constructor() {

    this._scene = new THREE.Scene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
  }


  get scene() {
    return this._scene
  }
  get camera() {
    return this._camera
  }
  get renderer() {
    return this._renderer
  }

  get controls() {
    return this._controls
  }



  createCamera() {
    this._camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
  }
  createRenderer() {
    const rendererElement = document.querySelector("body")
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    rendererElement.appendChild(this._renderer.domElement);
  }

  createControls() {
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.listenToKeyEvents(window);
    this._controls.keys = {
      LEFT: 'KeyA', //left arrow
      UP: 'KeyW', // up arrow
      RIGHT: 'KeyD', // right arrow
      BOTTOM: 'KeyS' // down arrow
    }
  }

  setCameraPos(x, y, z) {
    this._camera.position.x = x
    this._camera.position.y = y
    this._camera.position.z = z
  }

  clearScene() {
    while (this._scene.children.length > 0) {
      this._scene.remove(this._scene.children[0]);
    }
  }
}