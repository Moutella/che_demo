import Che from '@che.js/che.js';
import * as THREE from 'three';



export class CHE_THREE {
  constructor(world) {
    this._che = new Che()
    this._meshObject = null;
    this._edgeObject = null;
    this._vertexObject = null;
    this._edgeList = [];
    this._paintedTriangles = []
    this._paintedEdges = []
    this._paintedVertex = []
    this._world = world;
  }

  get che() {
    return this._che
  }

  async loadPly(file) {
    await this._che.loadPly(file);
  }
  get mesh() {
    return this._meshObject
  }
  get edgeList() {
    return this._edgeList;
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


  paintR02(vertexId) {
    this.clearPainted()
    for (let paintedTriangle of this._paintedTriangles) {
      this.paintTriangle(paintedTriangle, 1, 0, 0)
    }
    this.paintVertex(vertexId, 0, 1, 0);
    this._paintedVertex.push(vertexId);
    let starOfVertex = this.che.relation02(vertexId)
    starOfVertex.map(
      (tri) => {
        this.paintTriangle(tri, 0, 0, 1)
      }
    )

    this._paintedTriangles.push(...starOfVertex)

  }

  paintR12(halfEdgeId) {
    this.clearPainted()

    this.paintEdge(halfEdgeId, 0, 1, 0);
    this._paintedEdges.push(halfEdgeId);
    let starOfHE = this.che.relation12(halfEdgeId)

    starOfHE.map(
      (tri) => {
        this.paintTriangle(tri, 0, 0, 1)
      }
    )

    this._paintedTriangles.push(...starOfHE)

  }

  paintR22(triangleId) {
    this.clearPainted()

    let starOf1 = this.che.relation22(triangleId)
    this._paintedTriangles.push(triangleId);
    this.paintTriangle(triangleId, 0, 1, 0)
    starOf1.map(
      (tri) => {
        this.paintTriangle(tri, 0, 0, 1)
      }
    )

    this._paintedTriangles.push(...starOf1)
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

    const colors = new Float32Array(colorList)
    this._geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }

  createMesh() {
    const geometry = new THREE.BufferGeometry();
    this._vertexList = []
    this._colorVertexList = []
    this._edgeList = []
    this._edgeColorList = []
    this._enlargedVertexList = []

    for (let triangleId = 0; triangleId < this.che.triangleCount; triangleId++) {
      let triangleHalfEdges = [
        triangleId * 3,
        triangleId * 3 + 1,
        triangleId * 3 + 2,
      ]
      for (let halfEdge of triangleHalfEdges) {
        let halfEdgeVertex = this.che.getHalfEdgeVertex(halfEdge);
        let vertex = this.che.level0._tableGeometry[halfEdgeVertex];

        this._vertexList.push(
          vertex._posX,
          vertex._posY,
          vertex._posZ
        )

        this._colorVertexList.push(
          1, 0, 0
        )


        let oppositeHalfEdge = this.che.getOppositeHalfEdge(halfEdge);
        if (oppositeHalfEdge == -1 || oppositeHalfEdge > this._edgeList.length / 2) {
          let nextHalfEdge = this.che.nextHalfEdge(halfEdge);
          let nextHalfEdgeVertex = this.che.getHalfEdgeVertex(nextHalfEdge)
          let nextVertex = this.che.level0._tableGeometry[nextHalfEdgeVertex];
          this._edgeList.push(
            this.vertexToVector3(vertex),
            this.vertexToVector3(nextVertex)
          );
          this._edgeColorList.push(0.25, 0.25, 0.25, 0.25, 0.25, 0.25)
          this._paintedEdges.push(halfEdge);
        }



      }


    }

    const vertices = new Float32Array(this._vertexList);
    const colors = new Float32Array(this._colorVertexList)
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    var material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors
    });
    this._material = material
    this._geometry = geometry
    this._meshObject = new THREE.Mesh(geometry, material);
    this.createEdgeObjects();
    this.createVertexObject();
  }


  createEdgeObjects() {
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints(this._edgeList)
    edgeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(
      this._edgeColorList, 3
    ))
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true
    })
    this._edgeObject = new THREE.LineSegments(edgeGeometry, lineMat)
  }

  createVertexObject() {
    let threeVertices = []
    let threeColors = []
    const loader = new THREE.TextureLoader();
    const texture = loader.load('text/disc.png');

    for (let vertex of this.che.level0._tableGeometry) {

      threeVertices.push(this.vertexToVector3(vertex))
      this._paintedVertex.push(vertex);
      threeColors.push(.25, .25, .25);
    }
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(threeVertices);
    pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(
      threeColors, 3
    ))
    const pointsMaterial = new THREE.PointsMaterial({
      size: threeVertices.length,
      vertexColors: true,
      map: texture,
      size: 0.08,
      alphaTest: 0.5

    });

    this._vertexObject = new THREE.Points(pointsGeometry, pointsMaterial);




  }
  vertexToVector3(vertex) {
    return new THREE.Vector3(
      vertex._posX,
      vertex._posY,
      vertex._posZ);
  }

  paintTriangle(t, r, g, b) {
    for (let i = 0; i < 3; i++) {
      this._meshObject.geometry.attributes.color.array[t * 9 + i * 3] = r
      this._meshObject.geometry.attributes.color.array[t * 9 + i * 3 + 1] = g
      this._meshObject.geometry.attributes.color.array[t * 9 + i * 3 + 2] = b
    }
    this._meshObject.geometry.attributes.color.needsUpdate = true
  }

  paintVertex(v, r, g, b) {
    this._vertexObject.geometry.attributes.color.array[v * 3] = r
    this._vertexObject.geometry.attributes.color.array[v * 3 + 1] = g
    this._vertexObject.geometry.attributes.color.array[v * 3 + 2] = b
    this._vertexObject.geometry.attributes.color.needsUpdate = true
  }

  paintEdge(he, r, g, b) {
    let oppositeHe = this.che.getOppositeHalfEdge(he)
    if (oppositeHe != -1) {
      he = Math.min(he, oppositeHe)
    }
    for (let i = 0; i < 2; i++) {
      this._edgeObject.geometry.attributes.color.array[he * 6 + i * 3] = r
      this._edgeObject.geometry.attributes.color.array[he * 6 + 1 + i * 3] = g
      this._edgeObject.geometry.attributes.color.array[he * 6 + 2 + i * 3] = b
    }

    this._edgeObject.geometry.attributes.color.needsUpdate = true
  }
  addMesh() {
    this._world.scene.add(this._meshObject);
  }
  removeMesh() {
    this._world.scene.remove(this._meshObject);
  }

  addEdges() {

    this._world.scene.add(this._edgeObject);

  }
  removeEdges() {

    this._world.scene.remove(this._edgeObject);

  }

  addVertex() {

    this._world.scene.add(this._vertexObject);

  }

  removeVertex() {
    this._world.scene.remove(this._vertexObject);

  }
  clearPainted() {
    for (let paintedTriangle of this._paintedTriangles) {
      this.paintTriangle(paintedTriangle, 1, 0, 0)
    }
    this._paintedTriangles = []
    for (let paintedEdge of this._paintedEdges) {
      this.paintEdge(paintedEdge, 0, 0, 0)
    }
    this._paintedEdges = []
    for (let paintedVertex of this._paintedVertex) {
      this.paintVertex(paintedVertex, .25, .25, .25)
    }
    this._paintedVertex = []
  }

}