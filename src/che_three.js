import Che from '@che.js/che';
import * as THREE from 'three';



export class CHE_THREE {
  constructor() {
    this._che = new Che()
    this._mesh = null;

  }

  get che() {
    return this._che
  }

  async loadPly(file) {
    await this._che.loadPly(file);
  }
  get mesh() {
    return this._mesh
  }
  get vertexCount() {
    return this._che.vertexCount
  }

  get halfEdgeCount() {
    return this._che.halfEdgeCount
  }
  get triangleCount() {
    return this._che.triangleCount
  }

  loadLevel1() {
    this._che.loadCheL1()
  }
  loadLevel2() {
    this._che.loadCheL2()
  }
  loadLevel3() {
    this._che.loadCheL3()
  }


  paintVertexStar(vertexId) {
    let verticeList = []
    let colorList = []
    let colorsAvailable = [
      [1, 0, 0],
      [0, 0, 1]
    ]
    console.log(this.che.triangleCount);
    let starOf1 = this.che.relation02(vertexId)
    console.log(starOf1);
    for (let triangleId = 0; triangleId < this.che.triangleCount; triangleId++) {
      let triangleHalfEdges = [
        triangleId * 3,
        triangleId * 3 + 1,
        triangleId * 3 + 2,
      ]
      let colorId = 0;
      if (starOf1.includes(triangleId)) {
        colorId = 1;
        console.log(triangleId);
        console.log(starOf1)
      }
      for (let halfEdge of triangleHalfEdges) {
        let halfEdgeVertex = this.che.getHalfEdgeVertex(halfEdge)
        let vertex = this.che.level0._tableGeometry[halfEdgeVertex]

        // verticeList.push(
        //   vertex._posX,
        //   vertex._posY,
        //   vertex._posZ
        // )
        colorList.push(
          ...colorsAvailable[colorId]
        )
      }


    }
    // const vertices = new Float32Array(verticeList);
    const colors = new Float32Array(colorList)
    // itemSize = 3 because there are 3 values (components) per vertex
    // this._geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this._geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    // var material = new THREE.MeshBasicMaterial({
    //   vertexColors: THREE.VertexColors
    // });
    // this._material = material
    // this._geometry = geometry
    // this._mesh = new THREE.Mesh(geometry, material);
  }

  paintTriangleStar(triangleId) {
    let verticeList = []
    let colorList = []
    let colorsAvailable = [
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0]
    ]
    console.log(this.che.triangleCount);
    let starOf1 = this.che.relation22(triangleId)
    console.log(starOf1);
    for (let triangleIterator = 0; triangleIterator < this.che.triangleCount; triangleIterator++) {
      let triangleHalfEdges = [
        triangleIterator * 3,
        triangleIterator * 3 + 1,
        triangleIterator * 3 + 2,
      ]
      let colorId = 0;
      if (starOf1.includes(triangleIterator)) {
        colorId = 1;
        console.log(triangleIterator);
        console.log(starOf1)
      }
      if (triangleId == triangleIterator) colorId = 2;
      for (let halfEdge of triangleHalfEdges) {
        let halfEdgeVertex = this.che.getHalfEdgeVertex(halfEdge)
        let vertex = this.che.level0._tableGeometry[halfEdgeVertex]

        // verticeList.push(
        //   vertex._posX,
        //   vertex._posY,
        //   vertex._posZ
        // )
        colorList.push(
          ...colorsAvailable[colorId]
        )
      }


    }
    // const vertices = new Float32Array(verticeList);
    const colors = new Float32Array(colorList)
    // itemSize = 3 because there are 3 values (components) per vertex
    // this._geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this._geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    // var material = new THREE.MeshBasicMaterial({
    //   vertexColors: THREE.VertexColors
    // });
    // this._material = material
    // this._geometry = geometry
    // this._mesh = new THREE.Mesh(geometry, material);
  }


  paintCompounds() {
    let verticeList = []
    let colorList = []
    let colorsAvailable = []
    for (let i = 0; i < this.che.level1.compoundCount; i++) {
      colorsAvailable.push(
        [Math.random(), Math.random(), Math.random()]
      )
    }

    for (let triangleId = 0; triangleId < this.che.triangleCount; triangleId++) {
      let triangleHalfEdges = [
        triangleId * 3,
        triangleId * 3 + 1,
        triangleId * 3 + 2,
      ]

      for (let halfEdge of triangleHalfEdges) {
        let halfEdgeVertex = this.che.getHalfEdgeVertex(halfEdge)
        let colorId = this.che.level1.getCompound(halfEdgeVertex);

        colorList.push(
          ...colorsAvailable[colorId]
        )
      }


    }
    // const vertices = new Float32Array(verticeList);
    const colors = new Float32Array(colorList)
    // itemSize = 3 because there are 3 values (components) per vertex
    // this._geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this._geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    // var material = new THREE.MeshBasicMaterial({
    //   vertexColors: THREE.VertexColors
    // });
    // this._material = material
    // this._geometry = geometry
    // this._mesh = new THREE.Mesh(geometry, material);
  }

  createMesh() {
    const geometry = new THREE.BufferGeometry();
    let verticeList = []
    let colorList = []
    for (let triangleId = 0; triangleId < this.che.triangleCount; triangleId++) {
      let triangleHalfEdges = [
        triangleId * 3,
        triangleId * 3 + 1,
        triangleId * 3 + 2,
      ]
      for (let halfEdge of triangleHalfEdges) {
        let halfEdgeVertex = this.che.getHalfEdgeVertex(halfEdge)
        let vertex = this.che.level0._tableGeometry[halfEdgeVertex]

        verticeList.push(
          vertex._posX,
          vertex._posY,
          vertex._posZ
        )

        colorList.push(
          Math.random(), Math.random(), Math.random()
        )
      }


    }
    const vertices = new Float32Array(verticeList);
    const colors = new Float32Array(colorList)
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    var material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors
    });
    this._material = material
    this._geometry = geometry
    this._mesh = new THREE.Mesh(geometry, material);
  }
}