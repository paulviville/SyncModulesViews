import AmbientLightModule from "../SyncModules/AmbientLightModule.js";
import LightView from "./LightView.js";
import { AmbientLight } from "../three/three.module.js";

export default class AmbientLightView extends LightView {
	static type = AmbientLightModule.type;

	#ambientLight = new AmbientLight( 0xffffff )

	constructor ( module ) {
		super( module );

		this.add( this.#ambientLight );
	}

	get light ( ) {
		return this.#ambientLight;
	}
}