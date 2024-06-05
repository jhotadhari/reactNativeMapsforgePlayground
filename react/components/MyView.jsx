import React, {
	useEffect,
	useRef,
	isValidElement,
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
	View,
	Text,
} from 'react-native';

import { MyViewManager } from './MyViewManager.jsx';
import { MapContext } from '../MapContext.js';

const { MapMarkerModule } = NativeModules;


const createFragment = viewId =>
	UIManager.dispatchViewManagerCommand(
		viewId,
		// we are calling the 'create' command
		UIManager.MyViewManager.Commands.create.toString(),
		[viewId],
	);



const Marker = ( {
	latLong,
} ) => {

	const {
		myViewManager,
	} = useContext( MapContext );
	const [initialized,setInitialized] = useState( null );

	useEffect( () => {
		if ( null === initialized && myViewManager && myViewManager._nativeTag ) {
			setInitialized( false );
			setTimeout( () => {	// ??? the mapView has to be initiated by java. TODO: replace setTimeout with event listener that mapView is ready.
				MapMarkerModule.createMarker( myViewManager._nativeTag, latLong ).then( res => {
					setInitialized( true );
				} );
			}, 100 );
		}
		// TODO return remove marker
	}, [
		myViewManager && myViewManager._nativeTag,
		myViewManager?._nativeTag
	] );

	return null;
};

const useDefaultWidth = propsWidth => {
	const { width } = useWindowDimensions();
	return propsWidth || width;
};

const MyView = ( {
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
		myViewManager: ref?.current,
	} }>
		{/* Wrap into non scrollable ScrollView to fix top positioning */}
		<ScrollView scrollEnabled={ false }>
			<MyViewManager
				ref={ ref }
				height={ PixelRatio.getPixelSizeForLayoutSize( 200 ) }
				width={ PixelRatio.getPixelSizeForLayoutSize( width ) }
			/>
			{ children }
		</ScrollView>
	</MapContext.Provider>;
};

export {
	MyView,
	Marker,
};