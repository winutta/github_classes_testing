import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

import vertShader from "./shaders/vertShader.glsl"
import fragShader from "./shaders/fragShader.glsl"

import {Text} from 'troika-three-text'




function main() {

const TWEEN = require('@tweenjs/tween.js')
// ROLL THE SCENE			

var scene = new THREE.Scene({ antialias: true });
scene.background = new THREE.Color( 0x1c1c1c );


// CAMERA SETUP

var camera = new THREE.PerspectiveCamera( 53, window.innerWidth / window.innerHeight, 0.25, 2000 );
camera.position.set(0.,0.,8.);

// RENDERER SETUP

var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

const container = document.createElement( 'div' );
document.body.appendChild( container );
container.appendChild( renderer.domElement );

//ORBIT CONTROL

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


// CREATE TEXT

var systemEmpty = new THREE.Group();
scene.add(systemEmpty);

const textObj = new Text();

var offset = 0.1;
var mWidth = 4.;
var mHeight = 1. 

textObj.text = "Jack Sprat could eat no fat. His wife could eat no lean. So between the two of them, they licked the platter clean.";
textObj.fontSize = 0.2;
textObj.lineHeight = 1.5;
textObj.textAlign = "center";
textObj.position.set(0.,0.,0.1);
textObj.maxWidth = mWidth;
textObj.anchorX = "center";
textObj.anchorY = "50%";
textObj.font = "DancingScript-Regular.ttf"
textObj.letterSpacing = 0.1

var planeEmpty;
var shrinkPlane;
var growPlane;

textObj.sync(() => {
	const {min,max} = textObj.geometry.boundingBox;
	var heightText = max.y - min.y;
	var widthText = max.x - min.x;

	const geometry = new THREE.PlaneGeometry( 1, 1 );
	const planeMat = new THREE.MeshBasicMaterial({color: "black"});
	//this could be a shader, where you just make the edges rounded via some math tbd
	const planeMesh = new THREE.Mesh(geometry,planeMat);
	planeMesh.scale.set(mWidth + 2*offset,heightText + 2*offset,1.);
	planeMesh.name = "planeMesh";

	planeEmpty = new THREE.Object3D();
	planeEmpty.position.set(3.,2.,0.);
	planeEmpty.add(planeMesh);
	planeEmpty.add(textObj);

	systemEmpty.add(planeEmpty);
	shrinkPlane = new TWEEN.Tween(planeEmpty).to({scale:{x:0.,y:0,z:1},position:{x:0,y:0,z:0}},1000);
	growPlane = new TWEEN.Tween(planeEmpty).to({scale:{x:1,y:1,z:1},position:{x:3,y:2,z:0}},1000);
});

const buttonLetter = new Text();
buttonLetter.text = "J"
buttonLetter.fontSize = 0.2;
buttonLetter.lineHeight = 1.5;
buttonLetter.textAlign = "center";
buttonLetter.position.set(0.,0.,0.1);
buttonLetter.maxWidth = 1;
buttonLetter.anchorX = "center";
buttonLetter.anchorY = "50%";
buttonLetter.font = "DancingScript-Regular.ttf"
buttonLetter.letterSpacing = 0.1

var buttonEmpty;

buttonLetter.sync(()=>{
	const {min,max} = buttonLetter.geometry.boundingBox;
	var heightText = max.y - min.y;
	var widthText = max.x - min.x;

	var bGeom = new THREE.CircleGeometry(0.25,32);
	const bMat = new THREE.MeshBasicMaterial({color: "black"});
	const buttonMesh = new THREE.Mesh(bGeom,bMat);
	buttonMesh.name = "buttonMesh";

	buttonEmpty = new THREE.Group();
	buttonEmpty.position.set(0,0.,0.);
	buttonEmpty.add(buttonMesh);
	buttonEmpty.add(buttonLetter);
	systemEmpty.add(buttonEmpty);
	// scene.add(buttonEmpty);
});


//Invisible object 1 parent to button and button letter
//Invisible object 2 parent to plane and plane text
//Invisible object parent to 1 and 2

//maybe make a class for this type of system so I can have mutiple buttons
//input is text, button letter, button position, plane offset from button

// ADD TWEEN animation

var grow = true;
var previousTime = Date.now();
var mouseOnButton = false;
var mouseOnPlane = false;
function toggleGrowShrink(e){
	// console.log(mouseOnButton);
	if(planeEmpty && growPlane && shrinkPlane){
		if(grow && !mouseOnButton && !mouseOnPlane){
			grow = false;
			growPlane.stop();
			var timeDiff = Date.now() - previousTime;
			var timeLeft = timeDiff;
			if(timeLeft > 500){timeLeft = 500;}
			shrinkPlane = new TWEEN.Tween(planeEmpty).to({scale:{x:0.,y:0,z:1},position:{x:0,y:0,z:0}},timeLeft).easing(TWEEN.Easing.Quadratic.In);
			shrinkPlane.start();
			previousTime = Date.now();
			
		} else if(mouseOnButton) {
			grow = true;
			shrinkPlane.stop();
			var timeDiff = Date.now() - previousTime;
			var timeLeft = timeDiff;
			if(timeLeft > 1000){timeLeft = 1000;}
			growPlane = new TWEEN.Tween(planeEmpty).to({scale:{x:1,y:1,z:1},position:{x:3,y:2,z:0}},timeLeft).easing(TWEEN.Easing.Back.Out);
			growPlane.start();
			previousTime = Date.now();
			
		}
		
		//Back seems like the best option for this kind of menu pop out.
	}
}

window.addEventListener("click",toggleGrowShrink,false);

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function onMouseMove(e){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


	if(planeEmpty.children && buttonEmpty.children){
		rayCast();
	}
	
}

function rayCast(){
	raycaster.setFromCamera(mouse,camera);


	var intersects = raycaster.intersectObjects([planeEmpty.children[0], buttonEmpty.children[0]]);
	// if(intersects.length == 0){
	// 	mouseOnButton = false;
	// 	mouseOnPlane = false;
	// }
	mouseOnButton = false;
	mouseOnPlane = false;

	intersects.forEach((element) => {
		var name = element.object.name;
		console.log(name);
		if(name == "buttonMesh"){
			mouseOnButton = true;
		} else if(name == "planeMesh"){
			mouseOnPlane = true; 
		}
	});


	// console.log(intersects);

	// var planeIntersect =
	// var buttonIntersect =  
}

window.addEventListener("mousemove",onMouseMove,false);

// now I want to do the object selection on the button to trigger the growing, and clicking anywhere else to shrink : DONE
// Also want to add the camera zoom in with a tween similar to the plane stuff, Can it be in the same tween?
// Also want to see how to do the mousemove camera pan when the camera isnt in the basic position,
// maybe I can push it in the local x,y directions via camera.matrixWorld.elements 1,2,3 for x and 4,5,6 for y

//Then when it all works, or maybe sooner I want to put the whole button-plane system in an object
// this will keep it organized and easily create more, 
// also maybe can pipe some of the plane obejcts and camera zoom positions from there

// can i use promises whenever there is a callback so I can put all the system creation in a seperate module.
// kinda sucks to have to check if the variables exist to run stuff in the render loop or on events.
// maybe i can use a method on a class that checks for the definition of an attribute, this is kinda nice.

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

function updateCamera(){
	var offsetVector = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-1.);

	if(buttonEmpty){
		var buttonTarget = buttonEmpty.getWorldPosition(new THREE.Vector3()).add(offsetVector);
		buttonEmpty.lookAt(buttonTarget);
	}
	if(planeEmpty){
		var planeTarget = planeEmpty.getWorldPosition(new THREE.Vector3()).add(offsetVector);
		planeEmpty.lookAt(planeTarget);
	}
}

// RENDER LOOP

function render(time)
{   
	updateCamera();
	TWEEN.update();
    renderer.render(scene,camera);
    requestAnimationFrame ( render );
}

requestAnimationFrame ( render );

}

main();




