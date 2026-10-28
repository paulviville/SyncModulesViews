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

		this.#updateCamera( module.camera );
		this.add( this.#pointLight );
		this.add( this.#pointLightHelper );
	}

	setCallbacks ( ) {
		super.setCallbacks( );
		// this.module.setOnChange( this.module.commands.updateCamera, 
		// 	( camera ) => this.#updateCamera( camera ) 
		// );
	}

	#updateCamera ( camera ) {

	}

	get light ( ) {
		return this.#pointLight;
	}

	get helper ( ) {
		return this.#pointLightHelper;
	}
}