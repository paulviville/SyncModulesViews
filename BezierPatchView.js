import BezierPatchModule from "../SyncModules/BezierPatchModule.js";
import PointsView from "./PointsView.js";
import { Vector3, Group, BufferGeometry, MeshLambertMaterial, LineBasicMaterial, DoubleSide, Line, PlaneGeometry, Mesh } from "../three/three.module.js";

export default class BezierPatchView extends PointsView {
	static type = BezierPatchModule.type;
	
	#patchMesh;
	#lineMesh;
	#sampling = 7;

	constructor ( module ) {
		console.log( "BezierPatchView - constructor" );

		super( module );

		this.#updatePatch( module.points );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.addPoints, 
			( points ) => this.#updatePatch( points ) 
		);
		this.module.setOnChange( this.module.commands.updatePoints, 
			( points ) => this.#updatePatch( points ) 
		);
	}

	#updatePatch ( points = [ ] ) {
		console.log( "BezierPatchView - updatePatch" );
		console.log( points );
		if ( points.length == 0 ) {
			return;
		}

		if ( this.#patchMesh ) 
			this.remove( this.#patchMesh );
	
		const positions = points.map( ( { UUID, position } ) => {
			return new Vector3( ...position );
		} );
		const curvePoints = this.#computeCurve( positions );
		// console.log( curvePoints );

		const lineMaterial = new LineBasicMaterial( { color: 0x000000 } );
		const lineGeometry = new BufferGeometry( ).setFromPoints( curvePoints.flat() );
		this.#patchMesh = new Line( lineGeometry, lineMaterial );

		const planeGeometry = new PlaneGeometry( 1, 1, this.#sampling - 1, this.#sampling - 1 );
		const planeMaterial = new MeshLambertMaterial( { color: 0xbbbbff, wireframe: false, side: DoubleSide } );
		this.#patchMesh = new Mesh( planeGeometry, planeMaterial );

		const pos = planeGeometry.attributes.position;


		for ( let i = 0; i < curvePoints.length; ++i ) {
			pos.setXYZ( i, curvePoints[ i ].x, curvePoints[ i ].y, curvePoints[ i ].z );
		}

		this.add( this.#patchMesh );
	}

	#computeCurve ( positions = [ ] ) {
		console.log( "BezierPatchView - computeCurve" );
		if ( positions.length == 0 )
			return [ ];

		const patchPoints = new Array( this.#sampling * this.#sampling );
		const sample = 1 / ( this.#sampling - 1 );

		console.log( positions );
		let tl = 0;
		let tc = 0;
		const linePoints = [ [ ], [ ], [ ], [ ] ];
		for ( let s = 0; s < this.#sampling; ++s ) {
			tl = s * sample;

			const pos2 = positions.map( p => p.clone( ) );
			for ( let i = 1; i < 4; ++i ) {
				for ( let j = 0; j < 4 - i; ++j ) {
					pos2[ j ].multiplyScalar( 1 - tl ).addScaledVector( pos2[ j + 1 ], tl );
					pos2[ j + 4 ].multiplyScalar( 1 - tl ).addScaledVector( pos2[ j + 4 + 1 ], tl );
					pos2[ j + 8 ].multiplyScalar( 1 - tl ).addScaledVector( pos2[ j + 8 + 1 ], tl );
					pos2[ j + 12 ].multiplyScalar( 1 - tl ).addScaledVector( pos2[ j + 12 + 1 ], tl );
				}
			}
			linePoints[ 0 ][ s ] = pos2[ 0 ].clone( );
			linePoints[ 1 ][ s ] = pos2[ 4 ].clone( );
			linePoints[ 2 ][ s ] = pos2[ 8 ].clone( );
			linePoints[ 3 ][ s ] = pos2[ 12 ].clone( );
		}

		const points = [ new Vector3( ), new Vector3( ), new Vector3( ), new Vector3( ) ];
		const points2 = [ new Vector3( ), new Vector3( ), new Vector3( ), new Vector3( ) ];
		for ( let sl = 0; sl < this.#sampling; ++sl ) {
			tl = sl * sample;

			points[ 0 ].copy( linePoints[ 0 ][ sl ] );
			points[ 1 ].copy( linePoints[ 1 ][ sl ] );
			points[ 2 ].copy( linePoints[ 2 ][ sl ] );
			points[ 3 ].copy( linePoints[ 3 ][ sl ] );
			
			for ( let sc = 0; sc < this.#sampling; ++sc ) {
				tc = sc * sample;

				const points2 = points.map( p => p.clone( ) );

				for ( let i = 1; i < 4; ++i ) {
					for ( let j = 0; j < 4 - i; ++j ) {
						points2[ j ].multiplyScalar( 1 - tc ).addScaledVector( points2[ j + 1 ], tc );
					}
				}
				patchPoints[ sl * this.#sampling + sc ] = points2[ 0 ].clone( );
			}
		}

		return patchPoints;
	}
}