import DisplaysModule from "../SyncModules/DisplaysModule.js";
import TransformView from "./TransformView.js";
import * as THREE from "../three/three.module.js";

export default class DisplaysView extends TransformView {
	static type = DisplaysModule.type;

	#displayObjects = new Map( );
	#cameraObjects = new Map( );
	#displayGroup = new THREE.Group( );
	#cameraGroup = new THREE.Group( );

	constructor ( module ) {
		// console.log( `DisplaysView - constructor` );
		
		super( module );

		this.add( this.#displayGroup );
		this.add( this.#cameraGroup );
	}

	setCallbacks ( ) {
		// console.log( `DisplaysView - setCallbacks` );

		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.addDisplay, 
			( display ) => this.#addDisplay( display ) 
		);

		this.module.setOnChange( this.module.commands.setMatrices, 
			( matrices ) => this.#setMatrices( matrices ) 
		);
	}

	#addDisplay ( display ) {
		// console.log( `DisplaysView - addDisplay` );

		const { corners } = display;

		const indices = [ 0, 1, 2,	1, 3, 2  ];
		const vertices = new Float32Array( corners.flat( ) );
	
		const geometry = new THREE.BufferGeometry( );
		geometry.setAttribute( "position", new THREE.BufferAttribute( vertices, 3 ) );
		geometry.setIndex( indices );
		geometry.computeVertexNormals( );

		const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
		const displayQuad = new THREE.Mesh( geometry, material );

		const edgeGeometry = new THREE.EdgesGeometry( geometry );
		const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
		const displayEdges = new THREE.LineSegments( edgeGeometry, edgeMaterial );

		const displayObject = new THREE.Group( );
		displayObject.add( displayEdges, displayQuad );
		this.#displayGroup.add( displayObject );
		this.#displayObjects.set( display.UUID, displayObject );
		// this.add( this.#screenEdge, this.#screenFace );

		const camera = new THREE.PerspectiveCamera( );
		camera.matrixAutoUpdate = false;
		const cameraHelper = new THREE.CameraHelper( camera );
		this.#cameraObjects.set( display.UUID, cameraHelper );
		this.#cameraGroup.add( cameraHelper );
	}

	#setMatrices ( matrices ) {
		// console.log( `DisplaysView - setMatrices` );

		const cameraHelper = this.#cameraObjects.get( matrices.UUID );

		cameraHelper.camera.matrixWorld.fromArray( matrices.view ).invert( );
		cameraHelper.camera.projectionMatrixInverse.fromArray( matrices.projection ).invert( );
		cameraHelper.update( );
	}
}

		// const camera = new THREE.PerspectiveCamera( );
		// camera.matrixAutoUpdate = false;
		// const cameraHelper = new THREE.CameraHelper( camera );
		// clientManager.sceneController.scene.add( cameraHelper );
		// camera.matrixWorldInverse.copy( matrices.view );
		// camera.matrixWorld.copy( matrices.view ).invert( );
		// camera.projectionMatrix.copy( matrices.projection );
		// camera.projectionMatrixInverse.copy( matrices.projection ).invert( );
		// cameraHelper.update( );
