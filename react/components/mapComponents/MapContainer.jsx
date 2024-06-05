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
	width,
	height,
} ) => {

	const ref = useRef( null );

	const [viewId,setViewId] = useState( null );

	width = useDefaultWidth( width );
	height = height || 200;

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
				height={ PixelRatio.getPixelSizeForLayoutSize( 200 ) }
				width={ PixelRatio.getPixelSizeForLayoutSize( width ) }
			/>
			{ children }
		</ScrollView>
	</MapContext.Provider>;
};

export default MapContainer;