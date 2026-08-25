
function uuid( ) {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
}


export default class ImageImportController {
	#module;

	#loader;
	#parser;
	#exporter;

	#scene;

	#file;
	#nodesMap;
	#sceneGraph;

	constructor ( ) {
	}

	setModule ( module ) {
		this.#module = module;
	}

	inputFile ( ) {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".png,.jpeg";

		input.onchange = ( ) => {
			const file = input.files[ 0 ];
			if ( file === undefined )
				return;
			this.#readFile( file );
		};
		input.click();
	}

	#readFile ( file ) {
		console.log( "ImageImportController - #readFile" );

		// this.#file = {
		// 	name: file.name,
		// 	type: file.type,
		// 	data: 'data:model/png;base64,',
		// }

		const reader = new FileReader( );
		reader.onload = ( ) => {
			const { result } = reader;
			// const fileBuffer = this.#getFileBuffer( result );
			// console.log(result)
			this.#setModuleImage( result );
		};
		reader.readAsDataURL( file );
		// reader.readAsArrayBuffer( file );
	}



	#setModuleImage ( image ) {
		this.#module.setImage( image, true );
	}
}