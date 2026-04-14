import GLTFModule from "../SyncModules/GLTFModule.js";
import ViewCore from "./ViewCore.js";
// import { GLTFLoader } from "loaders/GLTFLoader.js";
import { GLTFLoader } from "../three/loaders/GLTFLoader.js";
import { DRACOLoader } from "../three/loaders/DRACOLoader.js";

export default class GLTFView extends ViewCore {
	static type = GLTFModule.type;

	#root;

	constructor ( module ) {
		console.log( `GLTFView - constructor` );
		
		super( module );

	}

	setCallbacks ( ) {
		console.log( `LineView - setCallbacks` );

		this.module.setOnChange( this.module.commands.updateFile,
			( file ) => this.#updateFile( file )
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
			this.add(gltf.scene)
			// gltf.scene.traverse ( obj => console.log(obj))
		});
	}
}