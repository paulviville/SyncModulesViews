import ObjectModule from "../SyncModules/ObjectModule.js";
import TransformView from "./TransformView.js";

export default class ObjectView extends TransformView {
	static type = ObjectModule.type;

	constructor ( module ) {
		 console.log( `ObjectView - constructor` );
		
		super( module );

		this.#addChildren( module.children );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.addChildren, 
			( children ) => this.#addChildren( children ) 
		);

		this.module.setOnChange( this.module.commands.removeChildren, 
			( children ) => this.#removeChildren( children ) 
		);
	}

	#addChildren ( children ) {
		//console.log( `ObjectView - addChildren` );

		for ( const child of children ) {
			const view = this._registry.getView( child );
			this.add( view );
		}
	}

	#removeChildren ( children ) {
		//console.log( `ObjectView - removeChildren` );

		for ( const child of children ) {
			const view = this._registry.getView( child );
			this._registry.add( view );
		}
	}
}