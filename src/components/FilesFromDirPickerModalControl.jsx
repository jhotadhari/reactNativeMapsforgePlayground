/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import PickerModalControl from './PickerModalControl.jsx';
import useDirInfo from '../compose/useDirInfo';

const FilesFromDirPickerModalControl = ( {
    dir,
    filePattern,
    disabled,
	buttonLabel,
	buttonLabelFallback,
	values,
	onChange,
	closeOnChange,
	headerLabel,
	itemHeight,
} ) => {

	const { navChildren } = useDirInfo( dir || null );

	const options = Array.isArray( navChildren )
        ? [...navChildren].filter( file => filePattern ? filePattern.test( file.name ) : true ).map( file => {
            return { value: file.name, label: file.name.split( '/' ).reverse()[0] };
        } )
        : [];

	return <PickerModalControl
        options={ options }
        disabled={ disabled }
        buttonLabel={ buttonLabel }
        buttonLabelFallback={ buttonLabelFallback }
        values={ values }
        onChange={ onChange }
        closeOnChange={ closeOnChange }
        headerLabel={ headerLabel }
        itemHeight={ itemHeight }
    />;

};

export default FilesFromDirPickerModalControl;
