import {Text} from 'troika-three-text'
import * as THREE from 'three'

export class BaseText extends THREE.Group {
	constructor(text,position){
		super();
		this.position.copy(new THREE.Vector3(...position));
		this.Text = new Text();
		this.setText(text);
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

	onLoad(callBack){
		this.Text.sync(callBack);
	}
}

export class SquareText extends BaseText {
	constructor(text, position) {
		super(text,position);
		this.Background = this.generateMesh();
		this.onLoad(this.doAfterLoad.bind(this));

	}

	generateMesh() {
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

	doAfterLoad() {
		this.sizeBackground();
		this.add(this.Background);
		this.add(this.Text);
	}
}


export class CircleText extends BaseText {
	constructor(text, position){
		super(text,position);
		this.Background = this.generateMesh();
		this.onLoad(this.doAfterLoad.bind(this))
	}

	generateMesh() {
		var geometry = new THREE.CircleGeometry(.25, 32);
		var material = new THREE.MeshBasicMaterial({ color: "black" });
		return new THREE.Mesh(geometry, material);
	}

	doAfterLoad() {
			this.add(this.Background);
			this.add(this.Text);
	}
}