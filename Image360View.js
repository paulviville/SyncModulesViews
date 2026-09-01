import Image360Module from "../SyncModules/Image360Module.js";
import TransformView from "./TransformView.js";
import ViewCore from "./ViewCore.js";
import { DoubleSide, PlaneGeometry, MeshBasicMaterial, Mesh, Texture, SphereGeometry } from "three";

export default class Image360View extends TransformView {
	static type = Image360Module.type;

	#sphereMesh;

	constructor ( module ) {
		console.log( `Image360View - constructor` );

		super( module );

		const sphereGeometry = new SphereGeometry( 10, 16, 16 );
		const sphereMaterial = new MeshBasicMaterial( { map: null, side: DoubleSide } );
		this.#sphereMesh = new Mesh( sphereGeometry, sphereMaterial );
		this.add( this.#sphereMesh );

		this.#setImage( module.image );
	}

	setCallbacks ( ) {
		// console.log( `Image360View - setCallbacks` );

		super.setCallbacks( );
		this.module.setOnChange( this.module.commands.setImage,
			( { image } ) => this.#setImage( image )
		);
	}

	#setImage ( image ) {
		// console.log( `Image360View - #setImage` );

		if ( image === undefined ) 
			return;

		const img = new Image( );
		img.onload = ( ) => {
			const texture = new Texture( img );
			texture.needsUpdate = true
			this.#sphereMesh.material.map = texture;
			this.#sphereMesh.material.needsUpdate = true;
		}
		img.src = image;
	}
}