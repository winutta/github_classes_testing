// import {Text} from 'troika-three-text'
import * as THREE from 'three'
import { setup } from './setup';
import { mouseManager} from "./mouseManager"
import { textObjManager } from './TextObjManager';


// animations activated on click

export class TweenAnimation {
    constructor(reciever, baseProperties, targetProperties, easeForward, easeBackward) {
        var { TWEEN } = setup;

        this.TWEEN = TWEEN;

        this.forwardTween = new TWEEN.Tween();
        this.forwardEasing = TWEEN.Easing.Quadratic[easeForward];
        this.backwardTween = new TWEEN.Tween();
        this.backwardEasing = TWEEN.Easing.Quadratic[easeBackward];

        this.reciever = reciever;

        this.targetProperties = targetProperties;
        this.baseProperties = baseProperties;

    }

    forward(timeDiff) {
        // console.log("moving forward");
        if (this.backwardTween._isPlaying) {
            this.backwardTween.stop();
        }
        this.forwardTween = new this.TWEEN.Tween(this.reciever).to(this.targetProperties, timeDiff).easing(this.forwardEasing);
        this.forwardTween.start();

    }

    backward(timeDiff) {
        // console.log("moving backward");
        if (this.forwardTween._isPlaying) {
            this.forwardTween.stop();
        }
        this.backwardTween = new this.TWEEN.Tween(this.reciever).to(this.baseProperties, timeDiff).easing(this.backwardEasing);
        this.backwardTween.start();
    }
}

// handle clicks

export class ClickManager {
    constructor(){
        
        this.mouse = mouseManager.mouse;
        this.camera = setup.camera;

        this.raycaster = new THREE.Raycaster();

        this.hit = {
            hit: false,
            kind: null,
            system: null,
        }

        this.activeSystem = null;
        this.previousTime = 0;

        window.addEventListener("click", this, false);

    }

    shrink(system) {
        var timeDiff = Date.now() - system.previousTime;
        if (timeDiff > 500) { timeDiff = 500; }

        system.runBackward(timeDiff);

        system.previousTime = Date.now();
    }

    grow(system) {
        var timeDiff = Date.now() - system.previousTime;
        if (timeDiff > 500) { timeDiff = 500; }

        system.runForward(timeDiff);

        system.previousTime = Date.now();
    }



    toggleGrowShrink(e){
        console.log(this.hit);
		if(this.activeSystem){
			if(this.hit.system != this.activeSystem){
				this.shrink(this.activeSystem)
				this.activeSystem = null;
			}
		} else {
			if(this.hit.kind == "button"){
				this.activeSystem = this.hit.system;
				this.grow(this.activeSystem);
			}
		}
	}

    handleEvent(e){
        if(e.type == "click"){
			// console.log("trying to click");
            this.rayCast();
			this.toggleGrowShrink(e);
		}
	}

    

    rayCast() {
        // console.log("try to raycast");
        this.raycaster.setFromCamera(this.mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(textObjManager.allClickable);
        console.log(intersects);
        if (intersects.length == 0) {
            this.hit.hit = false;
            this.hit.kind = null;
            this.hit.system = null;
        } else {
            var firstHit = intersects[0].object;
            this.hit.hit = true;
            this.hit.kind = firstHit.textObj.kind;
            this.hit.system = firstHit.textObj.System;
        }
    }

    
}

var clickManager = new ClickManager();

export { clickManager }
