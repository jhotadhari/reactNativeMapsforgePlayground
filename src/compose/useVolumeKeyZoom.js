
/**
 * External dependencies
 */
import {
	useEffect,
} from 'react';
import {
	NativeEventEmitter,
} from 'react-native';

/**
 * Internal dependencies
 */
import {
    nativeMapModules,
    promiseQueue,
} from 'react-native-mapsforge';

const { MapContainerModule } = nativeMapModules;

const useVolumeKeyZoom = nativeTag => {

	useEffect( () => {
        const eventEmitter = new NativeEventEmitter();
		let eventListener = eventEmitter.addListener( 'onHardwareKeyUp', result => {
            if ( nativeTag ) {
                switch( result.keyCodeString ) {
					case 'KEYCODE_VOLUME_UP':
                        promiseQueue.enqueue( () => {
                            MapContainerModule.zoomIn( nativeTag );
                        } );
						break;
                    case 'KEYCODE_VOLUME_DOWN':
                        promiseQueue.enqueue( () => {
                            MapContainerModule.zoomOut( nativeTag );
                        } );
						break;
				}
			}
		} );
		return () => {
			eventListener.remove();
		};

	}, [nativeTag] );

};

export default useVolumeKeyZoom;
