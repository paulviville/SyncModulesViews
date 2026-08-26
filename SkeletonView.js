import SkeletonModule from "../SyncModules/SkeletonModule.js";
import ViewCore from "./ViewCore.js";
import { AxesHelper, SkeletonHelper } from '../three/three.module.js';

export default class SkeletonView extends ViewCore {
	static type = SkeletonModule.type;

	#axes = new AxesHelper( 1 );
	#skeletonHelper;

	constructor ( module ) {
		console.log( `SkeletonView - constructor` );
		
		super( module );

		/// debug
		this.add( this.#axes );
		this.#axes.position.set(1, 1, 1)
		/// end debug

		// this.#updateTransform( module.transform );
	}

	setCallbacks ( ) {
		// console.log( `SkeletonView - setCallbacks` );

		// this.module.setOnChange( this.module.commands.updateTransform,
		// 	( transform ) => this.#updateTransform( transform )
		// );
	}

	#setBones ( bonesData ) {

	}

	#setTransforms ( transformsData ) {

	}

	// #updateTransform ( transform ) {
	// 	// console.log( `SkeletonView - #updateTransform` );

	// 	const { translation, rotation, scale } = transform;
	// 	this.position.fromArray( translation );
	// 	this.quaternion.fromArray( rotation );
	// 	this.scale.fromArray( scale );
	// }

	delete ( ) {
		// console.log( `SkeletonView - delete` );
		
		super.delete( );

	}
}