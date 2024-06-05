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
			markers: PropTypes.array,
			...ViewPropTypes,
		},
	}
);
