import './style.css'
import * as THREE from 'three'

import {setup} from "./setup"

import { CircleText, SquareText, TextSystem} from "./core/TextClasses"
import { textObjManager} from "./TextObjManager"
import { setupText } from './textSetup'

function main() {

// SCENE SETUP

var {scene, camera, renderer} = setup;

// ADD NEW 

var sq2 = new SquareText("Hello",[0,2,0]);
scene.add(sq2);

var sq3 = new CircleText("B", [2,0,0]);
scene.add(sq3)

// Text System 

var tsconfig1 = {
    buttonText: "H",
    popoutText: "Hi there",
    popoutOffset: [-2,0,0],
    position: [0,0,0], 
}

var ts = new TextSystem(tsconfig1); 

// Add Text Systems in module

setupText();


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




