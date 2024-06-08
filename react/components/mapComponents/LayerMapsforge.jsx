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

	// persistentCache,	// ??? TODO
} ) => {

	renderTheme = renderTheme || 'DEFAULT';

	const { mapViewNativeTag } = useContext( MapContext );

	const [
		hash, setHash,
	] = useState( null );

	const mapLayersCreated = useMapLayersCreated( mapViewNativeTag );

	const createLayer = () => {
		MapLayerMapsforgeModule.createLayer( mapViewNativeTag, mapFile, renderTheme, reactTreeIndex ).then( newHash => {
			if ( newHash ) {
				setHash( newHash );
			}
		} );
	};

	useEffect( () => {
		if ( mapLayersCreated && null === hash && mapViewNativeTag && mapFile ) {
			setHash( false );
			createLayer();
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
		if ( mapLayersCreated && hash && mapViewNativeTag ) {
			MapLayerMapsforgeModule.removeLayer( mapViewNativeTag, hash ).then( removedHash => {
				if ( removedHash ) {
					MapLayerMapsforgeModule.createLayer( mapViewNativeTag, mapFile, renderTheme, reactTreeIndex ).then( newHash => {
						if ( newHash ) {
							setHash( newHash );
						}
					} );
				}

			} );
		}
	}, [
		mapFile,
		renderTheme,
	] );

	return null;
};
LayerMapsforge.isMapLayer = true;

// LayerMapsforge.propTypes = {

// };

export default LayerMapsforge;