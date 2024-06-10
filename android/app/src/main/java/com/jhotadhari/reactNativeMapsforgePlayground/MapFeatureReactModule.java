package com.jhotadhari.reactNativeMapsforgePlayground;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import org.mapsforge.core.model.LatLong;
import org.mapsforge.core.model.Point;
import org.mapsforge.map.android.view.MapView;
import org.mapsforge.map.model.common.Observer;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class MapFeatureReactModule extends ReactContextBaseJavaModule {

    class Feature {
        protected int nativeTag;
        protected LatLong latLong;
        protected String uid;
        protected Observer observer = null;
        Feature( int nativeTag_, LatLong latLong_ ) {
            nativeTag = nativeTag_;
            latLong = latLong_;
            uid =  UUID.randomUUID().toString();
            addObserver();
        }
        protected void sendMapMoveFeature() {
            WritableMap params = new WritableNativeMap();
            params.putInt( "nativeTag", nativeTag );
            params.putString( "uid", uid );
            Point xy = Utils.getMapView( reactContext, nativeTag ).getMapViewProjection().toPixels( latLong );
            WritableMap pointMap = new WritableNativeMap();
            pointMap.putDouble( "y", Utils.convertPixelsToDp( reactContext, (double) xy.y ) );
            pointMap.putDouble( "x", Utils.convertPixelsToDp( reactContext, (double) xy.x ) );
            params.putMap( "xy",  pointMap );
            Utils.sendEvent( reactContext, "MapMoveFeature", params );
        }
        public void addObserver() {
            observer = new Observer() {
                @Override
                public void onChange() {
                    sendMapMoveFeature();
                }
            };
            Utils.getMapView( reactContext, nativeTag ).getModel().frameBufferModel.addObserver( observer );
        }
        public void removeObserver() {
            if ( null != observer ) {
                Utils.getMapView( reactContext, nativeTag ).getModel().frameBufferModel.removeObserver( observer );
            }
        }
        public void setLatLong( LatLong latLong_ ) {
            latLong = latLong_;
        }
        public String getUid() {
            return uid;
        }
    }

    protected Map<String, Feature> features;

    protected ReactApplicationContext reactContext;

    MapFeatureReactModule(ReactApplicationContext reactContext_ ) {
        super(reactContext_);
        reactContext = reactContext_;
        features = new HashMap<>();
    }

    @Override
    public String getName() {
        return "MapFeatureReactModule";
    }

    @ReactMethod
    public void createFeature(int reactTag, ReadableArray latLong, Promise promise ) {
        try {
            MapView mapView = (MapView) Utils.getMapView( this.getReactApplicationContext(), reactTag );
            if ( null == mapView ) {
                promise.resolve( false );
                return;
            }
            Feature feature = new Feature(
                reactTag,
                new LatLong(
                    (Double) latLong.toArrayList().get(0),
                    (Double) latLong.toArrayList().get(1)
                )
            );
            String uid = feature.getUid();
            features.put( uid, feature );
            promise.resolve( uid ) ;
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    @ReactMethod
    public void setLocation( int reactTag, String uid, ReadableArray latLong, Promise promise ) {
        try {
            if ( features.containsKey( uid ) ) {
                Feature feature = features.get( uid );
                feature.setLatLong( Utils.arrayToLatLong(latLong));
                feature.sendMapMoveFeature();
                promise.resolve( uid );
            } else {
                promise.resolve( false );
            }
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    @ReactMethod
    public void removeFeature(int reactTag, String uid, Promise promise) {
        try {
            if ( features.containsKey( uid ) ) {
                features.get( uid ).removeObserver();
                features.remove( uid );
                promise.resolve( uid );
            } else {
                promise.resolve( false );
            }
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

}