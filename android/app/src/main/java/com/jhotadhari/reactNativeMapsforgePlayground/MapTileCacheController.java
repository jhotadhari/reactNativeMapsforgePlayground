package com.jhotadhari.reactNativeMapsforgePlayground;

import com.facebook.react.bridge.ReactContext;

import org.mapsforge.map.android.util.AndroidUtil;
import org.mapsforge.map.android.view.MapView;
import org.mapsforge.map.layer.cache.TileCache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapTileCacheController {

    protected ReactContext reactContext;

    private static MapTileCacheController single_instance = null;

    public static synchronized MapTileCacheController getInstance( ReactContext reactContext_ ) {
        if ( single_instance == null ) {
            single_instance = new MapTileCacheController( reactContext_ );
        }
        return single_instance;
    }

    protected Map<String, TileCache> tileCaches;

    private MapTileCacheController( ReactContext reactContext_ ) {
        this.tileCaches = new HashMap<>();
        reactContext = reactContext_;
    }

    public TileCache addCache(String persistableId, MapView mapView ) {
        TileCache tileCache = AndroidUtil.createTileCache(
            reactContext.getCurrentActivity(),
            persistableId,
            mapView.getModel().displayModel.getTileSize(),
            this.getScreenRatio(),
            mapView.getModel().frameBufferModel.getOverdrawFactor()
        );
        this.tileCaches.put( persistableId, tileCache );
        return tileCache;
    }

    public TileCache getCache( String persistableId ) {
        return this.tileCaches.get( persistableId );
    }

    /**
     * Returns the relative size of a map view in relation to the screen size of the device. This
     * is used for cache size calculations.
     * By default this returns 1.0, for a full size map view.
     *
     * TODO ??? maybe need to pass width and height here somehow
     *
     * @return the screen ratio of the mapview
     */
    protected float getScreenRatio() {
        return 1.0f;
    }

}
