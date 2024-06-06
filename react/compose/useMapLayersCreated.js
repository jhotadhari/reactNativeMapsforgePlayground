import {
	useEffect,
	useState,
} from 'react';
import {
	NativeEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';

const useMapLayersCreated = viewId => {

	const [mapLayersCreated,setMapLayersCreated] = useState( false );

	useEffect( () => {
		const eventEmitter = new NativeEventEmitter();
		let eventListener = eventEmitter.addListener( 'MapLayersCreated', result => {
			if ( result.nativeTag === viewId ) {
				setMapLayersCreated( true );
			}
		} );
		return () => {
			eventListener.remove();
		};
	}, [viewId] );

	return mapLayersCreated;
};

export default useMapLayersCreated;