import { OrbitControls } from "controls/OrbitControls.js";

// new OrbitControls( );

export default class CameraController extends OrbitControls {
	#module;
	
	constructor ( camera, domElement = null ) {
		super( camera, domElement );
	}

	setModule ( module ) {
		this.#module = module;
		this.updateModule( );
		this.addEventListener( `change`, ( event ) => {
			this.updateModule( );
		} );
	}

	updateModule ( ) {
		const transform = { 
			translation: this.object.position.toArray( ), 
			rotation: this.object.quaternion.toArray( ),
		};
		this.#module.updateTransform( transform, true );
	}
}