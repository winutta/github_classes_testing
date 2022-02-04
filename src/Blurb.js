import {Text} from 'troika-three-text'
import * as THREE from 'three'

function BlurbBackground(type){
	var geometry;
	if(type == "popout"){
		geometry = new THREE.PlaneGeometry( 1, 1 );
	} else if(type == "button"){
		geometry = new THREE.CircleGeometry( .25,32 );
	}
	var material = new THREE.MeshBasicMaterial({color: "black"});
	return new THREE.Mesh(geometry,material);
}

function Blurb(options){
	this.Empty = new THREE.Group();
	this.Empty.name = options.name;
	this.Text = new Text();
	this.Background = BlurbBackground(options.type);
	this.Background.name = options.name;
	this.Background.kind = options.type;
	this.Background.Blurb = this;


	this.Empty.add(this.Background);
	this.Empty.add(this.Text);

	this.Empty.position.copy(options.offset);

	this.setText = function(){
		this.Text.text = options.text;
		this.Text.maxWidth = 4.;
		this.Text.fontSize = 0.2;
		this.Text.lineHeight = 1.5;
		this.Text.textAlign = "center";
		this.Text.position.set(0.,0.,0.01);
		this.Text.anchorX = "center";
		this.Text.anchorY = "50%";
		this.Text.font = "DancingScript-Regular.ttf"
		this.Text.letterSpacing = 0.1
		this.Text.textInset = 0.1;
	}

	this.resizeRectangle = function(){
		this.Text.sync(() => {
			var {min,max} = this.Text.geometry.boundingBox;
			var heightText = max.y - min.y;
			var widthText = max.x - min.x;

			this.Background.scale.set(widthText + 2*this.Text.textInset,heightText + 2*this.Text.textInset,1.);
			
		});
	}

	this.setText();
	if(options.type == "popout"){
		this.resizeRectangle();
	}
}


function blurbSystem(options){
	this.system = new THREE.Group();
	this.system.position.copy(options.position);

	this.popoutOptions = {
			text: options.popoutText,
			offset: options.offset,
			scene: options.scene,
			type: "popout",
			name: options.name,
		};

	this.buttonOptions = {
		text: options.buttonText,
		offset: new THREE.Vector3(0,0,0),
		scene: options.scene,
		type: "button",
		name: options.name,
	}

	this.popout = new Blurb(this.popoutOptions);
	this.popout.system = this;
	this.button = new Blurb(this.buttonOptions);
	this.button.system = this;

	this.popout.Empty.scale.set(0,0,0);

	this.system.add(this.popout.Empty);
	this.system.add(this.button.Empty);

	options.scene.add(this.system);

	this.faceCamera = function(offsetVector){
		var popoutTarget = this.popout.Empty.getWorldPosition(new THREE.Vector3()).add(offsetVector);
		this.popout.Empty.lookAt(popoutTarget);

		var buttonTarget = this.button.Empty.getWorldPosition(new THREE.Vector3()).add(offsetVector);
		this.button.Empty.lookAt(buttonTarget);
	}
}

export {blurbSystem};