import { Object3D } from '../three/three.module.js';
import ModuleCore from '../SyncModules/Core/ModuleCore.js';

export default class ViewCore extends Object3D {
	static type = ModuleCore.type;

	#module;
	#registry;

	constructor ( module ) {
		// console.log( `ViewCore - constructor` );

		super( );

		this.#setModule( module );
	}

	get module ( ) {
		return this.#module;
	}

	setRegistry ( registry ) {
		this.#registry = registry;
	}

	get _registry ( ) {
		return this.#registry;
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