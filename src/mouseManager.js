// import {Text} from 'troika-three-text'
import * as THREE from 'three'

// persistent mouse position

export class MouseManager {
    constructor(){
        this.mouse = new THREE.Vector2();
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

    // Want to add Raycasting and hit checking
    // Also the Tween managment
}

var mouseManager = new MouseManager();

export {mouseManager}