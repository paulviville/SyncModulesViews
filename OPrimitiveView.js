import OPrimitiveModule from "../SyncModules/OPrimitiveModule.js";
import { ConeGeometry, BoxGeometry, Mesh, MeshPhongMaterial, CapsuleGeometry, PlaneGeometry, SphereGeometry, CylinderGeometry } from "../three/three.module.js";
import ObjectView from "./ObjectView.js";

export default class OPrimitiveView extends ObjectView {
	static type = OPrimitiveModule.type;

	#geometry = new BoxGeometry( 1, 1, 1 );
	#material = new MeshPhongMaterial( { color: 0xffffff } );
	#mesh = new Mesh( this.#geometry, this.#material );

	constructor ( module ) {
		// console.log( `PrimitiveView - constructor` );
		
		super( module );

		this.#setPrimitive( module.primitive );
		this.#setColor( module.color );
		this.add( this.#mesh );
	}

	setCallbacks ( ) {
		// console.log( `PrimitiveView - setCallbacks` );

		super.setCallbacks( );
		this.module.setOnChange( this.module.commands.setPrimitive, 
			( primitive ) => this.#setPrimitive( primitive ) 
		);

		this.module.setOnChange( this.module.commands.setColor, 
			( color ) => this.#setColor( color ) 
		);
	}

	#setPrimitive ( primitive ) {
		// console.log( `PrimitiveView - #setPrimitive` );

		const primitiveTypes = this.module.primitiveTypes;
		
		switch ( primitive ) {
			case primitiveTypes.Sphere:
				this.#geometry = new SphereGeometry( 0.5, 16, 16 );
				break;
			case primitiveTypes.Cylinder:
				this.#geometry = new CylinderGeometry(0.5, 0.5, 1.0, 16, 1);
				break;
			case primitiveTypes.Cone:
				this.#geometry = new ConeGeometry(0.5, 1.0, 16);
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
	
	#setColor ( color ) {
		this.#material.color.fromArray( color );
		this.#material.transparent = color[ 3 ] == 1 ? false : true;
		this.#material.opacity = color[ 3 ];
		this.#material.needsUpdate = true;
	}

	delete ( ) {
		// console.log( `PrimitiveView - delete` );
		
		super.delete( );
		this.#mesh.geometry.dispose( );
		this.#mesh.material.dispose( );
	}
}