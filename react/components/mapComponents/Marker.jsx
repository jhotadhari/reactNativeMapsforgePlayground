import React, {
	useEffect,
	useState,
	useContext,
} from 'react';
import {
	NativeModules,
} from 'react-native';

import { MapContext } from '../../MapContext.js';

const { MapMarkerModule } = NativeModules;

const Marker = ( {
	latLong,
} ) => {

	const {
		mapViewManager,
	} = useContext( MapContext );
	const [initialized,setInitialized] = useState( null );

	useEffect( () => {
		if ( null === initialized && mapViewManager && mapViewManager._nativeTag ) {
			setInitialized( false );
			setTimeout( () => {	// ??? the mapView has to be initiated by java. TODO: replace setTimeout with event listener that mapView is ready.
				MapMarkerModule.createMarker( mapViewManager._nativeTag, latLong ).then( res => {
					setInitialized( true );
				} );
			}, 100 );
		}
		// TODO return remove marker
	}, [
		mapViewManager && mapViewManager._nativeTag,
		mapViewManager?._nativeTag
	] );

	return null;
};

export default Marker;