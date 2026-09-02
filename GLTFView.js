import GLTFModule from "../SyncModules/GLTFModule.js";
import ViewCore from "./ViewCore.js";
// import { GLTFLoader } from "loaders/GLTFLoader.js";
import { GLTFLoader } from "../three/loaders/GLTFLoader.js";
import { DRACOLoader } from "../three/loaders/DRACOLoader.js";

export default class GLTFView extends ViewCore {
	static type = GLTFModule.type;

	#root = new Set( );
	#nodeObjects = new Map( );
	#nodesMap = new Map( );
	
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
		this.module.setOnChange( this.module.commands.setNodesMap,
			( nodesMap ) => this.#setNodesMap( nodesMap )
		);
	}

	#setNodesMap ( nodesMap ) {
		for ( const { nodeId, nodeUUID } of nodesMap ) {
			this.#nodesMap.set( parseInt( nodeId ), nodeUUID );
		}
		console.log("GLTFView", nodesMap)
	} 

	#updateFile ( file ) {
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
			const associations = gltf.parser.associations;
			let scene = gltf.scene;
			this.#setMapping( scene, gltf.parser ).then( 
				() => {
					this.add( scene );
					this.#updateNodes( )
				}
			)
		});
	}

	async #setMapping ( scene, parser ) {
		const nodes = parser.json.nodes;
		for ( const nodeId in nodes ) {
			const nodeUUID = this.#nodesMap.get( parseInt( nodeId ) );
			
			if ( nodeUUID === undefined )
				continue;

			const obj = await parser.getDependency("node", nodeId);
			this.#nodeObjects.set( nodeUUID, obj );
		}
	}
	
	#updateNodes ( nodes ) {
        nodes ??= this.module.nodes;

		for ( const node of nodes ) {
			const { UUID, parent, children, transform } = node;
			const object = this.#nodeObjects.get( UUID );
			// console.log(object)
			if ( object === undefined )
				return; 

			if ( parent ) { }
			if ( children ) { }

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