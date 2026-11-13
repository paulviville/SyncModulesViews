import MeshModule from "../SyncModules/MeshModule.js";
import ObjectView from "./ObjectView.js";
import { GLTFLoader } from "../three/loaders/GLTFLoader.js";
import { DRACOLoader } from "../three/loaders/DRACOLoader.js";

export default class MeshView extends ObjectView {
	static type = MeshModule.type;

	#prior = undefined;
	#mesh;

	constructor ( module ) {
		console.log( "MeshView - constructor" );
		super( module );

	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.setData, 
			( data ) => this.#setData( data ) 
		);
	}

	#setData ( file ) {
		if ( file.data === undefined )
			return;

		if ( this.#mesh !== undefined )
			this.remove( this.#mesh );

		const base64 = file.data.split( ',' )[ 1 ];
		const binary = atob( base64 );
		const bytes = new Uint8Array( binary.length );
		for ( let i = 0; i < binary.length; ++i ) {
			bytes[ i ] = binary.charCodeAt( i );
		}
		const buffer = bytes.buffer;

		const dracoLoader = new DRACOLoader( );
		dracoLoader.setDecoderPath("../three/loaders/DracoUtils/");
		const gltfLoader = new GLTFLoader( );
		gltfLoader.setDRACOLoader( dracoLoader );

		gltfLoader.parse( buffer, ' ', ( gltf ) => {
			let scene = gltf.scene;

			this.add( scene );
			this.#mesh = scene;
		});
	}

	delete ( ) {
		super.delete( );


		//this.#mesh?.geometry.dispose( );
		//this.#mesh?.material.dispose( );
	}
}