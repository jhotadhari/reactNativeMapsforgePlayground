
/**
 * External dependencies
 */
import React, {
	useState,
} from 'react';
import {
	Button,
	Text,
	View,
} from 'react-native';
import { uniqueId } from 'lodash-es';

/**
 * react-native-mapsforge dependencies
 */
import {
	useMapEvents,
} from 'react-native-mapsforge';

const AddMarker = ( {
	nativeTag,
	segments,
	setSegments,
} ) => {

	const [center,setCenter] = useState( null );

	useMapEvents( {
		nativeTag,
		onFrameBuffer: event => {
			// console.log( 'debug frameBuffer event', event ); // debug
			if ( event.center ) {
				setCenter( event.center )
			}
		},
	} );

	return <>
        <Button
            onPress={ () => {
                if ( center ) {

                    let newSegment = {
                        id: uniqueId(),
                        start: center,
                    };
                    let newSegments = [...segments,newSegment];

                    setSegments( newSegments );
                }
            } }
            title="add"
        />

        { center && <Text style={ { marginLeft: 10 } }>{ center.join( ', ' )}</Text> }
	</>;
};

const RouterUi = ( {
    style,
    nativeTag,
    segments,
    setSegments,
} ) => {

	return <View
        style={ {
            ...style,
            position: 'absolute',
            bottom: 0,
            left: 0,
        } }
    >
        <View
            style={ {
                ...style,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                margin: 15,
            } }
        >
            <AddMarker
                nativeTag={ nativeTag }
                segments={ segments }
                setSegments={ setSegments }
            />
        </View>
    </View>;
};

export default RouterUi;
