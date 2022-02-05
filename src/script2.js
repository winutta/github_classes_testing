import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {Text} from 'troika-three-text'

import {setup} from "./setup.js"


function main() {

// SCENE SETUP

var {scene, camera, renderer} = setup();




// RENDER LOOP

function render(time)
{   
	
    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




