import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { textObjManager } from './TextObjManager';

export class Setup {
    constructor(){
        // SCENE SETUP

        var scene = new THREE.Scene({ antialias: true });
        scene.background = new THREE.Color( 0x1c1c1c );

        // CAMERA SETUP

        var camera = new THREE.PerspectiveCamera( 53, window.innerWidth / window.innerHeight, 0.25, 2000 );
        camera.position.set(0.,0.,8.);
        textObjManager.camera = camera;

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

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        // Add to instance

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;

    }
    
}

var setup = new Setup();

export {setup}











