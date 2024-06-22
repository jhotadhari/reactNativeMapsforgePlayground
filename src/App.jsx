
/**
 * External dependencies
 */
import React, {
	useEffect,
	useState,
} from 'react';
import {
	Button,
	SafeAreaView,
	StatusBar,
	Text,
	useColorScheme,
	useWindowDimensions,
	PixelRatio,
	View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApplicationName } from 'react-native-device-info';

/**
 * react-native-mapsforge dependencies
 */
import {
	MapContainer,
	LayerMapsforge,
	Marker,
	Polyline,
	usePromiseQueueState,
	promiseQueue,
	useRenderStyleOptions,
	nativeMapModules,
} from 'react-native-mapsforge';

/**
 * Internal dependencies
 */
import DirPickerModalControl from './components/DirPickerModalControl.jsx';
import FilesFromDirPickerModalControl from './components/FilesFromDirPickerModalControl.jsx';
import PickerModalControl from './components/PickerModalControl.jsx';
import usePermissionsOk from './compose/usePermissionsOk.jsx';
import { randomNumber } from './utils';



const LiftViewIdStateUp = ( { mapViewNativeTag, setMainMapViewId } ) => {
	useEffect( () => {
		setMainMapViewId( mapViewNativeTag );
	}, [mapViewNativeTag] );
	return null;
};

const varNameToStoreKey = ( varName, appName ) => '@' + appName + '_' + varName;
const storeKeyToVarName = ( storeKey, appName ) => storeKey.replace( '@' + appName + '_', '' );

