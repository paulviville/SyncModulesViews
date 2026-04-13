import TextLogModule from "../SyncModules/TextLogModule.js";
import ViewCore from "./ViewCore.js";

export default class TextLogView extends ViewCore {
	static type = TextLogModule.type;

	constructor ( module ) {
		console.log( `TextLogView - constructor` );

		super( module );

	}

	setCallbacks ( ) {
		this.module.setOnChange( this.module.commands.addText,
			( textLog ) => this.#updateLog( textLog )
		);
		this.module.setOnChange( this.module.commands.removeText,
			( textLog ) => this.#updateLog( textLog )
		);
		this.module.setOnChange( this.module.commands.updateText,
			( textLog ) => this.#updateLog( textLog )
		);
		this.module.setOnChange( this.module.commands.clear,
			( ) => this.#updateLog( [ ] )
		);
	}

	#updateLog ( textLog ) {
		console.log( textLog );
	}
}