
/**
 * External dependencies
 */
import React from 'react';
import {
	Text,
	View,
} from 'react-native';

const Center = ( {
	width,
	height,
} ) => {

	const size = 30;

	return <View
			style={ {
				position: 'absolute',
				top: 0,
				left: 0,
				justifyContent: 'center',
				alignItems: 'center',
				width:  size,
				height: size,
				transform: [
					{ translateX: ( width/2 ) - ( size/2 ) },
					{ translateY: ( height/2 ) - ( size/2 ) },
				],
			} }
		>
			<Text style={ {
				color: 'red',
				fontSize: 20,
				fontWeight: 'bold',
			} }>X</Text>
	</View>;
};

export default Center;
