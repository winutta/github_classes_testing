import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CustomCamera } from './customCamera';

export class Setup {
    constructor(){
        // SCENE SETUP

        var scene = new THREE.Scene({ antialias: true });
        scene.background = new THREE.Color( 0x1c1c1c );

        // CAMERA SETUP

        var camera = new CustomCamera(53, window.innerWidth / window.innerHeight, 0.25, 2000)

        // RENDERER SETUP

        var renderer = new THREE.WebGLRenderer({antialias: true});

        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        const container = document.createElement( 'div' );
        document.body.appendChild( container );
        container.appendChild( renderer.domElement );

        // RESIZE

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            var width = window.innerWidth;
            var height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        //ORBIT CONTROL

        // const controls = new OrbitControls(camera, renderer.domElement);
        // controls.update();

        const TWEEN = require('@tweenjs/tween.js');

        // Add to instance

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.TWEEN = TWEEN;

        if (!Setup._instance) {
            Setup._instance = this;
        }

        return Setup._instance; 
    }
    
}

var setup = new Setup();

export {setup}











