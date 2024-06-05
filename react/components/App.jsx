/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
	Button,
	SafeAreaView,
	StatusBar,
	Text,
	useColorScheme,
	View,
} from 'react-native';

import '../../global.css';

import {
	MapContainer,
	Marker,
} from './mapComponents';

const Section = ( {
	children,
	title,
} ) => {
	return (
		<View className="mt-8 px-2">
			<Text className="text-2xl text-black dark:text-white">
				{title}
			</Text>

			<View>
				{children}
			</View>
		</View>
	);
};

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = 'bg-neutral-300 dark:bg-slate-900';

	const [showMarkers,setShowMarkers] = useState( true );

	return (
		<SafeAreaView className={ backgroundStyle }>
			<StatusBar
				barStyle={ isDarkMode ? 'light-content' : 'dark-content' }
				backgroundColor={ backgroundStyle.backgroundColor }
			/>
			<View className="bg-white dark:bg-black">

				<View className="bg-white dark:bg-black">
					<Section title="Native Component">


					<Button
						onPress={ () => {
							setShowMarkers( ! showMarkers );
						} }
						title="Toggle Markers"
						color="#841584"
						// accessibilityLabel="Learn more about this purple button"
					/>

						<MapContainer>
							{ showMarkers && <Marker
								latLong={ [52.5, 13.4] }
							/> }
						</MapContainer>


						<MapContainer>
							{ showMarkers && <Marker
								latLong={ [52.51, 13.42] }
							/> }
						</MapContainer>

						{ Object.keys( Array.from( Array( 5 ) ) ).map( ( v, index ) => {
							return <Text key={ index } className="mt-2 text-lg text-black dark:text-white">
								{ 'test' + index }
							</Text>
						} ) }

					</Section>

				</View>
			</View>
		</SafeAreaView>
	);
};

export default App;

