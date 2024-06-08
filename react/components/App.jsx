/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {
	useContext, useEffect, useState,
} from 'react';
import {
	Button,
	SafeAreaView,
	StatusBar,
	Text,
	useColorScheme,
	NativeModules,
	StyleSheet,
	useWindowDimensions,
	PixelRatio,
	View,
	Alert,
	Modal,
	Pressable,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';


import '../../global.css';

import {
	MapContainer,
	LayerMapsforge,
	Marker,
} from './mapComponents';
import { MapContext } from '../MapContext';
const { MapContainerModule } = NativeModules;


// const Section = ( {
// 	children,
// 	title,
// } ) => {
// 	return (
// 		<View className="mt-8 px-2">
// 			<Text className="text-2xl text-black dark:text-white">
// 				{title}
// 			</Text>

// 			<View>
// 				{children}
// 			</View>
// 		</View>
// 	);
// };


const LiftViewIdStateUp = ( { setMainMapViewId } ) => {
	const { mapViewNativeTag } = useContext( MapContext );
	useEffect( () => {
		setMainMapViewId( mapViewNativeTag );
	}, [mapViewNativeTag] );
	return null;
};

const renderThemeOptions = [
	{ label: 'DEFAULT', value: 'DEFAULT' },
	{ label: 'OSMARENDER', value: 'OSMARENDER' },
	{ label: 'Alti', value: '/storage/emulated/0/Documents/orux/mapstyles/Alti.xml' },
	{ label: 'Elements', value: '/storage/emulated/0/Documents/orux/mapstyles/Elements.xml' },
];

const mapFileOptions = [
	{ label: 'Ecuador', value: '/storage/emulated/0/Documents/orux/mapfiles/Ecuador_oam.osm.map' },
	{ label: 'Colombia', value: '/storage/emulated/0/Documents/orux/mapfiles/Colombia_oam.osm.map' },


];


const App = () => {
	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = 'bg-neutral-300 dark:bg-slate-900';

	const [
		renderTheme, setRenderTheme,
	] = useState( renderThemeOptions[0].value );
	const [
		mapFile, setMapFile,
	] = useState( mapFileOptions[0].value );
	const [
		showLayerMapsforge, setShowLayerMapsforge,
	] = useState( true );
	const [
		showMarkers, setShowMarkers,
	] = useState( true );

	const [
		mainMapViewId, setMainMapViewId,
	] = useState( null );

	const [
		iconIndex, setIconIndex,
	] = useState( 0 );

	const [
		modalVisible, setModalVisible,
	] = useState( false );


	// useEffect( () => {
	// 	request( 'android.permission.MANAGE_EXTERNAL_STORAGE' ).then( ( result ) => {
	// 		console.log( 'debug result', result ); // debug
	// 	  } );
	// }, [] );


	const [
		locations, setLocations,
	] = useState( [
		[
			-0.20, -78.2,
		],
		[
			-0.22, -78.4,
		],
		[
			-0.24, -78.6,
		],
	] );

	const icons = [
		// '/storage/emulated/0/Android/media/com.jhotadhari.reactNativeMapsforgePlayground/marker_red.png',
		// '/storage/emulated/0/Android/media/com.jhotadhari.reactNativeMapsforgePlayground/marker_white.png',

		{
			// width: PixelRatio.getPixelSizeForLayoutSize( 70 ),
			// height: PixelRatio.getPixelSizeForLayoutSize( 70 ),
		},

		{
			path: '/storage/emulated/0/Android/media/com.jhotadhari.reactNativeMapsforgePlayground/marker_green.png',
			width: PixelRatio.getPixelSizeForLayoutSize( 40 ),
			height: PixelRatio.getPixelSizeForLayoutSize( 60 ),
			anchor: [
				0,
				- PixelRatio.getPixelSizeForLayoutSize( 60 ) / 2,
			],
		},


	];

	const { height } = useWindowDimensions();

	return (
		<SafeAreaView className={ backgroundStyle }>
			<StatusBar
				barStyle={ isDarkMode ? 'light-content' : 'dark-content' }
				backgroundColor={ backgroundStyle.backgroundColor }
			/>


			<Modal
				animationType="slide"
				transparent={ true }
				visible={ modalVisible }
				onRequestClose={ () => {
					Alert.alert( 'Modal has been closed.' );
					setModalVisible( !modalVisible );
				} }
			>
				<View style={ styles.centeredView }>
					<View style={ styles.modalView }>
						<Text style={ styles.modalText }>Hello World!</Text>
						<Pressable
							style={ [
								styles.button, styles.buttonClose,
							] }
							onPress={ () => setModalVisible( !modalVisible ) }
						>
							<Text style={ styles.textStyle }>Hide Modal</Text>
						</Pressable>
					</View>
				</View>
			</Modal>


			{ ! modalVisible && <View className="bg-white dark:bg-black">

				{/* <View style={ {
						width: PixelRatio.getPixelSizeForLayoutSize( width ),
						height: PixelRatio.getPixelSizeForLayoutSize( 100 ),
						backgroundColor: '#00ff00',
					} } /> */}


				<MapContainer
					height={ height }
					center={ [
						0, -78.2,
					] }
					zoom={ 7 }
					// minZoom={ 12 }
					// maxZoom={ 18 }
				>

					<LiftViewIdStateUp setMainMapViewId={ setMainMapViewId } />

					{ showLayerMapsforge && <LayerMapsforge
						// mapFile={ '/storage/emulated/0/Android/media/com.jhotadhari.reactNativeMapsforgePlayground/Berlin.map' }
						mapFile={ mapFile }
						renderTheme={ renderTheme }
					/> }

					{ showMarkers && <>
						{ [...locations].map( ( latLong, index ) => <Marker
							latLong={ latLong }
							key={ index }
							icon={ icons[iconIndex] }
						/> ) }
					</> }
				</MapContainer>

				{ Object.keys( Array.from( Array( 5 ) ) ).map( ( v, index ) => {
					return <Text key={ index } className="mt-2 text-lg text-black dark:text-white">
						{ 'test' + index }
					</Text>;
				} ) }


			</View> }

			<View className="bg-white dark:bg-black absolute top left flex flex-column w-full">
				<View className="flex flex-row justify-around w-full">
					<Button
						onPress={ () => {
							setShowMarkers( ! showMarkers );
						} }
						title="Toggle Markers"
					/>
					<Button
						onPress={ () => {
							const newLocations = [...locations].map( coords => [...coords].map( coord => Math.random() > 0.5 ? coord + 0.01 : coord - 0.01 ) );
							setLocations( newLocations );
						} }
						title="random locations"
					/>
					<Button
						onPress={ () => setIconIndex( iconIndex + 1 === icons.length ? 0 : iconIndex + 1 ) }
						title="Change icons"
					/>
				</View>

				<View className="flex flex-row justify-around w-full mt-5">
					<Button
						onPress={ () => {
							setShowLayerMapsforge( ! showLayerMapsforge );
						} }
						title="Toggle Mapsforge"
					/>
					<Button
						onPress={ () => {
							MapContainerModule.zoomIn( mainMapViewId );
						} }
						title="+"
					/>
					<Button
						onPress={ () => {
							MapContainerModule.zoomOut( mainMapViewId );
						} }
						title="-"
					/>
				</View>

				<View className="flex flex-row justify-around w-full mt-5" style={ {
					height: 60,
				} }>


					<Picker
						selectedValue={ mapFile }
						style={ {
							// height: 30,
							width: 250,
						} }
						mode={ 'dialog' }
						onValueChange={ value => setMapFile( value ) }
					>
						{ [...mapFileOptions].map( opt => {
							return <Picker.Item key={ opt.value } label={ opt.label } value={ opt.value } />
						} ) }
					</Picker>

					<Picker
						selectedValue={ renderTheme }
						style={ {
							// height: 30,
							width: 250,
						} }
						mode={ 'dialog' }
						onValueChange={ value => setRenderTheme( value ) }
					>
						{ [...renderThemeOptions].map( opt => {
							return <Picker.Item key={ opt.value } label={ opt.label } value={ opt.value } />
						} ) }
					</Picker>

				</View>

			</View>
		</SafeAreaView>
	);
};



const styles = StyleSheet.create( {
	centeredView: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	  marginTop: 22,
	},
	modalView: {
	  margin: 20,
	  backgroundColor: 'white',
	  borderRadius: 20,
	  padding: 35,
	  alignItems: 'center',
	  shadowColor: '#000',
	  shadowOffset: {
			width: 0,
			height: 2,
	  },
	  shadowOpacity: 0.25,
	  shadowRadius: 4,
	  elevation: 5,
	},
	button: {
	  borderRadius: 20,
	  padding: 10,
	  elevation: 2,
	},
	buttonOpen: { backgroundColor: '#F194FF' },
	buttonClose: { backgroundColor: '#2196F3' },
	textStyle: {
	  color: 'white',
	  fontWeight: 'bold',
	  textAlign: 'center',
	},
	modalText: {
	  marginBottom: 15,
	  textAlign: 'center',
	},
} );

export default App;

