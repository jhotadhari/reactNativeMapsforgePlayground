import {
	requireNativeComponent,
	ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

export const MapViewManager = requireNativeComponent(
	'MapViewManager',
	{
		name: 'MapViewManager',
		propTypes: {
			width: PropTypes.number,
			height: PropTypes.number,
			center: PropTypes.array,	// ??? should better validate
			zoom: PropTypes.number,
			minZoom: PropTypes.number,
			maxZoom: PropTypes.number,
			...ViewPropTypes,
		},
	}
);
