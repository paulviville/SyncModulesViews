import GLTFModule from "../SyncModules/GLTFModule.js";
import ViewCore from "./ViewCore.js";
// import { GLTFLoader } from "loaders/GLTFLoader.js";
import { GLTFLoader } from "../three/loaders/GLTFLoader.js";
import { DRACOLoader } from "../three/loaders/DRACOLoader.js";

export default class GLTFView extends ViewCore {
	static type = GLTFModule.type;

	#root = new Set( );
	#nodeObjects = new Map( );

	constructor ( module ) {
		console.log( `GLTFView - constructor` );
		
		super( module );

	}

	setCallbacks ( ) {
		console.log( `GLTFView - setCallbacks` );

		this.module.setOnChange( this.module.commands.updateFile,
			( file ) => this.#updateFile( file )
		);
		this.module.setOnChange( this.module.commands.updateNodes,
			( nodes ) => this.#updateNodes( nodes )
		);
	}

	#updateFile ( file ) {
		console.log( file );
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
			// console.log( gltf );
			/// remove "AuxScene fake root"
			let scene = gltf.scene;
			if ( scene.userData.uuid === undefined || scene.name === "AuxScene" )
				scene = gltf.scene.children[ 0 ];
			
			this.add( scene );
			this.#setObjectsMap( scene );
		});
	}

	#setObjectsMap ( scene ) {
		console.log( scene );
		let counter = 0;
		scene.traverse ( obj => {
			// const nodeUUID = obj.userData 
			console.log( obj.userData.uuid, obj );
			this.#nodeObjects.set( obj.userData.uuid, obj );
			++counter;
		} );

		console.log( counter )
	}

	#updateNodes ( nodes ) {
		console.log( `GLTFView - #updateNodes` );
		console.log( nodes );
	}
}