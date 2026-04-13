import { Box3, Box3Helper } from "three";
import TriggerModule from "../SyncModules/TriggerModule.js";
import ViewCore from "./ViewCore.js";

export default class TriggerView extends ViewCore {
	static type = TriggerModule.type;

	/// placeholder mesh
	#box = new Box3();
	#boxHelper = new Box3Helper( this.#box, 0xFFFF00 );

	constructor ( module ) {
		console.log( `TriggerView - constructor` );

		super( module );

		/// debug
		this.add( this.#boxHelper );
		this.#boxHelper.visible = false;
	}

	setCallbacks ( ) {
		console.log( `TriggerView - setCallbacks` );

		this.module.setOnChange( this.module.commands.trigger,
			( ) => this.#trigger( )
		);
	}

	#trigger ( ) {
		console.log( `TriggerView - triggered` );
		this.#boxHelper.visible = true;
		setTimeout( ( ) => {
			this.#boxHelper.visible = false
			console.log("timeout")
		}, 1000);
	}
}