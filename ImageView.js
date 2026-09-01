import ImageModule from "../SyncModules/ImageModule.js";
import TransformView from "./TransformView.js";
import ViewCore from "./ViewCore.js";
import { DoubleSide, PlaneGeometry, MeshBasicMaterial, Mesh, Texture } from "three";

export default class ImageView extends TransformView {
	static type = ImageModule.type;

	#quadMesh;

	constructor ( module ) {
		console.log( `ImageView - constructor` );

		super( module );

		const planeGeometry = new PlaneGeometry( 1, 1 );
		const planeMaterial = new MeshBasicMaterial( { map: null, side: DoubleSide } );
		this.#quadMesh = new Mesh( planeGeometry, planeMaterial );
		this.add( this.#quadMesh );

		this.#setImage( module.image );
	}

	setCallbacks ( ) {
		// console.log( `ImageView - setCallbacks` );

		super.setCallbacks( );
		this.module.setOnChange( this.module.commands.setImage,
			( { image } ) => this.#setImage( image )
		);
	}

	#setImage ( image ) {
		// console.log( `ImageView - #setImage` );

		if ( image === undefined ) 
			return;

		const img = new Image( );
		img.onload = ( ) => {
			const texture = new Texture( img );
			texture.needsUpdate = true
			this.#quadMesh.material.map = texture;
			this.#quadMesh.material.needsUpdate = true;

			const { width, height } = img;
			const aspect = width / height;
			this.#quadMesh.scale.set( aspect, 1, 1 );
		}
		img.src = image;
	}
}