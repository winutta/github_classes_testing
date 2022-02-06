import './style.css'
import * as THREE from 'three'

import {setup} from "./setup.js"

import { CircleText, SquareText} from "./core/TextClasses.js"
import { textObjManager} from "./TextObjManager.js"

function main() {

// SCENE SETUP

var {scene, camera, renderer} = setup();



// ADD NEW 

var sq2 = new SquareText("Hello",[0,2,0]);
scene.add(sq2);

var sq3 = new CircleText("B", [2,0,0]);
scene.add(sq3)


// RENDER LOOP

function render(time)
{   
    textObjManager.faceCamera();
    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




