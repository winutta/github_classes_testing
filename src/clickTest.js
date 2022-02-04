function logClick(e){
	console.log("click logged.")
}

function setupLogClick(){
	window.addEventListener("click",logClick,false);
}

function tester(){
	this.test = "hello";

	// this.printTest = function(event){
	// 	console.log(event.type);
	// }

	// this.printTest();

	this.handleEvent = function(e){
		// this.printTest(e);
		console.log("event handled");
	}

	window.addEventListener("mousemove",this,false);
}

//what gets referenced in the click code?

//
import * as THREE from 'three'

function mouseManager(config){
	this.hit = {
		hit: false,
		name: null,
		kind: null,
		system: null,
	}

	this.activeBlurb = null;
	this.TWEEN = config.TWEEN;
	this.camera = config.camera;
	this.allClickable = config.allClickable;

	this.shrinkTween = new this.TWEEN.Tween();
	this.growTween = new this.TWEEN.Tween();
	this.zoomOutTween = new this.TWEEN.Tween();
	this.zoomInTween = new this.TWEEN.Tween();
	this.panOutTween = new this.TWEEN.Tween();
	this.panInTween = new this.TWEEN.Tween();

	this.previousTime = 0;

	this.shrink = function(blurb){
		var timeDiff = Date.now() - this.previousTime;
		if(timeDiff > 500){timeDiff = 500;}

		if(this.growTween._isPlaying){
			this.growTween.stop();
		}
		this.shrinkTween = new this.TWEEN.Tween(blurb.popout.Empty).to({scale:{x:0.,y:0,z:1},position:{x:0,y:0,z:0}},timeDiff).easing(this.TWEEN.Easing.Quadratic.In);
		this.shrinkTween.start();
		

		if(this.zoomInTween._isPlaying){
			this.zoomInTween.stop();
		}
		this.zoomOutTween = new this.TWEEN.Tween(this.camera).to({basePosition:this.camera.defaultPosition},timeDiff).easing(this.TWEEN.Easing.Quadratic.InOut);
		this.zoomOutTween.start();

		if(this.panInTween._isPlaying){
			this.panInTween.stop();
		}
		this.panOutTween = new this.TWEEN.Tween(this.camera).to({target:this.camera.defaultTarget},timeDiff).easing(this.TWEEN.Easing.Quadratic.InOut);
		this.panOutTween.start();

		this.previousTime = Date.now();
	}

	this.grow = function(blurb){
		var timeDiff = Date.now() - this.previousTime;
		if(timeDiff > 500){timeDiff = 500;}

		if(this.shrinkTween._isPlaying){
			this.shrinkTween.stop();
		}
		this.growTween = new this.TWEEN.Tween(blurb.popout.Empty).to({scale:{x:1,y:1,z:1},position:{x:3,y:2,z:0}},timeDiff).easing(this.TWEEN.Easing.Back.Out);
		this.growTween.start();

		if(this.zoomOutTween._isPlaying){
			this.zoomOutTween.stop();
		}
		this.zoomInTween = new this.TWEEN.Tween(this.camera).to({basePosition:{x:-4,y:2,z:8}},timeDiff).easing(this.TWEEN.Easing.Quadratic.InOut);
		this.zoomInTween.start();

		if(this.panOutTween._isPlaying){
			this.panOutTween.stop();
		}
		this.panInTween = new this.TWEEN.Tween(this.camera).to({target:blurb.system.position},timeDiff).easing(this.TWEEN.Easing.Quadratic.InOut);
		this.panInTween.start();

		this.previousTime = Date.now();
	}

	this.toggleGrowShrink = function(e){
		if(this.activeBlurb){
			if(this.hit.system != this.activeBlurb){
				this.shrink(this.activeBlurb)
				this.activeBlurb = null;
			}
		} else {
			if(this.hit.kind == "button"){
				this.activeBlurb = this.hit.system;
				this.grow(this.activeBlurb);
			}
		}
	}

	

	this.mouse = new THREE.Vector2();
	this.raycaster = new THREE.Raycaster();

	this.rayCast = function(){
		this.raycaster.setFromCamera(this.mouse,this.camera);
		var intersects = this.raycaster.intersectObjects(this.allClickable);
		if(intersects.length == 0){
			this.hit.hit = false;
			this.hit.name = null;
			this.hit.kind = null;
			this.hit.system = null;
		} else {
			var firstHit = intersects[0].object; 
			this.hit.hit = true;
			this.hit.name = firstHit.name;
			this.hit.kind = firstHit.kind;
			this.hit.system = firstHit.Blurb.system;
		}
	}

	this.onMouseMove = function(e){
		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		this.rayCast();
	}

	this.handleEvent = function(e){
		// console.log("event recieved");
		if(e.type == "mousemove"){
			this.onMouseMove(e);
		} else if(e.type == "click"){
			// console.log("trying to click");
			this.toggleGrowShrink(e);
		}
	}

	window.addEventListener("mousemove",this,false);
	window.addEventListener("click",this,false);



	this.offsetScale = 4.;
	this.currOffset = new THREE.Vector3(0.,0.,0.);

	this.updateCameraDampened = function(){
	  
	  var newOffset = new THREE.Vector3(this.mouse.x,this.mouse.y,0.);
	  newOffset.multiplyScalar(this.offsetScale);
	  var directionOffset = new THREE.Vector3();
	  directionOffset.subVectors(newOffset,this.currOffset);
	  directionOffset.multiplyScalar(0.06);
	  this.currOffset.add(directionOffset);

	  var matrixElems = this.camera.matrixWorld.elements;
	  var xAxis = new THREE.Vector3(matrixElems[0],matrixElems[1],matrixElems[2]);
	  var yAxis = new THREE.Vector3(matrixElems[4],matrixElems[5],matrixElems[6]);

	  var xContrib = xAxis.clone().multiplyScalar(this.currOffset.x);
	  var yContrib = yAxis.clone().multiplyScalar(this.currOffset.y);

	  var worldOffset = xContrib.add(yContrib);

	  var currPos = new THREE.Vector3();
	  currPos.addVectors(this.camera.basePosition,worldOffset);
	  this.camera.position.copy(currPos);
	}

}


export{mouseManager,tester};