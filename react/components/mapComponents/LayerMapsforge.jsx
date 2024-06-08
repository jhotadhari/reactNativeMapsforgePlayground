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

const { MapLayerMapsforgeModule } = NativeModules;


const LayerMapsforge = ( {
	mapFile,
	renderTheme,
    reactTreeIndex,
} ) => {

	renderTheme = renderTheme || '';

	const {
		mapViewNativeTag,
	} = useContext( MapContext );

	const [hash,setHash] = useState( null );

	const mapLayersCreated = useMapLayersCreated( mapViewNativeTag );

	useEffect( () => {
		if ( mapLayersCreated && null === hash && mapViewNativeTag && mapFile ) {
			setHash( false );
			MapLayerMapsforgeModule.createLayer( mapViewNativeTag, mapFile, renderTheme, reactTreeIndex ).then( newHash => {
				if ( newHash ) {
					setHash( newHash );
				}
			} );
		}
		return () => {
			if ( hash && mapViewNativeTag ) {
				MapLayerMapsforgeModule.removeLayer( mapViewNativeTag, hash );
			}
		};
	}, [
		mapLayersCreated,
		mapViewNativeTag,
		!! hash,
	] );

	useEffect( () => {
		// if ( hash && mapViewNativeTag ) {
		// 	MapLayerMapsforgeModule.setMarkerLocation( mapViewNativeTag, hash, latLong );
		// }
	}, [mapFile] );

	useEffect( () => {
		// if ( hash && mapViewNativeTag ) {
		// 	MapLayerMapsforgeModule.setMarkerIcon( mapViewNativeTag, hash, iconWithDefaults );
		// }
	}, [renderTheme] );

	return null;
};
LayerMapsforge.isMapLayer = true;

// LayerMapsforge.propTypes = {

// };

export default LayerMapsforge;