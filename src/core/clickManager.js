// import {Text} from 'troika-three-text'
import * as THREE from 'three'
import { mouseManager} from "../movementManagers"
import { setup } from '../setup';
import { textObjManager } from '../TextObjManager';

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

    // Maybe just make a property tweens that has a list of tweens;
    // Maybe handling time should be done at the textSystem level
    // so switching textSystems doesnt cause the next one to open super fast

    shrink(system) {
        // var timeDiff = Date.now() - this.previousTime;
        var timeDiff = Date.now() - system.previousTime;
        if (timeDiff > 500) { timeDiff = 500; }

        system.runBackward(timeDiff);

        system.previousTime = Date.now();
    }

    grow(system) {
        var timeDiff = Date.now() - system.previousTime;
        if (timeDiff > 500) { timeDiff = 500; }

        system.runForward(timeDiff);

        // system.popoutTween.forward(timeDiff);

        // system.cameraPosTween.forward(timeDiff);

        // system.cameraTargetTween.forward(timeDiff);

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
