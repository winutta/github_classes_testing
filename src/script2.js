import './style.css'
import * as THREE from 'three'

import {setup} from "./setup"

import { CircleText, SquareText, TextSystem} from "./core/TextClasses"
import { textObjManager} from "./TextObjManager"
import { setupText } from './textSetup'
import {mouseManager, TweenAnimation} from "./movementManagers"
import {clickManager} from "./core/clickManager"



function main() {

// SCENE SETUP

var {scene, camera, renderer,TWEEN} = setup;

// var cameraMove = new TweenAnimation(camera, {position: new THREE.Vector3(1,0,8)}, "InOut","InOut");
// cameraMove.forward(1000);
// setTimeout(()=>{cameraMove.backward(1000)},1000);

// Add Text Systems in module

setupText();

// RENDER LOOP

function render(time)
{   
    TWEEN.update();
    camera.updateCameraPan();
    textObjManager.faceCamera();
    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




