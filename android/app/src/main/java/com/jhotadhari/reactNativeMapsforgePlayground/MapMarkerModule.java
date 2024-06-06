package com.jhotadhari.reactNativeMapsforgePlayground;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import java.util.HashMap;
import java.util.Map;

import android.graphics.BitmapFactory;
import android.util.Log;
import android.widget.FrameLayout;

import androidx.fragment.app.FragmentActivity;
import org.mapsforge.core.graphics.Bitmap;
import org.mapsforge.core.model.LatLong;
import org.mapsforge.map.android.graphics.AndroidBitmap;
import org.mapsforge.map.android.view.MapView;
import org.mapsforge.map.layer.overlay.Marker;

public class MapMarkerModule extends ReactContextBaseJavaModule {

    protected Map<Integer, Marker> markers;

    MapMarkerModule(ReactApplicationContext context) {
        super(context);
        markers = new HashMap<>();
    }

    @Override
    public String getName() {
        return "MapMarkerModule";
    }

    protected MapView getMapView( int reactTag ) {
        FragmentActivity activity = (FragmentActivity) this.getReactApplicationContext().getCurrentActivity();
        MapFragment mapFragment = (MapFragment) activity.getSupportFragmentManager().findFragmentById( (int) reactTag );
        MapView mapView = (MapView) mapFragment.getMapView();
        return mapView;
    }

    @ReactMethod
    public void createMarker( int reactTag, ReadableArray latLong, Promise promise ) {
        try {

            Bitmap bitmap = new AndroidBitmap(
                BitmapFactory.decodeResource(
                    this.getReactApplicationContext().getResources(),
                    R.drawable.ic_maps_indicator_current_position
                )
            );

            MapView mapView = (MapView) getMapView( reactTag );

            Marker marker = new Marker(
                new LatLong(
                    (Double) latLong.toArrayList().get(0),
                    (Double) latLong.toArrayList().get(1)
                ),
                bitmap,
                0,
                - bitmap.getHeight() / 2
            );
            mapView.getLayerManager().getLayers().add( marker );
            int hash = marker.hashCode();
            markers.put( hash, marker );
            promise.resolve(hash);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }
    @ReactMethod
    public void removeMarker(int reactTag, int hash, Promise promise) {
        try {
            MapView mapView = (MapView) getMapView( reactTag );
            mapView.getLayerManager().getLayers().remove( markers.get( hash ) );
            promise.resolve(true);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

}