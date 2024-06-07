package com.jhotadhari.reactNativeMapsforgePlayground;

import android.view.MotionEvent;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.mapsforge.core.model.LatLong;
import org.mapsforge.map.android.view.MapView;
import org.mapsforge.map.view.InputListener;

import java.util.ArrayList;

public class MapInputListener implements InputListener {

    protected ReactContext reactContext;

    protected MapView mapView;

    protected int nativeTag;

    MapInputListener( ReactContext reactContext_, int nativeTag_, MapView mapView_ ) {
        reactContext = reactContext_;
        nativeTag = nativeTag_;
        mapView = mapView_;
    }

    protected void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter.class
        ).emit( eventName, params );
    }

    /**
     * A manual movement has been started. The user drags the map over the screen.
     * This method is called before any movement takes place.
     * There is no guarantee that this method is called just once per user intervention.
     */
    @Override
    public void onMoveEvent() {
        WritableMap params = new WritableNativeMap();
        params.putInt( "nativeTag", nativeTag );
        LatLong latLong = mapView.getModel().mapViewPosition.getMapPosition().latLong;
        WritableArray latLongA = new WritableNativeArray();
        latLongA.pushDouble( latLong.latitude );
        latLongA.pushDouble( latLong.longitude );
        params.putArray( "center",  latLongA );
        sendEvent( reactContext, "MapMove", params );
    };

    /**
     * A manual zoom has been started. The user uses pinch-to-zoom, uses its mouse wheel
     * or the ZoomControls. This method is called before any zoom takes place.
     * There is no guarantee that this method is called just once per user intervention.
     */
    @Override
    public void onZoomEvent() {
        WritableMap params = new WritableNativeMap();
        params.putInt( "nativeTag", nativeTag );
        params.putInt( "zoom",  mapView.getModel().mapViewPosition.getZoomLevel() );
        sendEvent( reactContext, "MapZoom", params );
    };

}
