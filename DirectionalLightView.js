import DirectionalLightModule from "../SyncModules/DirectionalLightModule.js";
import LightView from "./LightView.js";
import { DirectionalLight, DirectionalLightHelper } from "../three/three.module.js";

export default class DirectionalLightView extends LightView {
	static type = DirectionalLightModule.type;

	#directionalLight = new DirectionalLight( 0xffffff )
	#directionalLightHelper = new DirectionalLightHelper( this.#directionalLight );


	constructor ( module ) {
		super( module );

		this.#setTarget( module.target );
		this.add( this.#directionalLight );
		this.add( this.#directionalLightHelper );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.setTarget, 
			( target ) => this.#setTarget( target ) 
		);
	}

	#setTarget ( target ) {
		this.light.target.position.set( ...target );
		this.helper.update( );
	}

	get light ( ) {
		return this.#directionalLight;
	}

	get helper ( ) {
		return this.#directionalLightHelper;
	}
}