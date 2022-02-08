import {Text} from 'troika-three-text'
import * as THREE from 'three'

import { setup } from "./setup.js"

import { textObjManager } from './TextObjManager';
import { TweenAnimation } from './clickManager';

//Sets up the group object to carry the text and background
//sets text settings, and position on the group object
//creates an on text load function that takes a callback if available
//also on text load, add the background and text to avoid visible resizing of the background.

export class BaseText extends THREE.Group {
	constructor(text,position){
		super();
		this.position.copy(new THREE.Vector3(...position));
		this.Text = new Text();
		this.Text.textObj = this;
		this.setText(text);
		textObjManager.textObjs.push(this);
	}

	setText(text) {
		this.Text.text = text;
		this.Text.maxWidth = 4.;
		this.Text.fontSize = 0.2;
		this.Text.lineHeight = 1.5;
		this.Text.textAlign = "center";
		this.Text.position.set(0., 0., 0.01);
		this.Text.anchorX = "center";
		this.Text.anchorY = "50%";
		this.Text.font = "DancingScript-Regular.ttf"
		this.Text.letterSpacing = 0.1
		this.Text.textInset = 0.1;
	}

	onLoad() {
		this.Text.sync(() => {
			if (this.callBack){this.callBack();} 
			this.add(this.Background);
			this.add(this.Text);
		});
	}

	faceDirection = function (direction) {
		var directionTarget = this.getWorldPosition(new THREE.Vector3()).add(direction);
		this.lookAt(directionTarget);
	}

}





export class SquareText extends BaseText {
	constructor(text, position = [0, 0, 0]) {
		super(text,position);
		this.scale.set(0.,0,0);
		this.Background = this.generateBackground();
		this.Background.textObj = this;
		textObjManager.allClickable.push(this.Background);
		this.kind = "popout";
		this.onLoad.call(this);
	}

	generateBackground() {
		var geometry = new THREE.PlaneGeometry(1, 1);
		var material = new THREE.MeshBasicMaterial({ color: "black" });
		return new THREE.Mesh(geometry, material);
	}

	sizeBackground() {
		var { min, max } = this.Text.geometry.boundingBox;
		var heightText = max.y - min.y;
		var widthText = max.x - min.x;
		this.Background.scale.set(widthText + 2 * this.Text.textInset, heightText + 2 * this.Text.textInset, 1.);
	}

	callBack(){
		this.sizeBackground();
	}
}




export class CircleText extends BaseText {
	constructor(text, position = [0,0,0]){
		super(text,position);
		this.Background = this.generateBackground();
		this.Background.textObj = this;
		textObjManager.allClickable.push(this.Background);
		this.kind = "button";
		this.onLoad.call(this);
	}

	generateBackground() {
		var geometry = new THREE.CircleGeometry(.25, 32);
		var material = new THREE.MeshBasicMaterial({ color: "black" });
		return new THREE.Mesh(geometry, material);
	}

}





export class TextSystem extends THREE.Group {
	constructor(config){
		super();
		this.position.copy(new THREE.Vector3(...config.position));

		this.Button = new CircleText(config.buttonText);
		this.Button.System = this;

		this.Popout = new SquareText(config.popoutText);
		this.Popout.System = this;

		this.add(this.Button);
		this.add(this.Popout);

		setup.scene.add(this);

		// Add Tween Animations

		this.previousTime = 0;

		var popoutBase = { scale: new THREE.Vector3(0,0,0), position: new THREE.Vector3(0.,0.,0.) }
		var popoutTarget = { scale: new THREE.Vector3(1, 1, 1), position: new THREE.Vector3(...config.popoutOffset)}

		this.popoutTween = new TweenAnimation(this.Popout, popoutBase, popoutTarget, "Out","InOut");

		var cameraPosBase = { basePosition: setup.camera.defaultPosition}
		var cameraPosTarget = { basePosition: this.position.clone().add(new THREE.Vector3(0., 0., 8.))}

		this.cameraPosTween = new TweenAnimation(setup.camera, cameraPosBase, cameraPosTarget , "InOut", "InOut");

		var cameraTargetBase = { target: setup.camera.defaultTarget }
		var cameraTargetTarget = { target: this.position.clone() }


		this.cameraTargetTween = new TweenAnimation(setup.camera, cameraTargetBase, cameraTargetTarget, "InOut", "InOut");
		
	}

	runBackward(timeDiff){
		this.popoutTween.backward(timeDiff);

        this.cameraPosTween.backward(timeDiff);

        this.cameraTargetTween.backward(timeDiff);
	}

	runForward(timeDiff) {
		this.popoutTween.forward(timeDiff);

		this.cameraPosTween.forward(timeDiff);

		this.cameraTargetTween.forward(timeDiff);
	}



}