import Che from '@che.js/che.js';
//import Che from '../../../che.js'
import * as THREE from 'three';
import {
  LineMaterial
} from 'three/examples/jsm/lines/LineMaterial'
import {
  LineSegments2
} from 'three/examples/jsm/lines/LineSegments2'
import {
  LineSegmentsGeometry
} from 'three/examples/jsm/lines/LineSegmentsGeometry'


export class CHE_THREE {
  constructor(world) {
    this._che = new Che()

    this._meshObject = null;
    this._edgeObject = null;
    this._vertexObject = null;
    this._halfEdgeObject = null;

    this._edgeList = [];
    this._paintedTriangles = []
    this._paintedEdges = []
    this._paintedVertex = []

    this._edgeMap = new Map()

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

  paintR00(vertexId) {
    this.clearPainted()
    this.paintVertex(vertexId, 0, 1, 0);
    this._paintedVertex.push(vertexId);
    let r00vertex = this.che.relation00(vertexId);
    r00vertex.map(
      (vertex) => {
        this.paintVertex(vertex, 230, 0, 126)
      }
    )
    this._paintedVertex.push(...r00vertex)
  }

  paintR02(vertexId) {
    this.clearPainted()
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

  paintR10(halfEdgeId) {
    this.clearPainted()

    this.paintEdge(halfEdgeId, 0, 1, 0);
    this._paintedEdges.push(halfEdgeId);
    let starOfEdge = this.che.relation10(halfEdgeId)

    starOfEdge.map(
      (vertex) => {
        this.paintVertex(vertex, 0, 0, 1);
      }
    )

    this._paintedVertex.push(...starOfEdge);

  }

  paintR12(halfEdgeId) {
    this.clearPainted()

    this.paintEdge(halfEdgeId, 230, 0, 126);
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
        if (oppositeHalfEdge != -1) {
          halfEdge = Math.min(halfEdge, oppositeHalfEdge)
        }

        if (oppositeHalfEdge == -1 || !this._edgeMap.has(halfEdge)) {
          let nextHalfEdge = this.che.nextHalfEdge(halfEdge);
          let nextHalfEdgeVertex = this.che.getHalfEdgeVertex(nextHalfEdge)
          let nextVertex = this.che.level0._tableGeometry[nextHalfEdgeVertex];
          this._edgeList.push(
            this.vertexToVector3(vertex),
            this.vertexToVector3(nextVertex)
          );

          this._edgeMap.set(halfEdge, this._paintedEdges.length)
          this._edgeColorList.push(1, 1, 1, 1, 1, 1)

          if (oppositeHalfEdge != -1) {
            halfEdge = Math.min(halfEdge, oppositeHalfEdge)
          }

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
    console.log(this._edgeList)
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints(this._edgeList)
    edgeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(
      this._edgeColorList, 3
    ))
    // const lineMat = new THREE.LineBasicMaterial({
    //   vertexColors: true,
    //   linewidth: 5
    // })
    let lineGeometry = new LineSegmentsGeometry().setPositions(edgeGeometry.attributes.position.array)
    lineGeometry.setColors(edgeGeometry.attributes.color.array)
    // lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(
    //   this._edgeColorList, 3
    // ))
    var lineMaterial = new LineMaterial({
      color: 0xffffff,
      linewidth: 5, // in world units with size attenuation, pixels otherwise
      vertexColors: true,

      //resolution:  // to be set by renderer, eventually
      dashed: false,
      alphaToCoverage: true,
    });

    lineMaterial.resolution.set(window.innerWidth, window.innerHeight); // important, for now...

    this._edgeObject = new LineSegments2(lineGeometry, lineMaterial);

    //  = new THREE.LineSegments(edgeGeometry, lineMat)
  }

  // createEdgeObjects() {
  //   const edgeGeometry = new THREE.BufferGeometry().setFromPoints(this._edgeList)
  //   edgeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(
  //     this._edgeColorList, 3
  //   ))
  //   const lineMat = new THREE.LineBasicMaterial({
  //     vertexColors: true
  //   })
  //   this._edgeObject = new THREE.LineSegments(edgeGeometry, lineMat)
  // }

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
    let edgeId = this._edgeMap.get(he);
    for (let i = 0; i < 2; i++) {
      this._edgeObject.geometry.attributes.instanceColorStart.array[edgeId * 6 + i * 3] = r
      this._edgeObject.geometry.attributes.instanceColorStart.array[edgeId * 6 + 1 + i * 3] = g
      this._edgeObject.geometry.attributes.instanceColorStart.array[edgeId * 6 + 2 + i * 3] = b
      // this._edgeObject.geometry.attributes.instanceColorEnd.array[he * 6 + i * 3] = r
      // this._edgeObject.geometry.attributes.instanceColorEnd.array[he * 6 + 1 + i * 3] = g
      // this._edgeObject.geometry.attributes.instanceColorEnd.array[he * 6 + 2 + i * 3] = b
    }

    this._edgeObject.geometry.attributes.instanceColorEnd.needsUpdate = true
  }

  createHalfEdge(he, r, g, b) {

    let heStart = this._che.getVertex(this._che.getHalfEdgeVertex(he));
    let heEnd = this._che.getVertex(this.che.getHalfEdgeVertex(this._che.nextHalfEdge(he)));

    let tri1center = this._che.getTriangleCenter(this._che.triangle(he))

    let heStartVertex = this.vertexToVector3(heStart)
    let endVertex = this.vertexToVector3(heEnd)
    let centerVertex = this.vertexToVector3(tri1center)



    let centerVectorFromStart = centerVertex.clone().sub(heStartVertex)
    let centerVectorFromEnd = centerVertex.clone().sub(endVertex)

    let heEndVertex = endVertex.clone().add(centerVectorFromEnd.clone().divideScalar(5))
    heStartVertex.add(centerVectorFromStart.clone().divideScalar(5))

    let edgeSize = heStartVertex.clone().sub(heEndVertex).divideScalar(4).length();
    let halfEdgeArrowVertex = heEndVertex.clone().add(centerVectorFromEnd.clone().multiplyScalar(edgeSize))






    let segmentHe = [
      heStartVertex,
      heEndVertex,
      heEndVertex,
      halfEdgeArrowVertex
    ]
    console.log(segmentHe)
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints(segmentHe)
    // edgeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(
    //   this._edgeColorList, 3
    // ))
    let lineGeometry = new LineSegmentsGeometry().setPositions(edgeGeometry.attributes.position.array)
    // lineGeometry.setColors(edgeGeometry.attributes.color.array)
    var lineMaterial = new LineMaterial({
      color: new THREE.Color(r, g, b),
      linewidth: 15,
      dashed: false,
      alphaToCoverage: true,
    });

    lineMaterial.resolution.set(window.innerWidth, window.innerHeight); // important, for now...

    this._halfEdgeObject = new LineSegments2(lineGeometry, lineMaterial);
    this._world.scene.add(this._halfEdgeObject);


  }

  // paintEdge(he, r, g, b) {
  //   let oppositeHe = this.che.getOppositeHalfEdge(he)
  //   if (oppositeHe != -1) {
  //     he = Math.min(he, oppositeHe)
  //   }
  //   for (let i = 0; i < 2; i++) {
  //     this._edgeObject.geometry.attributes.color.array[he * 6 + i * 3] = r
  //     this._edgeObject.geometry.attributes.color.array[he * 6 + 1 + i * 3] = g
  //     this._edgeObject.geometry.attributes.color.array[he * 6 + 2 + i * 3] = b
  //   }

  //   this._edgeObject.geometry.attributes.color.needsUpdate = true
  // }
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
      this.paintEdge(paintedEdge, 1, 1, 1)
    }
    this._paintedEdges = []
    for (let paintedVertex of this._paintedVertex) {
      this.paintVertex(paintedVertex, .25, .25, .25)
    }
    this._paintedVertex = []
  }

}