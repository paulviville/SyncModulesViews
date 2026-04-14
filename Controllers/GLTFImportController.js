import { GLTFLoader } from "../../three/loaders/GLTFLoader.js";
import { DRACOLoader } from "../../three/loaders/DRACOLoader.js";
import { GLTFExporter } from "../../three/exporters/GLTFExporter.js";

const DRACO_PATH = "../../three/loaders/DracoUtils/";

export default class GLTFImportController {
	#module;

	#loader;
	#exporter;

	#file;

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
			this.#parseFileBuffer( fileBuffer );
		};
		reader.readAsDataURL( file );
	}

	#getFileBuffer ( fileData ) {
		return Uint8Array.from( atob( fileData.split( ',' )[ 1 ] ), c => c.charCodeAt(0) ).buffer;
	}

	#parseFileBuffer ( fileBuffer ) {
		this.#loader.parse( fileBuffer, " ", ( gltf ) => {
			console.log( gltf )
			this.#setNodeUUIDs( gltf.scene );
			this.#buildSceneGraph( gltf.scene );
			this.#setModuleFile( gltf.scene );
		} );
	}

	#setNodeUUIDs ( scene ) {
		scene.traverse( ( obj ) => { obj.userData.uuid ??= crypto.randomUUID( )	} );
	}

	#buildSceneGraph ( scene ) {
		/// todo 
	}

	#setModuleFile ( scene ) {
		this.#exporter.parse( scene,
			( glb ) => {
				const bytes = new Uint8Array(glb);
				let binary = '';
				bytes.forEach(b => binary += String.fromCharCode(b));
				const data = btoa( binary );
				
				this.#file.data += data;

				this.#module.updateFile( { ...this.#file }, true );
			},
			( error ) => console.log( error ),
			{ binary: true }
		)
	}
}