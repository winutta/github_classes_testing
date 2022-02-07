import {Text} from 'troika-three-text'
import * as THREE from 'three'

// Allows for a persistent blurbManager
// that can be used to update the blurb empties to face the camera

// when blurbs are instantiated they are added to blurbManager's blurbs list
// camera is added as a property to blurbManager in setup.js just after instantiation

export class TextObjManager {
    constructor(){
        this.textObjs = [];
    }

    faceCamera(){
        var cameraDir = this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-1.);
        this.textObjs.forEach((textObj)=>{
            textObj.faceDirection(cameraDir);
        });
    }
}

var textObjManager = new TextObjManager();

export {textObjManager}