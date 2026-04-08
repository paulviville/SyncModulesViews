import { Object3D } from 'three';
import ModuleCore from '../SyncModules/Core/ModuleCore.js';

export default class ViewCore extends Object3D {
	static type = ModuleCore.type;

	#module;

	constructor ( module ) {
		// console.log( `ViewCore - constructor` );

		super( );

		this.#setModule( module );
	}

	get module ( ) {
		return this.#module;
	}

	/// overload in children
	#setModule ( module ) {
		// console.log( `ViewCore - setModule` );
		this.#module = module;
		
		this.setCallbacks( );
	}

	/// overload in children
	setCallbacks ( ) {
		// console.log( `ViewCore - setCallbacks` );
		/// module.setOnChange( ... );
		return;
	}

	delete ( ) {
		// console.log( `ViewCore - delete` );

	}
}