const App = () => {

	const isDarkMode = useColorScheme() === 'dark';

	const { width, height } = useWindowDimensions();

	const style = {
		backgroundColor: isDarkMode ? 'black' : '#eee',
		color: isDarkMode ? '#eee' : 'black',
	};

	const { permissionsOk, requestPermission } = usePermissionsOk();

	const promiseQueueState = usePromiseQueueState();

	const [mainMapViewId, setMainMapViewId] = useState( null );

	const [trackFiles, setTrackFiles] = useState( [] );





	// The options for the control component.
	const [renderOverlayOptions, setRenderOverlayOptions] = useState( [] );

	// Get appname on start.
	const [appName, setAppName] = useState( null );
	useEffect( () => {
		setAppName( getApplicationName() );
	}, [] );

	const [mapFilesDir, setMapFilesDir] = useState(  '/storage/emulated/0/Download' );
	const [styleFilesDir, setStyleFilesDir] = useState(  '/storage/emulated/0/Download' );
	const [tracksDir, setTracksDir] = useState( '/storage/emulated/0/Download' );
	const [mapFile, setMapFile] = useState( null );
	const [renderOverlays, setRenderOverlays] = useState( [] );
	const [renderTheme, setRenderTheme] = useState( null );

	// Get renderStyleDefaultId, renderStyleOptions from style sheet xml when Mapsforge parses the file.
	const {
		renderStyleDefaultId,
		renderStyleOptions,
	} = useRenderStyleOptions( ( {
		renderTheme,
		nativeTag: mainMapViewId,
	} ) );
	const [renderStyle, setRenderStyle] = useState( renderStyleDefaultId );

	// Update app state defaults, when Mapsforge parsed the style xml and tells us the possibilities.
	useEffect( () => {
		// If no renderStyle is set, but Mapsforge just parsed the style xml, and we got a renderStyleDefaultId. Update renderStyle.
		if ( ! renderStyle && renderStyleDefaultId ) {
			setRenderStyle( renderStyleDefaultId );
		}

		// Reset renderStyle to default. If theme changed and prev renderStyle is not an option anymore.
		if ( renderStyle ) {
			if ( ! [...renderStyleOptions].map( opt => opt.value ).includes( renderStyle ) ) {
				setRenderStyle( renderStyleDefaultId );
			}
		}

		// If no renderOverlayOptions is set, but Mapsforge just parsed the style xml, and we got the renderStyleOptions. Update renderOverlayOptions.
		if ( ! renderOverlayOptions.length ) {
			const renderStyleOptions_ = renderStyleOptions.find( opt => opt.value === renderStyle  );
			if ( undefined !== renderStyleOptions_ ) {
				const newItems = Object.keys( renderStyleOptions_.options ).map( value => {
					return {
						value,
						label: renderStyleOptions_.options[value],
					};
				} );
				setRenderOverlayOptions( newItems );
			}
		}
	}, [renderTheme,renderStyleOptions,renderStyle, renderStyleDefaultId] );

	// Mapping state varNames to their corresponding setter function.
	const stateFunctions = {
		mapFilesDir: setMapFilesDir,
		styleFilesDir: setStyleFilesDir,
		mapFile: setMapFile,
		renderOverlays: setRenderOverlays,
		renderTheme: setRenderTheme,
		renderStyle: setRenderStyle,
		tracksDir: setTracksDir,
	};

	// Handle update: Save to settings, then update app state.
	const handleUpdate = ( varName, valueRaw ) => {
		let value;
		switch( varName ) {
			case 'renderOverlays':
				value = JSON.stringify( valueRaw );
				break;
			default:
				value = valueRaw
		};
		AsyncStorage.setItem( varNameToStoreKey( varName, appName ), value ).then( () => {
			stateFunctions[varName]( valueRaw );
		} );
	};

	// Get settings from store and update app state.
	const updateStateFromStore = () => {
		try {
			AsyncStorage.multiGet( Object.keys( stateFunctions ).map( varName => varNameToStoreKey( varName, appName ) ) ).then( results => {
				[...results].map( result => {
					const varName = storeKeyToVarName( result[0], appName );
					let valid = true;
					let value;
					switch( varName ) {
						case 'renderOverlays':
							value = JSON.parse( result[1] );
							valid = Array.isArray( value );
							break;
						default:
							value = result[1]
					};
					if ( valid ) {
						stateFunctions[varName]( value );
					}
				} );
			} );
		} catch( err ) {
			console.log( 'debug err', err ); // debug
		}
	};

	// Update app store from settings on start.
	useEffect( () => {
		updateStateFromStore()
	}, [appName] );

	// Define just some random locations.
	const [locations, setLocations] = useState( Array.apply( null, Array( 10 ) ).map( () => [
		randomNumber( -0.25, 0 ),		// lat
		randomNumber( -78.6, -78.37 ),	// long
	] ) );

	return (
		<SafeAreaView style={ style }>
			<StatusBar
				barStyle={ isDarkMode ? 'light-content' : 'dark-content' }
				backgroundColor={ style.backgroundColor }
			/>

			{ ! permissionsOk && <View
				style={ {
					width,
					height,
					justifyContent: 'space-around',
					alignItems: 'center',
				} }
			>
				<View>

					<Text
						style={ { marginBottom: 10 } }
					>Need permission to access and manage all files</Text>

					<Button
						onPress={ () => {
							requestPermission().then( result => {
								console.log( 'debug result', result ); // debug
							} );
						} }
						title="open settings"
					/>
				</View>
			</View> }

			{ permissionsOk && <View>

				<MapContainer
					height={ height }
					center={ [-0.10, -78.48] }
					zoom={ 13 }
					// minZoom={ 12 }
					// maxZoom={ 18 }
				>

					<LiftViewIdStateUp setMainMapViewId={ setMainMapViewId } />

					<LayerMapsforge
						mapFile={ mapFile }
						renderTheme={ renderTheme }
						renderStyle={ renderStyle }
						renderOverlays={ renderOverlays }
						cachePersistence={ 1 }
					/>

					{ trackFiles && [...trackFiles].map( trackFile => {
						return <Polyline
							key={ trackFile }
							file={ trackFile }
							onTab={ res => {
								console.log( 'debug Polyline res', res ); // debug
							} }
						/>
					} ) }

					{/* { [...locations].map( ( latLong, index ) => <Marker
						latLong={ latLong }
						key={ index }
						tabDistanceThreshold={ 80 }
						onTab={ res => {
							console.log( 'debug Marker res', res ); // debug
						} }
					/> ) } */}

				</MapContainer>

			</View> }


			<View
				style={ {
					...style,
					position: 'absolute',
					top: 0,
					left: 0,
					width,
				} }
			>


				<View
					style={ {
						...style,
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						width,
						marginBottom: 10,
					} }
				>

					<Button
						onPress={ () => {
							AsyncStorage.multiRemove( Object.keys( stateFunctions ).map( varName => varNameToStoreKey( varName, appName ) ) ).then( () => {
								updateStateFromStore();
							} );
						} }
						title="Reset store"
					/>

					<DirPickerModalControl
						value={ mapFilesDir }
						buttonLabel={ 'Map dir' }
						headerLabel={ 'Map files dir' }
						// onSelect={ dir => setMapFilesDir( dir ) }
						onSelect={ value => handleUpdate( 'mapFilesDir', value ) }
						closeOnChange={ true }
						disabled={ promiseQueueState > 0 }

					/>

					<FilesFromDirPickerModalControl
						headerLabel={ 'Map file' }
						buttonLabelFallback={ 'Map file' }
						dir={ mapFilesDir }
						filePattern={ /.*\.map$/ }
						values={ [mapFile] }
						// onChange={ clickedVal => setMapFile( clickedVal ) }
						onChange={ value => handleUpdate( 'mapFile', value ) }
						closeOnChange={ true }
						disabled={ promiseQueueState > 0 }
					/>

				</View>

				<View
					style={ {
						...style,
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						width,
						marginBottom: 10,
					} }
				>

					<DirPickerModalControl
						value={ styleFilesDir }
						buttonLabel={ 'Style dir' }
						headerLabel={ 'Style files dir' }
						onSelect={ value => handleUpdate( 'styleFilesDir', value ) }
						closeOnChange={ true }
						disabled={ promiseQueueState > 0 }
					/>

					<FilesFromDirPickerModalControl
						headerLabel={ 'Style file' }
						buttonLabelFallback={ 'Style file' }
						dir={ styleFilesDir }
						filePattern={ /.*\.xml$/ }
						values={ [renderTheme] }
						onChange={ value => handleUpdate( 'renderTheme', value ) }
						closeOnChange={ true }
						disabled={ promiseQueueState > 0 }
					/>

					<PickerModalControl
						headerLabel={ 'Render style' }
						disabled={ promiseQueueState > 0 || ! renderStyleOptions.length }
						buttonLabelFallback={ 'Flavour' }
						options={ renderStyleOptions }
						values={ [renderStyle] }
						onChange={ value => handleUpdate( 'renderStyle', value ) }
						closeOnChange={ false }
					/>

					<PickerModalControl
						hasSelectAll={ true }
						buttonLabel={ 'options' }
						headerLabel={ 'Render style options' }
						disabled={ promiseQueueState > 0 || ! renderStyleOptions.length }
						buttonLabelFallback={ 'test' }
						options={ renderOverlayOptions }
						values={ renderOverlays || [] }
						onChange={ clickedVal => {
							if ( Array.isArray( clickedVal ) ) {
								handleUpdate( 'renderOverlays', clickedVal );
								return;
							}
							const existingIndex = renderOverlays.findIndex( val => val === clickedVal );
							if ( existingIndex === -1 ) {
								handleUpdate( 'renderOverlays', [
									...renderOverlays,
									clickedVal,
								] )
							} else {
								const newSelectedItems = [...renderOverlays];
								newSelectedItems.splice( existingIndex, 1 );
								handleUpdate( 'renderOverlays', newSelectedItems );
							}
						} }
						closeOnChange={ false }
					/>

				</View>

				<View
					style={ {
						...style,
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						width,
						marginBottom: 10,
					} }
				>

					<DirPickerModalControl
						value={ tracksDir }
						buttonLabel={ 'Tracks dir' }
						headerLabel={ 'Tracks dir' }
						onSelect={ value => handleUpdate( 'tracksDir', value ) }
						closeOnChange={ true }
						disabled={ promiseQueueState > 0 }
					/>

					<FilesFromDirPickerModalControl
						hasSelectAll={ true }
						sortReverse={ true }
						headerLabel={ 'Tracks' }
						buttonLabel={ 'Tracks' }
						dir={ tracksDir }
						filePattern={ /.*\.gpx$/ }
						values={ trackFiles }
						onChange={ value => {


							console.log( 'debug value', value ); // debug
							if ( Array.isArray( value ) ) {
								setTrackFiles( value )
								return;
							}

							const existingIndex = trackFiles.findIndex( val => val === value );
							if ( existingIndex === -1 ) {
								setTrackFiles( [
									...trackFiles,
									value,
								] )
							} else {
								const newSelectedItems = [...trackFiles];
								newSelectedItems.splice( existingIndex, 1 );
								setTrackFiles( newSelectedItems );
							}


						} }
						// closeOnChange={ true }
						disabled={ promiseQueueState > 0 }
					/>

				</View>
			</View>

			<View
				style={ {
					...style,
					position: 'absolute',
					bottom: 0,
					right: 0,
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
					<Text>{ promiseQueueState > 0 ? 'busy' : 'idle'  }</Text>
				</View>
			</View>


		</SafeAreaView>
	);
};

export default App;
