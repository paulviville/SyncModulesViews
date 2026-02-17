import { Object3D } from 'three';

export default class ViewCore extends Object3D {
	#module;

	constructor ( ) {
		console.log( `ViewCore - constructor` );

		super( );
		console.log(this)
	}
}