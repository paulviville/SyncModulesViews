import { TransformControls } from "controls/TransformControls.js";
import { Object3D } from 'three';

export default class TransformController extends TransformControls {
	#dummy = new Object3D( );
	#module;

	constructor ( camera, domElement = null ) {
		super( camera, domElement );

		this.attach( this.#dummy );

		this.addEventListener
		this.addEventListener( 'dragging-changed', 
			( ) =>  this.#onDraggingChange( )
		);
		this.addEventListener( 'change', 
			( ) =>  this.#onChange( )
		);

		this.enabled = false;
		this.getHelper( ).visible = false;
	}

	setModule ( module = undefined ) {
		console.log( `TransformController - setModule` );

		if ( module === undefined ) {
			this.#module = undefined;
			this.enabled = false;
			this.getHelper( ).visible = false;
			return;
		}

		if ( module.updateTransform === undefined ) {
			console.warn( `TransformController: ${ module.type } does not have updateTransform method` );
			this.#module = undefined;
			return;
		}

		this.#module = module;

		const transform = this.#module.transform;
		this.#dummy.position.fromArray( transform.translation );
		this.#dummy.quaternion.fromArray( transform.rotation );
		this.#dummy.scale.fromArray( transform.scale );

		this.enabled = true;
		this.getHelper( ).visible = true;	
	}

	#onChange ( ) {
		if ( this.#module === undefined )
			return;

		if ( !this.dragging ) 
			return;
		this.#module.updateTransform(
			{
				translation: this.#dummy.position.toArray( ),
				rotation: this.#dummy.quaternion.toArray( ),
				scale: this.#dummy.scale.toArray( ),
			},
			true
		);
	}

	#onDraggingChange ( ) {
		if ( this.#module === undefined )
			return;
	}

	get object3D ( ) {
		return this.#dummy;
	}
}
