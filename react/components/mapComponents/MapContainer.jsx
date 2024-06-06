import React, {
	useEffect,
	useRef,
	useState,
	useContext,
} from 'react';
import {
	PixelRatio,
	UIManager,
	findNodeHandle,
	useWindowDimensions,
	ScrollView,
	NativeModules,
} from 'react-native';

import { MapViewManager } from './MapViewManager.jsx';
import { MapContext } from '../../MapContext.js';

const createFragment = viewId =>
	UIManager.dispatchViewManagerCommand(
		viewId,
		// we are calling the 'create' command
		UIManager.MapViewManager.Commands.create.toString(),
		[viewId],
	);

const useDefaultWidth = propsWidth => {
	const { width } = useWindowDimensions();
	return propsWidth || width;
};

const MapContainer = ( {
	children,
	width,		// ??? TODO doesn't react on prop change
	height,		// ??? TODO doesn't react on prop change
	center,		// ??? TODO doesn't react on prop change
	zoom,		// ??? TODO doesn't react on prop change
	minZoom,	// ??? TODO doesn't react on prop change
	maxZoom,	// ??? TODO doesn't react on prop change
} ) => {

	const ref = useRef( null );

	const [viewId,setViewId] = useState( null );

	width = useDefaultWidth( width );
	height = height || 200;
	center = center && Array.isArray( center ) && center.length === 2 ? center : [52.5, 13.4];
	zoom = zoom || 12;
	minZoom = minZoom || 3;
	maxZoom = maxZoom || 50;

	useEffect( () => {
		setViewId( findNodeHandle( ref.current ) );
	}, [] );
	useEffect( () => {
		if ( viewId ) {
			createFragment( viewId );
		}
	}, [viewId] );

	return <MapContext.Provider value={ {
		mapViewManager: ref?.current,
	} }>
		{/* Wrap into non scrollable ScrollView to fix top positioning */}
		<ScrollView scrollEnabled={ false }>
			<MapViewManager
				ref={ ref }
				width={ PixelRatio.getPixelSizeForLayoutSize( width ) }
				height={ PixelRatio.getPixelSizeForLayoutSize( height ) }
				center={ center }
				zoom={ zoom }
				minZoom={ minZoom }
				maxZoom={ maxZoom }
			/>
			{ children }
		</ScrollView>
	</MapContext.Provider>;
};

export default MapContainer;