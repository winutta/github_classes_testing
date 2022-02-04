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

// var manager = new mouseManager(mouseManagerConfig);
// console.log(manager);
// var testing = new tester();

var hit = {
	hit: false,
	name: null,
	kind: null,
	system: null,
}

var activeBlurb = null;

var shrinkTween = new TWEEN.Tween();
var growTween = new TWEEN.Tween();

var zoomOutTween = new TWEEN.Tween(blurb1.popout.Empty).to({scale:{x:0.,y:0,z:1},position:{x:0,y:0,z:0}},1000);
var zoomInTween = new TWEEN.Tween(blurb1.popout.Empty).to({scale:{x:1,y:1,z:1},position:{x:3,y:2,z:0}},1000);

var panOutTween = new TWEEN.Tween(blurb1.popout.Empty).to({scale:{x:0.,y:0,z:1},position:{x:0,y:0,z:0}},1000);
var panInTween = new TWEEN.Tween(blurb1.popout.Empty).to({scale:{x:1,y:1,z:1},position:{x:3,y:2,z:0}},1000);




var previousTime = 0;

function shrink(blurb){
	var timeDiff = Date.now() - previousTime;
	if(timeDiff > 500){timeDiff = 500;}

	if(growTween._isPlaying){
		growTween.stop();
	}
	shrinkTween = new TWEEN.Tween(blurb.popout.Empty).to({scale:{x:0.,y:0,z:1},position:{x:0,y:0,z:0}},timeDiff).easing(TWEEN.Easing.Quadratic.In);
	shrinkTween.start();
	previousTime = Date.now();

	if(zoomInTween._isPlaying){
		zoomInTween.stop();
	}
	zoomOutTween = new TWEEN.Tween(camera).to({basePosition:defaultPosition},timeDiff).easing(TWEEN.Easing.Quadratic.InOut);
	zoomOutTween.start();

	if(panInTween._isPlaying){
		panInTween.stop();
	}
	panOutTween = new TWEEN.Tween(camera).to({target:defaultTarget},timeDiff).easing(TWEEN.Easing.Quadratic.InOut);
	panOutTween.start();
}

function grow(blurb){
	var timeDiff = Date.now() - previousTime;
	if(timeDiff > 500){timeDiff = 500;}

	if(shrinkTween._isPlaying){
		shrinkTween.stop();
	}
	growTween = new TWEEN.Tween(blurb.popout.Empty).to({scale:{x:1,y:1,z:1},position:{x:3,y:2,z:0}},timeDiff).easing(TWEEN.Easing.Back.Out);
	growTween.start();

	if(zoomOutTween._isPlaying){
		zoomOutTween.stop();
	}
	zoomInTween = new TWEEN.Tween(camera).to({basePosition:{x:4,y:2,z:6}},timeDiff).easing(TWEEN.Easing.Quadratic.InOut);
	zoomInTween.start();

	if(panOutTween._isPlaying){
		panOutTween.stop();
	}
	panInTween = new TWEEN.Tween(camera).to({target:blurb.system.position},timeDiff).easing(TWEEN.Easing.Quadratic.InOut);
	panInTween.start();

	previousTime = Date.now();
}

var activeBlurb; 

function toggleGrowShrink(e){
	if(activeBlurb){
		if(hit.system != activeBlurb){
			shrink(activeBlurb)
			activeBlurb = null;
		}
	} else {
		if(hit.kind == "button"){
			activeBlurb = hit.system;
			grow(activeBlurb);
		}
	}
}

window.addEventListener("click",toggleGrowShrink,false);




// GET MOUSE POS and GET HIT INFO

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function rayCast(){
	raycaster.setFromCamera(mouse,camera);
	var intersects = raycaster.intersectObjects(allClickable);
	if(intersects.length == 0){
		hit.hit = false;
		hit.name = null;
		hit.kind = null;
		hit.system = null;
	} else {
		var firstHit = intersects[0].object; 
		hit.hit = true;
		hit.name = firstHit.name;
		hit.kind = firstHit.kind;
		hit.system = firstHit.Blurb.system;
	}
}

function onMouseMove(e){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	rayCast();
}

window.addEventListener("mousemove",onMouseMove,false);


// UPDATE CAMERA POSITION FROM MOUSE MOVEMENT

var offsetScale = 4.;
var currOffset = new THREE.Vector3(0.,0.,0.);

function updateCameraDampened(){
  
  var newOffset = new THREE.Vector3(mouse.x,mouse.y,0.);
  newOffset.multiplyScalar(offsetScale);
  var directionOffset = new THREE.Vector3();
  directionOffset.subVectors(newOffset,currOffset);
  directionOffset.multiplyScalar(0.06);
  currOffset.add(directionOffset);

  var matrixElems = camera.matrixWorld.elements;
  var xAxis = new THREE.Vector3(matrixElems[0],matrixElems[1],matrixElems[2]);
  var yAxis = new THREE.Vector3(matrixElems[4],matrixElems[5],matrixElems[6]);

  var xContrib = xAxis.clone().multiplyScalar(currOffset.x);
  var yContrib = yAxis.clone().multiplyScalar(currOffset.y);

  var worldOffset = xContrib.add(yContrib);

  var currPos = new THREE.Vector3();
  currPos.addVectors(camera.basePosition,worldOffset);
  camera.position.copy(currPos);

}

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
	updateCamera()
	updateBlurbs();
	// manager.updateCameraDampened();
	updateCameraDampened();

    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




