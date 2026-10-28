import PointLightModule from "../SyncModules/PointLightModule.js";
import LightView from "./LightView.js";
import { PointLight, PointLightHelper } from "../three/three.module.js";

export default class PointLightView extends LightView {
	static type = PointLightModule.type;

	#pointLight = new PointLight( 0xffffff )
	#pointLightHelper = new PointLightHelper( this.#pointLight );


	constructor ( module ) {
		// console.log( `PointLightView - constructor` );
		
		super( module );

		this.#setDecay( module.decay );
		this.#setDistance( module.distance );
		this.add( this.#pointLight );
		this.add( this.#pointLightHelper );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.setDecay, 
			( decay ) => this.#setDecay( decay ) 
		);
		this.module.setOnChange( this.module.commands.setDistance, 
			( distance ) => this.#setDistance( distance ) 
		);
	}

	#setDecay ( decay ) {
		this.light.decay = decay;
		this.helper.update( );
	}

	#setDistance ( distance ) {
		this.light.distance = distance;
		this.helper.update( );
	}

	get light ( ) {
		return this.#pointLight;
	}

	get helper ( ) {
		return this.#pointLightHelper;
	}
}