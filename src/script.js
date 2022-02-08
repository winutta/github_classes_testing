import './style.css'
// import * as THREE from 'three'

// import {setup} from "./setup"

// import { setupText } from './textSetup'

// import { textObjManager} from "./TextObjManager"
// import { mouseManager } from "./mouseManager"
// import { clickManager } from "./clickManager"

import {setup,setupText,textObjManager} from "./interface" // how I will use it in the hands scene

// mouseManager, clickManager not necessary here because they are imported elsewhere and thus "initialized"
// But having these imported here might clarify that they have been "initialized"

function main() {

// SCENE SETUP

var {scene, camera, renderer,TWEEN} = setup;

// var mm = mouseManager;
// var tm = textObjManager;
// var cm = clickManager

// Add Text Systems in module

setupText();

// RENDER LOOP

function render(time)
{   
    TWEEN.update(); // update tween animations
    camera.updateCamera(true); // true to pan, false or no arg to not pan, moves camera and has it look at its target
    textObjManager.faceCamera(); //Make all text Objs look flush to the camera
    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




