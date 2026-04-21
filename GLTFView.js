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
			/// remove "AuxScene fake root"
			let scene = gltf.scene;
			if ( scene.userData.uuid === undefined || scene.name === "AuxScene" )
				scene = gltf.scene.children[ 0 ];
			
			this.add( scene );
			this.#setObjectsMap( scene );
		});
	}

	#setObjectsMap ( scene ) {
		let counter = 0;
		scene.traverse ( obj => {
			this.#nodeObjects.set( obj.userData.uuid, obj );
		} );
	}

	#updateNodes ( nodes ) {
		console.log( `GLTFView - #updateNodes` );

		for ( const node of nodes ) {
			const { UUID, parent, children, transform } = node;
			const object = this.#nodeObjects.get( UUID );

			// if ( parent ) { }
			// if ( children ) { }

			if ( transform ) {
				const { translation, rotation, scale } = transform;
				if ( translation ) {
					object.position.fromArray( translation );
				}
				if ( rotation ) {
					object.quaternion.fromArray( rotation );
				}
				if ( scale ) {
					object.scale.fromArray( scale );
				}
			}
		}
	}
}