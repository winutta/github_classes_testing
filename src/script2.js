import './style.css'
import * as THREE from 'three'

import {setup} from "./setup.js"

import { SquareText} from "./core/Blurb2.js"


function main() {

// SCENE SETUP

var {scene, camera, renderer} = setup();

// ADD NEW SQUARE TEXT

var sq2 = new SquareText("Goodbye",[2,0,0]);
scene.add(sq2);

var sq2 = new SquareText("Goodbye",[0,0,0]);
scene.add(sq2);
var sq2 = new SquareText("Goodbye",[2,2,0]);
scene.add(sq2);

var sq2 = new SquareText("Goodbye",[0,1,0]);
scene.add(sq2);


// RENDER LOOP

function render(time)
{   
	
    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




