package com.jhotadhari.reactNativeMapsforgePlayground;

import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ReactContext;

import org.mapsforge.map.android.view.MapView;

public class Utils {

    public static MapView getMapView(ReactContext reactContext, int reactTag ) {
        try {
            FragmentActivity activity = (FragmentActivity) reactContext.getCurrentActivity();
            if ( null == activity ) {
                return null;
            }
            MapFragment mapFragment = (MapFragment) activity.getSupportFragmentManager().findFragmentById( (int) reactTag );
            if ( null == mapFragment ) {
                return null;
            }
            MapView mapView = (MapView) mapFragment.getMapView();
            return mapView;
        } catch(Exception e) {
            return null;
        }
    }


}
