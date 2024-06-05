package com.testbla;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import java.lang.Math;
import android.graphics.BitmapFactory;
import androidx.fragment.app.FragmentActivity;
import org.mapsforge.core.graphics.Bitmap;
import org.mapsforge.core.model.LatLong;
import org.mapsforge.map.android.graphics.AndroidBitmap;
import org.mapsforge.map.android.view.MapView;
import org.mapsforge.map.layer.overlay.Marker;

public class MapMarkerModule extends ReactContextBaseJavaModule {

    MapMarkerModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "MapMarkerModule";
    }

    @ReactMethod
    public void createMarker(int reactTag, ReadableArray latLong, Promise promise) {
        try {

            Bitmap bitmap = new AndroidBitmap(
                BitmapFactory.decodeResource(
                    this.getReactApplicationContext().getResources(),
                    R.drawable.ic_maps_indicator_current_position
                )
            );

            FragmentActivity activity = (FragmentActivity) this.getReactApplicationContext().getCurrentActivity();
            MapFragment mapFragment = (MapFragment) activity.getSupportFragmentManager().findFragmentById( (int) reactTag );
            MapView mapView = (MapView) mapFragment.getMapView();

            mapView.getLayerManager().getLayers().add(
                new Marker(
                    new LatLong(
                        (Double) latLong.toArrayList().get(0),
                        (Double) latLong.toArrayList().get(1)
                    ),
                    bitmap,
                    0,
                    - bitmap.getHeight() / 2
                )
            );

            double rand = Math.random();
            promise.resolve(rand);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

}