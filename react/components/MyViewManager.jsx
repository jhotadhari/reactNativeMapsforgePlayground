import {
	requireNativeComponent,
	ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

export const MyViewManager = requireNativeComponent(
	'MyViewManager',
	{
		name: 'MyViewManager',
		propTypes: {
			width: PropTypes.number,
			height: PropTypes.number,
			markers: PropTypes.array,
			...ViewPropTypes,
		},
	}
);
