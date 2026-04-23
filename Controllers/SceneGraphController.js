import { TransformControls } from "controls/TransformControls.js";
import { Object3D } from 'three';

export default class SceneGraphController extends TransformControls {
	#dummy = new Object3D( );
	#module;
	#targetNode;

	constructor ( camera, domElement = null ) {
		super ( camera, domElement );

		this.attach( this.#dummy );

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
		console.log( `SceneGraphController - setModule` );

		if ( module === undefined ) {
			this.#module = undefined;
			this.enabled = false;
			this.getHelper( ).visible = false;
			return;
		}

		this.#module = module;
		this.setTargetNode( this.#module.nodeUUIDs[ 0 ] );
	}

	#onChange ( ) {
		if ( this.#targetNode === undefined )
			return;

		if ( !this.dragging ) 
			return;

		const node = {
			UUID: this.#targetNode,
			transform: {
				translation: this.#dummy.position.toArray( ),
				rotation: this.#dummy.quaternion.toArray( ),
				scale: this.#dummy.scale.toArray( ),
			},
		}

		this.#module.updateNodes( [ node ], true );
	}

	#onDraggingChange ( ) {
		if ( this.#targetNode === undefined )
			return;
	}

	setTargetNode ( nodeUUID ) {
		console.log( `SceneGraphController - setTargetNode` );

		const transform = this.#module.nodeTransform( nodeUUID );
		this.#dummy.position.fromArray( transform.translation );
		this.#dummy.quaternion.fromArray( transform.rotation );
		this.#dummy.scale.fromArray( transform.scale );

		this.#targetNode = nodeUUID;

		this.enabled = true;
		this.getHelper( ).visible = true;	
	}

	get object3D ( ) {
		return this.#dummy;
	}
}