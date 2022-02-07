// import {Text} from 'troika-three-text'
import * as THREE from 'three'
import { setup } from './setup'


// I may need to write this differently, 
// because its not necessarily true that I will be reusing the same backwards and forwards tweens

// Althought maybe i could,
// Maybe I should instantiate TweenAnimations on each textSystem

// One for scaling and shifting the popout
// One for moving the camera in front of it
// One for targeting the button with the camera.

// Some redundancy with the backward animations moving back to camera default position and target

// May run into issues with multiple TweenAnimations existing at once.
// But hopefully if the right animations are called based on whether you have already clicked on one

// Maybe just pass in base value object so there is no copying. 
// Plus this will be necessary for the camera offset


export class TweenAnimation {
    constructor(reciever,baseProperties,targetProperties,easeForward, easeBackward){
        var {TWEEN} = setup;

        this.TWEEN = TWEEN;

        this.forwardTween = new TWEEN.Tween();
        this.forwardEasing = TWEEN.Easing.Quadratic[easeForward];
        this.backwardTween = new TWEEN.Tween();
        this.backwardEasing = TWEEN.Easing.Quadratic[easeBackward];

        this.reciever = reciever;

        this.targetProperties = targetProperties;
        this.baseProperties = baseProperties;

        console.log("target :", this.targetProperties);
        console.log("base   :", this.baseProperties );

    }

    forward(timeDiff){
        console.log("moving forward");
        if (this.backwardTween._isPlaying) {
            this.backwardTween.stop();
        }
        this.forwardTween = new this.TWEEN.Tween(this.reciever).to(this.targetProperties, timeDiff).easing(this.forwardEasing);
        this.forwardTween.start();
        
    }
    
    backward(timeDiff){
        console.log("moving backward");
        if (this.forwardTween._isPlaying) {
            this.forwardTween.stop();
        }
        this.backwardTween = new this.TWEEN.Tween(this.reciever).to(this.baseProperties, timeDiff).easing(this.backwardEasing);
        this.backwardTween.start();
    }
}

export class MouseManager {
    constructor(){
        this.mouse = setup.mouse;
        window.addEventListener("mousemove", this, false);


        this.offsetScale = 4.;
        this.currOffset = new THREE.Vector3(0., 0., 0.);

        if (!MouseManager._instance) {
            MouseManager._instance = this;
        }

        return MouseManager._instance; 

    }

    handleEvent(event) {
        // console.log("event recieved");
        if (event.type == "mousemove") {
            this.onMouseMove(event);
        } else if (event.type == "click") {
            console.log("trying to click");
        //     this.toggleGrowShrink(e);
        }
    }
    
    onMouseMove = function (event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // console.log(this.mouse);
        // this.rayCast();
    }
}

var mouseManager = new MouseManager();

export {mouseManager}