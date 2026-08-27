import SkeletonModule from "../SyncModules/SkeletonModule.js";
import ViewCore from "./ViewCore.js";
import { AxesHelper, SkeletonHelper, Bone, Group } from '../three/three.module.js';

export default class SkeletonView extends ViewCore {
	static type = SkeletonModule.type;

	#axes = new AxesHelper( 1 );
	#skeletonHelper;
	#roots = new Group( );
	#boneObjects = new Map( );

	constructor ( module ) {
		console.log( `SkeletonView - constructor` );
		
		super( module );

		this.add( this.#roots );
		// this.#updateTransform( module.transform );
	}

	setCallbacks ( ) {
		// console.log( `SkeletonView - setCallbacks` );

		this.module.setOnChange( this.module.commands.setBones,
			( { bones } ) => this.#setBones( bones )
		);
		this.module.setOnChange( this.module.commands.setTransforms,
			( { boneTransforms } ) => this.#setTransforms( boneTransforms )
		);
	}

	#setBones ( bonesData ) {
		console.log( `SkeletonView - #setBones` );
		console.log( bonesData );

		for ( const { UUID } of bonesData ) {
			const boneObject =  new Bone( );
			this.#boneObjects.set( UUID, boneObject );
		}

		for ( const { UUID, parent } of bonesData ) {
			const boneObject =  this.#boneObjects.get( UUID );

			if ( parent === undefined ) {
				this.#roots.add( boneObject );
			}
			else {
				const parentObject =  this.#boneObjects.get( parent );
				parentObject.add( boneObject );
			}
		}


		if ( this.#skeletonHelper !== undefined ) {
			this.remove( this.#skeletonHelper );
			this.#skeletonHelper.dispose( );
		}
		this.#skeletonHelper = new SkeletonHelper( this.#roots );
		this.add( this.#skeletonHelper );
		console.log( this.#boneObjects );
		console.log(this.#roots)
		console.log( this.#skeletonHelper )
	}

	#setTransforms ( transformsData ) {
		console.log( `SkeletonView - #setTransforms` );
		console.log( transformsData );

		let boneObject;
		for ( const { UUID, transform } of transformsData ) {
			boneObject = this.#boneObjects.get( UUID );
			if ( boneObject === undefined )
				continue;

			boneObject.position.fromArray( transform.translation );
			boneObject.quaternion.fromArray( transform.rotation );
			boneObject.scale.fromArray( transform.scale );
			console.log( boneObject)
		}

	}

	delete ( ) {
		super.delete( );
	}
}