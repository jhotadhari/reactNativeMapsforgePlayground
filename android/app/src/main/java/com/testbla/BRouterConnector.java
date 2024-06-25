package com.testbla;

import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;

import btools.routingapp.BRouterServiceConnection;
import btools.routingapp.IBRouterService;

public class BRouterConnector {

    protected ReactContext reactContext;

    private static BRouterConnector single_instance = null;

    public static synchronized BRouterConnector getInstance( ReactContext reactContext_ ) {
        if ( single_instance == null ) {
            single_instance = new BRouterConnector( reactContext_ );
        }
        return single_instance;
    }

    protected BRouterServiceConnection bRouterServiceConnection;

    private BRouterConnector(ReactContext reactContext_ ) {
        reactContext = reactContext_;
        reconnectToBRouter();
    }

    @Nullable
    public synchronized IBRouterService reconnectToBRouter() {
        try {
            bRouterServiceConnection = BRouterServiceConnection.connect(reactContext.getCurrentActivity());
            // a delay is necessary as the service process needs time to start..
            Thread.sleep(800);
            if (bRouterServiceConnection != null) {
                return bRouterServiceConnection.getBrouterService();
            }
        } catch (Exception e) {
            Log.d("ERROR", e.toString() );
        }
        return null;
    }

    @Nullable
    public synchronized IBRouterService getBRouterService() {
        if (bRouterServiceConnection == null) {
            return null;
        }
        IBRouterService service = bRouterServiceConnection.getBrouterService();
        if (service != null && !service.asBinder().isBinderAlive()) {
            service = reconnectToBRouter();
        }
        return service;
    }








//
//
//
//    protected Map<String, TileCache> tileCaches;
//
//    private BRouterConnector(ReactContext reactContext_ ) {
//        this.tileCaches = new HashMap<>();
//        reactContext = reactContext_;
//    }
//
//    public TileCache addCache(String persistableId, MapView mapView, boolean persistent ) {
//        TileCache tileCache = AndroidUtil.createTileCache(
//            reactContext.getCurrentActivity(),
//            persistableId,
//            mapView.getModel().displayModel.getTileSize(),
//            this.getScreenRatio(),
//            mapView.getModel().frameBufferModel.getOverdrawFactor(),
//			persistent
//        );
//        this.tileCaches.put( persistableId, tileCache );
//        return tileCache;
//    }
//
//    public Boolean removeCache( String persistableId, Boolean forcePurge ) {
//		if ( this.tileCaches.containsKey( persistableId ) ) {
//			TileCache cache = this.tileCaches.get( persistableId );
//			if ( forcePurge ) {
//				cache.purge();
//			} else {
//				cache.destroy();
//			}
//			this.tileCaches.remove( persistableId );
//			return true;
//		} else {
//			return false;
//		}
//    }
//
//    public TileCache getCache( String persistableId ) {
//        return this.tileCaches.get( persistableId );
//    }
//
//    /**
//     * Returns the relative size of a map view in relation to the screen size of the device. This
//     * is used for cache size calculations.
//     * By default this returns 1.0, for a full size map view.
//     *
//     * TODO ??? maybe need to pass width and height here somehow
//     *
//     * @return the screen ratio of the mapview
//     */
//    protected float getScreenRatio() {
//        return 1.0f;
//    }

}
