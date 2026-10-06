import { GLTFLoader } from "../../three/loaders/GLTFLoader.js";
import { DRACOLoader } from "../../three/loaders/DRACOLoader.js";
import { GLTFExporter } from "../../three/exporters/GLTFExporter.js";
import { Vector3, Matrix4, Quaternion } from 'three';
import { SceneGraph } from "../../SyncModules/GLTFModule.js";
// import { SceneNode } from "../../SyncModules/GLTFModule.js";

const DRACO_PATH = "../../three/loaders/DracoUtils/";

function uuid( ) {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
}

export default class GLTFImportController {
	#module;

	#loader;
	#parser;
	#exporter;

	#scene;

	#file;
	#nodesMap;
	#sceneGraph;

	constructor ( ) {
		const dracoLoader = new DRACOLoader( );
		dracoLoader.setDecoderPath( DRACO_PATH );
		this.#loader = new GLTFLoader( );
		this.#loader.setDRACOLoader( dracoLoader );
		this.#exporter = new GLTFExporter( );
	}

	setModule ( module ) {
		this.#module = module;
	}

	inputFile ( ) {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".glb,model/gltf-binary";

		input.onchange = ( ) => {
			const file = input.files[0];
			if ( file === undefined )
				return;
			this.#readFile( file );
		};
		input.click();
	}

	loadFile ( path, name = "fileName.glb" ) {
		fetch( path ).then( response => {
			return response.blob( )
		} ).then( blob => {
			const file = new File( [ blob ], name, {
				type: "model/gltf-binary"
			} );

			this.#readFile( file );
		} );
	}

	#readFile ( file ) {
		console.log( "GLTFImportController - #readFile" );

		this.#file = {
			name: file.name,
			type: file.type,
			data: 'data:model/gltf-binary;base64,',
		}

		const reader = new FileReader( );
		reader.onload = ( ) => {
			const { result } = reader;
			const fileBuffer = this.#getFileBuffer( result );
			this.#parseFileBuffer( fileBuffer ).then( ( ) => {
				this.#setModuleGLB( {
					name: this.#file.name,
					type: this.#file.type,
					data: result
				} );
			} );
		};
		reader.readAsDataURL( file );
	}

	#getFileBuffer ( fileData ) {
		return Uint8Array.from( atob( fileData.split( ',' )[ 1 ] ), c => c.charCodeAt(0) ).buffer;
	}

	async #parseFileBuffer ( fileBuffer ) {
		this.#loader.parse( fileBuffer, " ", ( gltf ) => {
			// console.log(gltf)
			this.#parser = gltf.parser;
			this.#buildNodesMap( )
			this.#buildSceneGraph( gltf.scenes[ 0 ] );
		} );
	}

	#buildNodesMap ( ) {
		const nodes = this.#parser.json.nodes;
		const nodesMap = [ ];
		this.#nodesMap = new Map( );
		for ( const nodeId in nodes ) {
			const nodeUUID = uuid( );
			const nodeData = { nodeId: parseInt( nodeId ), nodeUUID }
			nodesMap.push( nodeData );
			this.#nodesMap.set( nodeData.nodeId, nodeData.nodeUUID );
		}
		
		this.#module.setNodesMap( nodesMap, true );
	}

	#buildSceneGraph ( scene ) {
		const nodes = this.#parser.json.nodes;
		const nodesData = [ ];

		for ( const nodeId in nodes ) {

			const { children, translation, rotation, scale, matrix } = nodes[ nodeId ];
			const nodeUUID = this.#nodesMap.get( parseInt( nodeId ) );

			const transform = {
				translation: translation?.map( s => parseFloat( s ) ),
				scale: scale?.map( s => parseFloat( s ) ),
				rotation: rotation?.map( s => parseFloat( s ) ),
			}

			if ( matrix !== undefined ) {
				const t = new Vector3( );
				const r = new Quaternion( );
				const s = new Vector3( );
				( new Matrix4( ).fromArray( matrix ) ).decompose( t, r, s );

				transform.translation = t.toArray( );
				transform.rotation = r.toArray( );
				transform.scale = s.toArray( );
			}

			const nodeData = {
				UUID: nodeUUID,
				children: children?.map( childId => this.#nodesMap.get( parseInt( childId ) ) ),
				transform: transform,
			}
			nodesData.push( nodeData );
		}
		this.#module.setNodes( nodesData, true );
	}

	#setModuleGLB ( file ) {
		this.#module.updateFile( { ...file }, true );
	}
}