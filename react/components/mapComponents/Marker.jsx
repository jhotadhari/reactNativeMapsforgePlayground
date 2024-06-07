import React, {
	useEffect,
	useState,
	useContext,
} from 'react';
import {
	PixelRatio,
	NativeModules,
	NativeEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';

import { MapContext } from '../../MapContext';
import useMapLayersCreated from '../../compose/useMapLayersCreated';

const { MapMarkerModule } = NativeModules;

const defaultIconSize = PixelRatio.getPixelSizeForLayoutSize( 20 );

const Marker = ( {
	latLong,
	icon,
} ) => {

	const {
		mapViewNativeTag,
	} = useContext( MapContext );

	const iconWithDefaults = {
		width: defaultIconSize,		// number
		height: defaultIconSize,	// number
		path: '',					// absolute path or empty. if empty, java will fallback to a round icon.
		anchor: [0,0],				// array of two numbers. horizontal and vertical offset from center.
		...( icon || {} ),
	};

	const [hash,setHash] = useState( null );

	const mapLayersCreated = useMapLayersCreated( mapViewNativeTag );

	useEffect( () => {
		if ( mapLayersCreated && null === hash && mapViewNativeTag ) {
			setHash( false );
			MapMarkerModule.createMarker( mapViewNativeTag, latLong, iconWithDefaults ).then( newHash => {
				if ( newHash ) {
					setHash( newHash );
				}
			} );
		}
		return () => {
			if ( hash && mapViewNativeTag ) {
				MapMarkerModule.removeMarker( mapViewNativeTag, hash );
			}
		};
	}, [
		mapLayersCreated,
		mapViewNativeTag,
		!! hash,
	] );

	useEffect( () => {
		if ( hash && mapViewNativeTag ) {
			MapMarkerModule.setMarkerLocation( mapViewNativeTag, hash, latLong );
		}
	}, [latLong] );

	useEffect( () => {
		if ( hash && mapViewNativeTag ) {
			MapMarkerModule.setMarkerIcon( mapViewNativeTag, hash, iconWithDefaults );
		}
	}, [icon] );

	return null;
};

Marker.propTypes = {
	latLong: function( props, propName, componentName) {
		if (
			! Array.isArray( props[propName] )																// is Array
			|| props[propName].length !== 2																	// is length 2
			|| ! [...props[propName]].reduce( ( acc, val ) => acc ? typeof val === 'number' : acc, true )	// all items is number
		) {
			return new Error( 'Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.' );
		}
	},

	icon: function( props, propName, componentName) {
		if ( undefined !== props[propName] ) {

			let isError = typeof props[propName] !== 'object';

			const {
				path,
				width,
				height,
				anchor,
			} = props[propName];

			if ( ! isError && undefined !== path
				&& typeof path !== 'string'
			) { isError = true; }

			if ( ! isError && undefined !== width
				&& ( typeof width !== 'number' || width < 0 )
			) { isError = true; }

			if ( ! isError && undefined !== height
				&& ( typeof height !== 'number' || height < 0 )
			) { isError = true; }

			if ( ! isError && undefined !== anchor
				&& ( ! Array.isArray( anchor ) || anchor.length !== 2 || ! [...anchor].reduce( ( acc, val ) => acc ? typeof val === 'number' : acc, true ) )
			) { isError = true; }

			if ( isError ) {
				return new Error( 'Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.' );
			}
		}
	},
};

export default Marker;