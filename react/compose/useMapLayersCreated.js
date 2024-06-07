import {
	useEffect,
	useState,
} from 'react';
import {
	NativeModules,
	NativeEventEmitter,
} from 'react-native';

const { MapContainerModule } = NativeModules;

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


	useEffect( () => {
		if ( viewId && null !== viewId ) {
			MapContainerModule.getLayersCreated( viewId ).then( created => {
				setMapLayersCreated( !! created );
			} );
		}
	}, [viewId] );

	return mapLayersCreated;
};

export default useMapLayersCreated;