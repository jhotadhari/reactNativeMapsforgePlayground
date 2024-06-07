package com.jhotadhari.reactNativeMapsforgePlayground;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.mapsforge.map.android.view.MapView;

public class MapContainerModule extends ReactContextBaseJavaModule {

    MapContainerModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "MapContainerModule";
    }

    @ReactMethod
    public void getLayersCreated(int reactTag, Promise promise ) {
        try {
            MapView mapView = (MapView) Utils.getMapView( this.getReactApplicationContext(), reactTag );
            if ( null == mapView ) {
                promise.resolve( false );
                return;
            }
            promise.resolve( true );
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }
    @ReactMethod
    public void setZoom(int reactTag, int zoom, Promise promise ) {
        try {
            MapView mapView = (MapView) Utils.getMapView( this.getReactApplicationContext(), reactTag );
            if ( null == mapView ) {
                promise.resolve( false );
                return;
            }
            mapView.setZoomLevel( (byte) zoom );
            promise.resolve(true);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    @ReactMethod
    public void zoomIn(int reactTag, Promise promise ) {
        try {
            MapView mapView = (MapView) Utils.getMapView( this.getReactApplicationContext(), reactTag );
            if ( null == mapView ) {
                promise.resolve( false );
                return;
            }
            mapView.setZoomLevel( (byte) ( mapView.getModel().mapViewPosition.getZoomLevel() + 1 ) );
            promise.resolve(true);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }
    @ReactMethod
    public void zoomOut(int reactTag, Promise promise ) {
        try {
            MapView mapView = (MapView) Utils.getMapView( this.getReactApplicationContext(), reactTag );
            if ( null == mapView ) {
                promise.resolve( false );
                return;
            }
            mapView.setZoomLevel( (byte) ( mapView.getModel().mapViewPosition.getZoomLevel() - 1 ) );
            promise.resolve(true);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

}