// import {Text} from 'troika-three-text'
import * as THREE from 'three'
import { mouseManager} from "./movementManagers"

export class CustomCamera extends THREE.PerspectiveCamera {
    constructor(fov, aspect, near, far){
        super(fov,aspect,near,far);
        this.mouse = mouseManager.mouse;
        mouseManager.camera = this;
        this.cameraBase = new THREE.Group();
        this.cameraBase.position.set(0., 0., 8);
        this.cameraBase.add(this);
        this.target = new THREE.Vector3(0., 0., 0.);
        this.defaultTarget = this.target.clone();
        this.basePosition = this.cameraBase.position.clone();
        this.defaultPosition = this.cameraBase.position.clone();



        this.offsetScale = 4.;
        this.currOffset = new THREE.Vector3(0., 0., 0.);

    }

    updateCameraPan() {

        var newOffset = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.);
        newOffset.multiplyScalar(this.offsetScale);
        var directionOffset = new THREE.Vector3();
        directionOffset.subVectors(newOffset, this.currOffset);
        directionOffset.multiplyScalar(0.06);
        this.currOffset.add(directionOffset);

        var matrixElems = this.cameraBase.matrixWorld.elements;
        
        var xAxis = new THREE.Vector3(matrixElems[0], matrixElems[1], matrixElems[2]);
        var yAxis = new THREE.Vector3(matrixElems[4], matrixElems[5], matrixElems[6]);

        var xContrib = xAxis.clone().multiplyScalar(this.currOffset.x);
        var yContrib = yAxis.clone().multiplyScalar(this.currOffset.y);

        var worldOffset = xContrib.add(yContrib);

        var currPos = new THREE.Vector3();
        currPos.addVectors(this.basePosition, worldOffset);
        this.cameraBase.position.copy(currPos);

        // console.log(this.cameraBase.position);

        this.lookAt(this.target);
    }
}
