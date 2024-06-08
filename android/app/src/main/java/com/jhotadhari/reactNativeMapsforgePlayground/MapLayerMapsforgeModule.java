package com.jhotadhari.reactNativeMapsforgePlayground;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.mapsforge.map.android.util.AndroidUtil;
import org.mapsforge.map.android.view.MapView;
import org.mapsforge.map.datastore.MapDataStore;
import org.mapsforge.map.layer.cache.TileCache;
import org.mapsforge.map.layer.renderer.TileRendererLayer;
import org.mapsforge.map.reader.MapFile;
import org.mapsforge.map.rendertheme.ExternalRenderTheme;
import org.mapsforge.map.rendertheme.InternalRenderTheme;
import org.mapsforge.map.rendertheme.XmlRenderTheme;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;

public class MapLayerMapsforgeModule extends ReactContextBaseJavaModule {

    protected Map<Integer, TileRendererLayer> layers;

    MapLayerMapsforgeModule(ReactApplicationContext context) {
        super(context);
        layers = new HashMap<>();
    }

    @Override
    public String getName() {
        return "MapLayerMapsforgeModule";
    }

    protected XmlRenderTheme getRenderTheme( String renderThemePath ) {
        switch( renderThemePath ) {
            case "DEFAULT":
            case "OSMARENDER":
                return InternalRenderTheme.valueOf( renderThemePath );
            default:
                try {
                    return new ExternalRenderTheme( new File( renderThemePath ) );
                } catch ( FileNotFoundException e ) {
                    return InternalRenderTheme.DEFAULT;
                }
        }
    }

    @ReactMethod
    public void createLayer(int reactTag, String mapFileName, String renderThemePath, int reactTreeIndex, Promise promise ) {
        try {
            MapFragment mapFragment = Utils.getMapFragment( this.getReactApplicationContext(), reactTag );
            MapView mapView = (MapView) Utils.getMapView( this.getReactApplicationContext(), reactTag );


            if ( mapFragment == null || null == mapView ) {
                promise.resolve( false );
                return;
            }
            File mapfile = new File( mapFileName );
            if ( ! mapfile.exists() ) {
                promise.resolve( false );
                return;
            }

            TileCache tileCache = MapTileCacheController.getInstance( this.getReactApplicationContext() ).addCache(
                mapFileName,
                mapView
            );

            MapDataStore mmapfile = new MapFile( mapfile );

            TileRendererLayer tileRendererLayer = AndroidUtil.createTileRendererLayer(
                    tileCache,
                    mapView.getModel().mapViewPosition,
                    mmapfile,
                    getRenderTheme( renderThemePath ),
                    false,
                    true,
                    false
            );

            mapView.getLayerManager().getLayers().add(
                    Math.min( mapView.getLayerManager().getLayers().size(), (int) reactTreeIndex ),
                    tileRendererLayer
            );
            int hash = tileRendererLayer.hashCode();
            layers.put( hash, tileRendererLayer );
            promise.resolve(hash);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    @ReactMethod
    public void removeLayer(int reactTag, int hash, Promise promise) {
        try {
            MapView mapView = (MapView) Utils.getMapView( this.getReactApplicationContext(), reactTag );
            if ( null == mapView ) {
                promise.resolve( false );
                return;
            }
            mapView.getLayerManager().getLayers().remove( layers.get( hash ) );
            promise.resolve(hash);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

}