/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { sortBy } from 'lodash-es';

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

    const [options,setOptions] = useState( [] );

    useEffect( () => {
        const newOptions = Array.isArray( navChildren )
            ? sortBy( [...navChildren].filter( file => filePattern ? filePattern.test( file.name ) : true ), 'name' ).map( file => {
                return { value: file.name, label: file.name.split( '/' ).reverse()[0] };
            } )
            : [];
        setOptions( newOptions );
    }, [navChildren] );

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
