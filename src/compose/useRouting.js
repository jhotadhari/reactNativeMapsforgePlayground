
/**
 * External dependencies
 */
import {
	useEffect,
	useState,
} from 'react';
import {
	NativeModules,
} from 'react-native';

/**
 * Internal dependencies
 */
import { LINKING_ERROR } from '../constants';


const BRouterModule = NativeModules.BRouterModule
	? NativeModules.BRouterModule
	: new Proxy(
		{},
		{
			get() {
				throw new Error( LINKING_ERROR );
			},
		},
	);


const useRouting = () => {

	const [segments,setSegments] = useState( [] );

	useEffect( () => {
		[...segments].map( ( segment, index ) => {

			if ( segments.length > index + 1 && ! segment.isFetching && ! segment.positions ) {

				let newSegments = [...segments]
				newSegments.splice( index, 1, {
					...segment,
					isFetching: true,
				} );
				setSegments( newSegments );

				const params = {
					lonLats: [
						[...segment.start].reverse().join( ',' ),
						[...segments[index+1].start].reverse().join( ',' ),
					].join( '|' )
				};

				BRouterModule.getTrackFromParams( params ).then( result => {

					console.log( 'debug result', result ); // debug
					if ( result.positions && Array.isArray( result.positions ) ) {
						// console.log( 'debug typeof result', result.positions[1] ); // debug
						let newSegments = [...segments]
						newSegments.splice( index, 1, {
							...segment,
							positions: result.positions,
							isFetching: false,
						} );
						setSegments( newSegments );
					}
				} );
			}
		} )
	}, [segments] );

	return [segments,setSegments];
};

export default useRouting;
