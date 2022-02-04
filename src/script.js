import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

import vertShader from "./shaders/vertShader.glsl"
import fragShader from "./shaders/fragShader.glsl"

import {Text} from 'troika-three-text'

import {blurbSystem} from "./Blurb.js"

import {mouseManager,tester} from "./clickTest.js"


function main() {

// Add comment

//Comment from the edit branch

const TWEEN = require('@tweenjs/tween.js')
// ROLL THE SCENE			

var scene = new THREE.Scene({ antialias: true });
scene.background = new THREE.Color( 0x1c1c1c );


// CAMERA SETUP

var camera = new THREE.PerspectiveCamera( 53, window.innerWidth / window.innerHeight, 0.25, 2000 );
camera.position.set(0.,0.,8.);

var basePosition = new THREE.Vector3(0,0,8);
var defaultTarget = new THREE.Vector3(0,0,0);
var defaultPosition = new THREE.Vector3(0,0,8);
camera.target = new THREE.Vector3(0,0,0);
camera.basePosition = basePosition;
camera.defaultPosition = defaultPosition;
camera.defaultTarget = defaultTarget;

// RENDERER SETUP

var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

const container = document.createElement( 'div' );
document.body.appendChild( container );
container.appendChild( renderer.domElement );

//ORBIT CONTROL

// const controls = new OrbitControls( camera, renderer.domElement );
// controls.update();

// var canvas = renderer.domElement;

// canvas.onclick = function() {
//   // canvas.requestPointerLock();
//   if (canvas.requestFullscreen) {
//         canvas.requestFullscreen();
//       } else if (canvas.mozRequestFullScreen) { /* Firefox */
//         canvas.mozRequestFullScreen();
//       } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
//         canvas.webkitRequestFullscreen();
//       } else if (canvas.msRequestFullscreen) { /* IE/Edge */
//         canvas.msRequestFullscreen();
//       }
// }



var blurb1Options = {
	popoutText: "Jack Sprat could eat no fat. His wife could eat no lean. So between the two of them, they licked the platter clean.",
	buttonText: "J",
	position: new THREE.Vector3(-2,-2,0),
	offset: new THREE.Vector3(3,2,0),
	scene: scene,
	name: "jack",
}

var blurb2Options = {
	popoutText: "Blah aahsjdn shdcn skjdnc kjsndc iewkmd eikd kdkdo dk dodk os kdko dkd kdkd d.",
	buttonText: "H",
	position: new THREE.Vector3(2,2,0),
	offset: new THREE.Vector3(3,2,0),
	scene: scene,
	name: "blah",
}

var blurb3Options = {
	popoutText: "Can I even do this?.",
	buttonText: "C",
	position: new THREE.Vector3(2,-2,-2),
	offset: new THREE.Vector3(3,2,0),
	scene: scene,
	name: "can",
}

var blurb1 = new blurbSystem(blurb1Options);
var blurb2 = new blurbSystem(blurb2Options);
var blurb3 = new blurbSystem(blurb3Options);

var blurbs = [blurb1,blurb2,blurb3];

//all buttons and popouts

var allClickable = [];
blurbs.forEach((element)=>{
	var buttonMesh = element.button.Background;
	var popoutMesh = element.popout.Background;
	allClickable.push(buttonMesh,popoutMesh);
});


// ADD TWEEN ANIMATIONS ON CLICK

//how can I modulize this part so I can easily add it to the hand scene?
//want to have the functions that I can run in the render function and then I want the on click and an on move functions to take effect



//the on move function affects the hit variable that is used in the on click function
//the on move function needs the clickableBlurbMeshes to do the raycasting.

//need to have the tweens defined for the shrink and grow functions

var mouseManagerConfig = {
	TWEEN: TWEEN,
	camera: camera,
	allClickable: allClickable,
}

var manager = new mouseManager(mouseManagerConfig);

// it would be nice to have a satisfying bounce to the button when you press it, via some easing function.

// RESIZE

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.setSize( width,height);
}

//Make blurbs face the camera.

function updateBlurbs(){
	var offsetVector = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-1.);
	blurbs.forEach((element) => {
		element.faceCamera(offsetVector);
	})
}

function updateCamera(){
	camera.lookAt(camera.target);
}

// RENDER LOOP

function render(time)
{   
	TWEEN.update();
	updateCamera();
	manager.updateCameraDampened();
	updateBlurbs();
	

    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




