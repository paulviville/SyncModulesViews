import LightModule from "../SyncModules/LightModule.js";
import TransformView from "./TransformView.js";

export default class LightView extends TransformView {
	static type = LightModule.type;

	constructor ( module ) {
		super( module );
	}

	setCallbacks ( ) {
		super.setCallbacks( );
		this.module.setOnChange( this.module.commands.setIntensity, 
			( intensity ) => this.#setIntensity( intensity ) 
		);
		this.module.setOnChange( this.module.commands.setColor, 
			( color ) => this.#setColor( color ) 
		);
	}

	#setIntensity ( intensity ) {
		if ( this.light )
			this.light.intensity = intensity;
		this.helper?.update( );
		console.log( this.light?.intensity );
	}

	#setColor ( color ) {
		if ( this.light )
			this.light.color.fromArray( color );
		this.helper?.update( );
	}

	get light ( ) {

	}

	get helper ( ) {

	}
}