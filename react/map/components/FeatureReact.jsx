/**
 * External dependencies
 */
import React, {
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	Animated,
	PixelRatio,
	NativeModules,
	View,
	NativeEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import MapPropTypes from '../MapPropTypes';
import useMapLayersCreated from '../compose/useMapLayersCreated';
const { MapFeatureReactModule } = NativeModules;

const FeatureReact = ( {
	mapViewNativeTag,
	latLong,
	children,
} ) => {

	const [
		uid, setUid,
	] = useState( null );

	const fadeAnim = {
		x: useRef( new Animated.Value(0) ).current,
		y: useRef( new Animated.Value(0) ).current,
	};

	const mapLayersCreated = useMapLayersCreated( mapViewNativeTag );

	useEffect( () => {
		if ( mapLayersCreated && null === uid && mapViewNativeTag ) {
			setUid( false );
			MapFeatureReactModule.createFeature(
				mapViewNativeTag,
				latLong,
			).then( newUid => {
				if ( newUid ) {
					setUid( newUid );
				}
			} );
		}
		return () => {
			if ( uid && mapViewNativeTag ) {
				MapFeatureReactModule.removeFeature( mapViewNativeTag, uid );
			}
		};
	}, [
		mapLayersCreated,
		mapViewNativeTag,
		!! uid,
	] );

	useEffect( () => {
		if ( uid && mapViewNativeTag ) {
			const eventEmitter = new NativeEventEmitter();
			let eventListener = eventEmitter.addListener( 'MapMoveFeature', result => {
				if ( result.nativeTag === mapViewNativeTag && result.uid === uid && result.xy ) {
					Animated.timing( fadeAnim.x, {
						toValue: result.xy.x,
						duration: 10,
						useNativeDriver: true,
					} ).start();
					Animated.timing( fadeAnim.y, {
						toValue: result.xy.y,
						duration: 10,
						useNativeDriver: true,
					} ).start();
				}
			} );
			return () => {
				eventListener.remove();
			};
		}
	}, [mapViewNativeTag,uid] );

	useEffect( () => {
		if ( uid && mapViewNativeTag ) {
			MapFeatureReactModule.setLocation( mapViewNativeTag, uid, latLong );
		}
	}, [latLong] );

	return <Animated.View style={ {
		zIndex: 99999,
		top: 0,
		left: 0,
		position: 'absolute',
		transform: [
			{ translateX: fadeAnim.x },
			{ translateY: fadeAnim.y },
		],
	} }>
		{ children }
	</Animated.View>;
};

FeatureReact.propTypes = {
	mapViewNativeTag: PropTypes.number,
	latLong: MapPropTypes.latLong,
};

export default FeatureReact;