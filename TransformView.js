import TransformModule from "../SyncModules/TransformModule.js";
import ViewCore from "./ViewCore.js";
import { AxesHelper } from 'three';

export default class TransformView extends ViewCore {
	static type = TransformModule.type;

	#axes = new AxesHelper( 1 )

	constructor ( module ) {
		// console.log( `TransformView - constructor` );
		
		super( module );

		/// debug
		this.add( this.#axes );
		/// end debug

		this.#updateTransform( module.transform );
	}

	setCallbacks ( ) {
		// console.log( `TransformView - setCallbacks` );

		this.module.setOnChange( this.module.commands.updateTransform,
			( transform ) => this.#updateTransform( transform )
		);
	}

	#updateTransform ( transform ) {
		// console.log( `TransformView - #updateTransform` );

		const { translation, rotation, scale } = transform;
		this.position.fromArray( translation );
		this.quaternion.fromArray( rotation );
		this.scale.fromArray( scale );
	}

	delete ( ) {
		// console.log( `TransformView - delete` );
		
		super.delete( );

		this.#axes.dispose( ); 
	}
}