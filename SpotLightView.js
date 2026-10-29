import SpotLightModule from "../SyncModules/SpotLightModule.js";
import LightView from "./LightView.js";
import { SpotLight, SpotLightHelper } from "../three/three.module.js";

export default class SpotLightView extends LightView {
	static type = SpotLightModule.type;

	#spotLight = new SpotLight( 0xffffff )
	#spotLightHelper = new SpotLightHelper( this.#spotLight );


	constructor ( module ) {
		// console.log( `PointLightView - constructor` );
		
		super( module );

		this.#setDistance( module.distance );
		this.#setDecay( module.decay );
		this.#setPenumbra( module.penumbra );
		this.#setAngle( module.angle );
		this.add( this.#spotLight );
		this.add( this.#spotLightHelper );
	}

	setCallbacks ( ) {
		super.setCallbacks( );

		this.module.setOnChange( this.module.commands.setDecay, 
			( decay ) => this.#setDecay( decay ) 
		);
		this.module.setOnChange( this.module.commands.setDistance, 
			( distance ) => this.#setDistance( distance ) 
		);

		this.module.setOnChange( this.module.commands.setPenumbra, 
			( penumbra ) => this.#setPenumbra( penumbra ) 
		);
		this.module.setOnChange( this.module.commands.setAngle, 
			( angle ) => this.#setAngle( angle ) 
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

	#setPenumbra ( penumbra ) {
		this.light.penumbra = penumbra;
		this.helper.update( );
	}

	#setAngle ( angle ) {
		this.light.angle = angle;
		this.helper.update( );
	}

	get light ( ) {
		return this.#spotLight;
	}

	get helper ( ) {
		return this.#spotLightHelper;
	}
}