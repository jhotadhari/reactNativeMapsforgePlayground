import React, {
	useEffect,
	useState,
	useContext,
} from 'react';
import {
	NativeModules,
} from 'react-native';
import PropTypes from 'prop-types';

import { MapContext } from '../../MapContext.js';

const { MapMarkerModule } = NativeModules;

const Marker = ( {
	latLong,
} ) => {

	const {
		mapViewManager,
	} = useContext( MapContext );

	const [hash,setHash] = useState( null );

	useEffect( () => {
		if ( null === hash && mapViewManager && mapViewManager._nativeTag ) {
			setHash( false );
			setTimeout( () => {	// ??? the mapView has to be initiated by java. TODO: replace setTimeout with event listener that mapView is ready.
				MapMarkerModule.createMarker( mapViewManager._nativeTag, latLong ).then( newHash => {
					if ( newHash ) {
						setHash( newHash );
					}
				} );
			}, 100 );
		}
		return () => {
			if ( hash && mapViewManager && mapViewManager._nativeTag ) {

				MapMarkerModule.removeMarker( mapViewManager._nativeTag, hash );
			}
		};
	}, [
		mapViewManager && mapViewManager._nativeTag,
		mapViewManager?._nativeTag,
		hash,
	] );

	useEffect( () => {
		if ( hash && mapViewManager && mapViewManager._nativeTag ) {
			MapMarkerModule.setMarkerLocation( mapViewManager._nativeTag, hash, latLong );
		}
	}, [latLong] );

	return null;
};

Marker.propTypes = {
	latLong: function( props, propName, componentName) {
		if (
			! Array.isArray( props[propName] )																// is Array
			|| props[propName].length !== 2																	// is length 2
			|| ! [...props[propName]].reduce( ( acc, val ) => acc ? typeof val === 'number' : acc, true )	// all items is number
		) {
			return new Error(
				'Invalid prop `' + propName + '` supplied to' +
				' `' + componentName + '`. Validation failed.'
			);
		}
	},
};

export default Marker;