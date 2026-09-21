import BezierCurveModule from "../SyncModules/BezierCurveModule.js";
import PointsView from "./PointsView.js";
import { Vector3, Group, BufferGeometry, LineBasicMaterial, Line } from "../three/three.module.js";

export default class BezierCurveView extends PointsView {
	static type = BezierCurveModule.type;
	
	#curveMesh;
	#lineMesh;
	#sampling = 101;

	constructor ( module ) {
		console.log( "BezierCurveView - constructor" );

		super( module );

		this.#updateCurve( module.points );
		// this.#curveMesh = new Group( );
		// this.add( this.#curveMesh );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.addPoints, 
			( points ) => this.#updateCurve( points ) 
		);
		this.module.setOnChange( this.module.commands.updatePoints, 
			( points ) => this.#updateCurve( points ) 
		);
		this.module.setOnChange( this.module.commands.removePoints, 
			( points ) => this.#updateCurve( points ) 
		);
		this.module.setOnChange( this.module.commands.clear, 
			( ) => this.#updateCurve( ) 
		);
	}

	#updateCurve ( points = [ ] ) {
		console.log( "BezierCurveView - updateCurve" );
		console.log( points );
		if ( points.length == 0 ) {
			return;
		}

		if ( this.#curveMesh ) 
			this.remove( this.#curveMesh );
	
		const positions = points.map( ( { UUID, position } ) => {
			return new Vector3( ...position );
		} );
		const curvePoints = this.#computeCurve( positions );
		console.log( curvePoints );

		const lineMaterial = new LineBasicMaterial( { color: 0x000000 } );
		const lineGeometry = new BufferGeometry( ).setFromPoints( curvePoints );
		this.#curveMesh = new Line( lineGeometry, lineMaterial );

		this.add( this.#curveMesh );

	}

	#computeCurve ( positions = [ ] ) {
		console.log( "BezierCurveView - computeCurve" );
		if ( positions.length == 0 )
			return [ ];

		console.log( positions, positions.length );
		const curvePoints = new Array( this.#sampling );
		const sample = 1 / ( this.#sampling - 1 );

		let t = 0;
		for ( let s = 0; s < this.#sampling; ++s ) {
			t = s * sample;

			// Decasteljau
			const pos2 = positions.map( p => p.clone( ) );
			for ( let i = 1; i < pos2.length; ++i ) {
				for ( let j = 0; j < pos2.length - i; ++j ) {
					pos2[ j ].multiplyScalar( 1 - t );
					pos2[ j ].addScaledVector( pos2[ j + 1 ], t );
				}
			}
			curvePoints[ s ] = pos2[ 0 ].clone( );
		}
		
		return curvePoints;
	}
}