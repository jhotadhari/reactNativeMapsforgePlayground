import React, {
	useEffect, useRef,
} from 'react';
import {
	PixelRatio,
	UIManager,
	findNodeHandle,
	useWindowDimensions,
} from 'react-native';

import { MyViewManager } from './MyViewManager.jsx';



const createFragment = viewId =>
	UIManager.dispatchViewManagerCommand(
		viewId,
		// we are calling the 'create' command
		UIManager.MyViewManager.Commands.create.toString(),
		[viewId],
	);

export const MyView = () => {
	const ref = useRef( null );


	const {
		// height,
		width,
	} = useWindowDimensions();

	useEffect( () => {
		const viewId = findNodeHandle( ref.current );
		createFragment( viewId );
	}, [] );

	return (
		<MyViewManager
			style={ {
				// converts dpi to px, provide desired height
				height: PixelRatio.getPixelSizeForLayoutSize( 650 ),	// ???
				// converts dpi to px, provide desired width
				width: PixelRatio.getPixelSizeForLayoutSize( width ),
			} }
			ref={ ref }
		/>
	);
};