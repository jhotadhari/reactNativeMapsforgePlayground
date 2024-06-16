/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';
import {
	Button,
	FlatList,
	NativeModules,
	NativeEventEmitter,
	useWindowDimensions,
	View,
	Text,
} from 'react-native';

/**
 * Internal dependencies
 */
import ModalWrapper from './ModalWrapper.jsx';

import { LINKING_ERROR } from '../constants';
import useDirInfo from '../compose/useDirInfo';

const FsModule = NativeModules.FsModule
	? NativeModules.FsModule
	: new Proxy(
		{},
		{
			get() {
				throw new Error( LINKING_ERROR );
			},
		},
	);





const DirPickerModalControl = ( {
	disabled,
	buttonLabel,
	buttonLabelFallback,
	// options,
	// values,
	value,
	onSelect,
	closeOnChange,
	headerLabel,
	itemHeight,
} ) => {

	const [modalVisible, setModalVisible] = useState( false );
	const [navDir, setNavDir] = useState( value || '/storage/emulated/0/Download' );


	const { navParent, navChildren } = useDirInfo( navDir );


	console.log( 'debug navParent, navChildren', navParent, navChildren ); // debug

	const { height, width } = useWindowDimensions();

	itemHeight = itemHeight || 45;

	const options = Array.isArray( navChildren ) ? [...navChildren].filter( file => file.isDir ).map( file => {

		return { value: file.name, label: file.name.split( '/' ).reverse()[0] };

	} ) : [];

	return <>
		<Button
			disabled={ disabled }
			key="button"
			onPress={ () => {
				setModalVisible( true );
			} }
			title={ buttonLabel || buttonLabelFallback || '' }
		/>

		{ modalVisible && <ModalWrapper
			key="modal"
			setModalVisible={ setModalVisible }
			modalVisible={ modalVisible }
			headerLabel={ headerLabel }
			style={ { width: width * ( 2 / 3 ) } }
		>

			<Text style={ { marginBottom: 10} } >
				{ navDir }
			</Text>

			<View style={ {
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: 10,
			} }>
				<Button
					navParent={ ! navParent }
					title={ '..' }
					onPress={ e => {
						e.stopPropagation();
						if ( navParent ) {
							setNavDir( navParent );
						}
					} }
				/>

				<Button
					title={ 'use' }
					onPress={ e => {
						e.stopPropagation();
						onSelect( navDir );
						if ( closeOnChange ) {
							setModalVisible( false );
						}
					} }
				/>


			</View>


			<FlatList
				data={ options }
				style={ { maxHeight: Math.min( height * 0.6, itemHeight * options.length ) } }
				getItemLayout={ ( data, index ) => ( {
					length: itemHeight,
					offset: itemHeight * index,
					index,
				} ) }
				renderItem={ ( { item } ) => <View
					style={ { height: itemHeight } }
				>
					<Button
						disabled={ disabled || item.disabled }
						title={ item.label }
						style={ {
							textWrap: 'nowrap',
						} }
						// color={ values.includes( item.value ) ? '#841584' : '' }
						onPress={ e => {
							e.stopPropagation();
							setNavDir( item.value );
						} }
					/>
				</View> }
				keyExtractor={ item => item.value }
			/>

		</ModalWrapper> }
	</>;

};

export default DirPickerModalControl;
