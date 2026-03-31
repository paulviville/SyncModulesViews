import CameraModule from "../SyncModules/CameraModule.js";
import TransformView from "./TransformView.js";
import { CameraHelper, PerspectiveCamera } from "three";

export default class CameraView extends TransformView {
	static type = CameraModule.type;

	#cameraHelper = new CameraHelper( new PerspectiveCamera( 50, 4 / 3, 0.01, 1 ) );


	constructor ( module ) {
		console.log( `CameraView - constructor` );
		
		super( module );

		this.#updateCamera( module.camera );
		this.add( this.#cameraHelper );
	}

	setCallbacks ( ) {
		console.log( `CameraView - setCallbacks` );

		super.setCallbacks( );
		this.module.setOnChange( this.module.commands.updateCamera, 
			( camera ) => this.#updateCamera( camera ) 
		);
	}

	#updateCamera ( camera ) {
		console.log( `CameraView - #updateCamera` );
		
		const { fov, aspect, near, far } = camera;
		console.log( fov, aspect, near, far );
		this.#cameraHelper.camera.fov = fov;
		this.#cameraHelper.camera.aspect = aspect;
		this.#cameraHelper.camera.near = near;
		this.#cameraHelper.camera.far = far;
		this.#cameraHelper.camera.updateProjectionMatrix( );
		console.log(this.#cameraHelper)
		this.#cameraHelper.update()
	}
}