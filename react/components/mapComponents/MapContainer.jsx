import React, {
	cloneElement,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	PixelRatio,
	UIManager,
	findNodeHandle,
	useWindowDimensions,
	ScrollView,
	NativeEventEmitter,
	NativeModules,
} from 'react-native';

import { MapViewManager } from './MapViewManager.jsx';
import { MapContext } from '../../MapContext.js';
import useMapLayersCreated from '../../compose/useMapLayersCreated';
const { MapContainerModule } = NativeModules;

const createFragment = mapViewNativeTag =>
	UIManager.dispatchViewManagerCommand(
		mapViewNativeTag,
		// we are calling the 'create' command
		UIManager.MapViewManager.Commands.create.toString(),
		[mapViewNativeTag],
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
	zoom,
	minZoom,	// ??? TODO doesn't react on prop change
	maxZoom,	// ??? TODO doesn't react on prop change
} ) => {

	const ref = useRef( null );

	const [
		mapViewNativeTag, setMapViewNativeTag,
	] = useState( null );

	const mapLayersCreated = useMapLayersCreated( ref?.current?._nativeTag );

	width = useDefaultWidth( width );
	height = height || 200;
	center = center && Array.isArray( center ) && center.length === 2 ? center : [
		52.5, 13.4,
	];
	zoom = zoom || 12;
	minZoom = minZoom || 3;
	maxZoom = maxZoom || 50;

	useEffect( () => {
		setMapViewNativeTag( findNodeHandle( ref.current ) );
	}, [] );
	useEffect( () => {
		if ( mapViewNativeTag ) {
			createFragment( mapViewNativeTag );
		}
	}, [mapViewNativeTag] );

	useEffect( () => {
		if ( mapLayersCreated && mapViewNativeTag ) {
			MapContainerModule.setZoom( mapViewNativeTag, zoom );
		}
	}, [zoom] );

	useEffect( () => {
		const eventEmitter = new NativeEventEmitter();
		let eventListener = eventEmitter.addListener( 'MapMove', result => {
			if ( result.nativeTag === mapViewNativeTag ) {
				// console.log( 'debug on move', result ); // debug
			}
		} );
		return () => {
			eventListener.remove();
		};
	}, [mapViewNativeTag] );

	useEffect( () => {
		const eventEmitter = new NativeEventEmitter();
		let eventListener = eventEmitter.addListener( 'MapZoom', result => {
			if ( result.nativeTag === mapViewNativeTag ) {
				// console.log( 'debug on zoom', result ); // debug
			}
		} );
		return () => {
			eventListener.remove();
		};
	}, [mapViewNativeTag] );

	let lastIndex = -1;
	const wrapChildren = children => children ? React.Children.map( children, ( child, index ) => {
		lastIndex = child?.type?.isMapLayer ? lastIndex + 1 : lastIndex;
		const newChild = child ? cloneElement(
			child,
			{
				...( child.type.isMapLayer && { reactTreeIndex: lastIndex } ),
				...( child.props.children && { children: wrapChildren( child.props.children ) } ),
			},
		) : child;
		return newChild;
	} ) : children;

	const wrappedChildren = wrapChildren( children );

	return <MapContext.Provider
		value={ { mapViewNativeTag: ref?.current?._nativeTag } }
	>
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
			{ wrappedChildren }
		</ScrollView>
	</MapContext.Provider>;
};

export default MapContainer;
