import PrimitiveModule from "../SyncModules/PrimitiveModule.js";
import TransformView from "./TransformView.js";
import { BoxGeometry, Mesh, Matrix4, MeshPhongMaterial, Object3D, CapsuleGeometry, PlaneGeometry, SphereGeometry, CylinderGeometry } from "three";

export default class PrimitiveView extends TransformView {
	static type = PrimitiveModule.type;

	#geometry = new BoxGeometry( 1, 1, 1 );
	#material = new MeshPhongMaterial( { color: 0xffffff } );
	#mesh = new Mesh( this.#geometry, this.#material );

	constructor ( module ) {
		console.log( `PrimitiveView - constructor` );
		
		super( module );

		this.#updatePrimitive( module.primitive );
		this.add( this.#mesh );
	}

	setCallbacks ( ) {
		console.log( `PrimitiveView - setCallbacks` );

		super.setCallbacks( );
		this.module.setOnChange( this.module.commands.updatePrimitive, 
			( primitive ) => this.#updatePrimitive( primitive ) 
		);
	}

	#updatePrimitive ( primitive ) {
		console.log( `PrimitiveView - #updatePrimitive` );

		const primitiveTypes = this.module.primitiveTypes;
		
		switch ( primitive ) {
			case primitiveTypes.Sphere:
				this.#geometry = new SphereGeometry( 0.5, 16, 16 );
				break;
			case primitiveTypes.Cylinder:
				this.#geometry = new CylinderGeometry(0.5, 0.5, 1.0, 16, 1);
				break;
			case primitiveTypes.Quad:
				this.#geometry = new PlaneGeometry(1.0, 1.0, 1, 1);
				break;
			case primitiveTypes.Capsule:
				this.#geometry = new CapsuleGeometry(0.5, 0.5, 8, 16);
				break;
			case primitiveTypes.Cube:
			default:
				this.#geometry = new BoxGeometry( 1, 1, 1 );
				break;
		}

		this.#mesh.geometry.dispose( );
		this.#mesh.geometry = this.#geometry;
	}

	delete ( ) {
		console.log( `PrimitiveView - delete` );
		
		super.delete( );
		this.#mesh.geometry.dispose( );
		this.#mesh.material.dispose( );
	}
}