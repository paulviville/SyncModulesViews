import ModulesRegistry from "../SyncModules/Core/ModulesRegistry.js";
import ViewCore from "./ViewCore.js";
import ViewTypes from "./ViewTypes.js";
import { PolarGridHelper } from '../three/three.module.js';

export default class ViewsRegistry extends ViewCore {
	static type = ModulesRegistry.type;

	#views = new Map( ); /// ModuleUUID -> ModuleView

	constructor ( module ) {
		console.log( `ViewsRegistry - constructor` );
		
		super( module );

		/// debug
		this.add( new PolarGridHelper( 1, 16, 8) );
		/// end debug
	}

	setCallbacks ( ) {
		// console.log( `ViewsRegistry - setCallbacks` );

		this.module.setOnChange( this.module.commands.addModule,
			( moduleData ) => this.#addModuleView( moduleData ) 
		);
		this.module.setOnChange(this.module.commands.removeModule,
			( moduleData ) => this.#removeModuleView( moduleData ) 
		);
	}

	getView ( moduleUUID ) {
		return this.#views.get( moduleUUID );
	}

	#addModuleView ( moduleData ) {
		console.log( `ViewsRegistry - #addModuleView` );

		const { type, UUID } = moduleData;
		const module = this.module.getModule( UUID );

		const constructor = ViewTypes[ type ] || ViewCore;
		const view = new constructor( module );
		
		this.add( view );
		this.#views.set( UUID, view );

		return view;
	}

	#removeModuleView ( moduleData ) {
		// console.log( `ViewsRegistry - #removeModuleView` );

		const view = this.getView( moduleData.UUID );
		if ( view === undefined ) {
			return;
		}

		this.remove( view );
		view.delete( );
	}
}