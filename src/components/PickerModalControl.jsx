/**
 * External dependencies
 */
import React, { useState } from 'react';
import {
	Button,
	FlatList,
	useWindowDimensions,
	View,
} from 'react-native';

/**
 * Internal dependencies
 */
import ModalWrapper from './ModalWrapper.jsx';
import useDirInfo from '../compose/useDirInfo';

const PickerModalControl = ( {
	disabled,
	buttonLabel,
	buttonLabelFallback,
	options,
	values,
	onChange,
	closeOnChange,
	headerLabel,
	itemHeight,
	hasSelectAll,
} ) => {
	values = values || [];

	const [modalVisible, setModalVisible] = useState( false );

	const { height, width } = useWindowDimensions();

	itemHeight = itemHeight || 45;

	const allSelected = [...options].map( opt => opt.value ).sort().join( '' ) == [...values].sort().join( '' );

	return <>
		<Button
			disabled={ disabled }
			key="button"
			onPress={ () => {
				setModalVisible( true );
			} }
			title={ buttonLabel || options.find( opt => values.includes( opt.value ) )?.label || buttonLabelFallback || '' }
		/>

		{ modalVisible && <ModalWrapper
			key="modal"
			setModalVisible={ setModalVisible }
			modalVisible={ modalVisible }
			headerLabel={ headerLabel }
			style={ { width: width * 0.8 } }
		>

			{ hasSelectAll && <View style={ {
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: 10,
			} }>
				<Button
					title={ allSelected ? 'Select none' : 'Select all' }
					onPress={ e => {
						e.stopPropagation();
						onChange( allSelected ? [] : [...options].map( opt => opt.value ) );
						if ( closeOnChange ) {
							setModalVisible( false );
						}
					} }
				/>
			</View> }

			{ options && <FlatList
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
						color={ values.includes( item.value ) ? '#841584' : '' }
						onPress={ e => {
							e.stopPropagation();
							onChange( item.value );
							if ( closeOnChange ) {
								setModalVisible( false );
							}
						} }
					/>
				</View> }
				keyExtractor={ item => item.value }
			/> }

		</ModalWrapper> }
	</>;

};

export default PickerModalControl;
