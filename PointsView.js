import { Points, PointsMaterial, BufferGeometry, BufferAttribute } from "three";
import PointsModule from "../SyncModules/PointsModule.js";
import ViewCore from "./ViewCore.js";

const NB_POINTS = 1000;

export default class PointsView extends ViewCore {
	static type = PointsModule.type;

	#size = NB_POINTS;
	#nbPoints = 0;
	#positions = new Float32Array( 3 * this.#size );
	#geometry = new BufferGeometry( );
	#material = new PointsMaterial( { size : 0.3, color : 0xFF0000 } );
	#pointCloud = new Points( this.#geometry, this.#material );

	constructor ( module ) {
		super( module );
		this.#updatePoints( module.points );
		this.add( this.#pointCloud );
	}

	setCallbacks ( ) {
		super.setCallbacks( );
		this.module.setOnChange( this.module.commands.addPoints, 
			( points ) => this.#updatePoints( points ) 
		);
		this.module.setOnChange( this.module.commands.removePoints, 
			( points ) => this.#updatePoints( points ) 
		);
		this.module.setOnChange( this.module.commands.clear, 
			( ) => this.#updateNbPoints( 0 ) 
		);
	}

	#updatePoints ( points ) {
		this.#setGeometry( points );

		this.#pointCloud.geometry.needsUpdate = true;
	}

	#updateNbPoints ( nbPoints ) {
		this.#nbPoints = nbPoints;
		if ( this.#nbPoints > this.#size ) {
			while ( this.#nbPoints > this.#size ) 
				this.#size += NB_POINTS;
			this.#positions = new Float32Array( 3 * this.#size );
		}
		this.#geometry.setDrawRange( 0, this.#nbPoints );
		this.#pointCloud.geometry.needsUpdate = true;
	}

	#setGeometry ( points ) {
		this.#updateNbPoints( points.length );

		let p = 0;
		for ( const { position } of points ) {
			this.#positions[ 3 * p ] = position [ 0 ];
			this.#positions[ 3 * p + 1 ] = position [ 1 ];
			this.#positions[ 3 * p + 2 ] = position [ 2 ];
			++p;
		}

		this.#geometry.setAttribute( "position", new BufferAttribute( this.#positions, 3 ) );
	}
}