import LineModule from "../SyncModules/LineModule.js";
import ViewCore from "./ViewCore.js";
import { Vector3, BufferGeometry, LineBasicMaterial, Line } from "three";

export default class LineView extends ViewCore {
	static type = LineModule.type;

	#lineMesh;

	constructor ( module ) {
		console.log( `LineView - constructor` );

		super( module );

		const lineGeometry = new BufferGeometry( ).setFromPoints( [
			new Vector3( ),	new Vector3( )
		] );

		const lineMaterial = new LineBasicMaterial( { color: 0xffffff } );

		this.#lineMesh = new Line( lineGeometry, lineMaterial );
		this.add( this.#lineMesh );

		this.#updateLine( module.line );
	}

	setCallbacks ( ) {
		console.log( `LineView - setCallbacks` );

		this.module.setOnChange( this.module.commands.updateLine,
			( line ) => this.#updateLine( line )
		);
	}

	#updateLine ( line ) {
		console.log( `LineView - #updateLine` );
		console.log(line)
		const position = this.#lineMesh.geometry.attributes.position;
		position.array.set( [ ...line.origin, ...line.end ] );
		position.needsUpdate = true;
	}
}