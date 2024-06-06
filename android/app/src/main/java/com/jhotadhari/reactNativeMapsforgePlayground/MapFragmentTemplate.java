package com.jhotadhari.reactNativeMapsforgePlayground;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;

import org.mapsforge.core.model.LatLong;
import org.mapsforge.core.model.MapPosition;
import org.mapsforge.map.android.graphics.AndroidGraphicFactory;
import org.mapsforge.map.android.util.AndroidPreferences;
import org.mapsforge.map.android.view.MapView;
import org.mapsforge.map.datastore.MapDataStore;
import org.mapsforge.map.layer.cache.TileCache;
import org.mapsforge.map.layer.hills.HillsRenderConfig;
import org.mapsforge.map.model.MapViewPosition;
import org.mapsforge.map.model.common.PreferencesFacade;
import org.mapsforge.map.reader.MapFile;
import org.mapsforge.map.rendertheme.XmlRenderTheme;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by a7med on 08.03.18.
 * https://stackoverflow.com/questions/15494210/fragment-support-for-mapsforge#answer-49278354
 *
 */
public abstract class MapFragmentTemplate extends Fragment
{
    // Abstract variables for displaying the map
    protected MapView mapView;
    protected PreferencesFacade preferencesFacade;
    protected List<TileCache> tileCaches = new ArrayList<TileCache>();

    protected ReactContext reactContext;

    // Initial variables for controlling the map
    private static int propZoom = 12;
    private static int propMinZoom = 3;
    private static int propMaxZoom = 50;
    private LatLong propCenterLatLong;

    /*
     * Abstract methods that must be implemented:
     *  - getLayoutId();
     *  - getMapViewId();
     *  - getMapFileName();
     *  - getRenderTheme();
     *  - createLayers();
     *  - createTileCaches();
     */
    /**
     * @return the layout to be used,
     */
    protected abstract int getLayoutId();

    /**
     * @return the id of the mapview inside the layout.
     */
    protected abstract int getMapViewId();

    /**
     * Gets the name of the map file.
     * The directory for the file is supplied by getMapFileDirectory()
     *
     * @return the map file name to be used
     */
    protected abstract String getMapFileName();

    /**
     * @return the rendertheme for this viewer
     */
    protected abstract XmlRenderTheme getRenderTheme();

    /**
     * Hook to create map layers. You will need to create at least one layer to
     * have something visible on the map.
     */
    protected abstract void createLayers();

    /**
     * Hook to create tile caches. For most map viewers you will need a tile cache
     * for the renderer. If you do not need tilecaches just provide an empty implementation.
     */
    protected abstract void createTileCaches();

    MapFragmentTemplate( ReactContext reactContext_, ArrayList center, int zoom, int minZoom, int maxZoom ) {
        super();

        reactContext = reactContext_;

        propCenterLatLong = new LatLong(
            (double) center.get(0),
            (double) center.get(1)
        );
        propZoom = zoom;
        propMinZoom = minZoom;
        propMaxZoom = maxZoom;

    }

    /*
        Methods for this class
     */
    /**
     * Hook to create controls, such as scale bars.
     * You can add more controls.
     */
    protected void createControls()
    {
        initializePosition((MapViewPosition) mapView.getModel().mapViewPosition);
        mapView.setCenter(propCenterLatLong);
        mapView.setZoomLevel((byte) propZoom);
    }

    protected void sendEvent( ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(
            DeviceEventManagerModule.RCTDeviceEventEmitter.class
        ).emit( eventName, params );
    }

    /**
     * The MaxTextWidthFactor determines how long a text may be before it is line broken. The
     * default setting should be good enough for most apps.
     *
     * @return the maximum text width factor for line breaking captions
     */
    protected float getMaxTextWidthFactor()
    {
        return 0.7f;
    }

    /**
     * @return the default starting zoom level if nothing is encoded in the map file.
     */
    protected byte getZoomLevelDefault()
    {
        return (byte) propZoom;
    }

    /**
     * @return the minimum zoom level of the map view.
     */
    protected byte getZoomLevelMin()
    {
        return (byte) propMinZoom;
    }

    /**
     * @return the maximum zoom level of the map view.
     */
    protected byte getZoomLevelMax()
    {
        return (byte) propMaxZoom;
    }

    /**
     * Template method to create the map views.
     */
    protected void createMapViews(View v)
    {
        mapView = initMapView(v);
        mapView.getModel().init(this.preferencesFacade);
        mapView.setClickable(true);
        mapView.getMapScaleBar().setVisible(true);
        mapView.setBuiltInZoomControls(false);
        mapView.setZoomLevelMin((byte) propMinZoom);
        mapView.setZoomLevelMax((byte) propMaxZoom);
        mapView.setZoomLevel((byte) propZoom);
        mapView.setCenter(new LatLong(propCenterLatLong.latitude, propCenterLatLong.longitude));
    }

    /**
     * Creates the shared preferences that are being used to store map view data over
     * activity restarts.
     */
    protected void createSharedPreferences()
    {
        this.preferencesFacade = new AndroidPreferences(getActivity().getSharedPreferences(getPersistableId(), Context.MODE_PRIVATE));
    }

    /**
     * Gets the default initial position of a map view if nothing is set in the map file. This
     * operation is used as a fallback only. Override this if you are not sure if your map file
     * will always have an initial position.
     *
     * @return the fallback initial position of the mapview.
     */
    protected MapPosition getDefaultInitialPosition()
    {
        return new MapPosition(propCenterLatLong, getZoomLevelDefault());
    }

    /**
     * Extracts the initial position from the map file, falling back onto the value supplied
     * by getDefaultInitialPosition if there is no initial position coded into the map file.
     * You will only need to override this method if you do not want the initial position extracted
     * from the map file.
     *
     * @return the initial position encoded in the map file or a fallback value.
     */
    protected MapPosition getInitialPosition()
    {
        final MapDataStore mapFile = getMapFile();

        if (mapFile.startPosition() != null)
        {
            Byte startZoomLevel = mapFile.startZoomLevel();
            if (startZoomLevel == null)
            {
                // it is actually possible to have no start zoom level in the file
                startZoomLevel = new Byte((byte) propZoom);
            }

            return new MapPosition(mapFile.startPosition(), startZoomLevel);
        }
        else
        {
            return getDefaultInitialPosition();
        }
    }

    /**
     * Provides the directory of the map file, by default the Android external storage
     * directory (e.g. sdcard).
     *
     * @return
     */
    protected File getMapFileDirectory()
    {
        // return Environment.getExternalStorageDirectory();
        return getContext().getExternalMediaDirs()[0];
    }

    /**
     * Combines map file directory and map file to a map file.
     * This method usually will not need to be changed.
     *
     * @return a map file interface
     */
    protected MapDataStore getMapFile()
    {
        return new MapFile(new File(getMapFileDirectory(), this.getMapFileName()));
    }

    /**
     * The persistable ID is used to store settings information, like the center of the last view
     * and the zoomlevel. By default the simple name of the class is used. The value is not user
     * visibile.
     *
     * @return the id that is used to save this mapview.
     */
    protected String getPersistableId()
    {
        return this.getClass().getSimpleName();
    }

    /**
     * Returns the relative size of a map view in relation to the screen size of the device. This
     * is used for cache size calculations.
     * By default this returns 1.0, for a full size map view.
     *
     * @return the screen ratio of the mapview
     */
    protected float getScreenRatio()
    {
        return 1.0f;
    }

    /**
     * Configuration method to set if a map view activity will have zoom controls.
     *
     * @return true if the map has standard zoom controls.
     */
    protected boolean hasZoomControls()
    {
        return true;
    }

    /**
     * Configuration method to set if map view activity's zoom controls hide automatically.
     *
     * @return true if zoom controls hide automatically.
     */
    protected boolean isZoomControlsAutoHide()
    {
        return true;
    }

    /**
     * initializes the map view position.
     *
     * @param mvp the map view position to be set
     * @return the mapviewposition set
     */
    protected MapViewPosition initializePosition(MapViewPosition mvp)
    {
        final LatLong center = mvp.getCenter();

        if (center.equals(propCenterLatLong))
        {
            mvp.setMapPosition(this.getInitialPosition());
        }

        mvp.setZoomLevelMax(getZoomLevelMax());
        mvp.setZoomLevelMin(getZoomLevelMin());

        return mvp;
    }

    /**
     * Hook to check for Android Runtime Permissions.
     */
    protected void checkPermissionsAndCreateLayersAndControls()
    {
        createLayers();
        createControls();
    }

    /**
     * Android Fragment life cycle method.
     *
     * @param inflater
     * @param container
     * @param savedInstanceState
     * @return
     */
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
    {
        final View v = inflater.inflate(getLayoutId(), container,
                false);

        /**
         * App Initialization !!
         * behind the scenes, this initialization process gathers a bit of
         * information on your device, such as the screen resolution, that allows mapsforge to
         * automatically adapt the rendering for the device.
         */
        AndroidGraphicFactory.createInstance(this.getActivity().getApplication());

        createSharedPreferences();
        createMapViews(v);
        createTileCaches();
        checkPermissionsAndCreateLayersAndControls();

        return v;
    }

    /**
     * Android Activity life cycle method.
     */
    @Override
    public void onPause()
    {
        mapView.getModel().save(this.preferencesFacade);
        this.preferencesFacade.save();
        super.onPause();
    }

    /**
     * Android Activity life cycle method.
     */
    @Override
    public void onDestroy()
    {
        mapView.destroyAll();
        AndroidGraphicFactory.clearResourceMemoryCache();
        tileCaches.clear();
        super.onDestroy();
    }

    /**
     * Hook to purge tile caches.
     * By default we purge every tile cache that has been added to the tileCaches list.
     */
    protected void purgeTileCaches()
    {
        for (TileCache tileCache : tileCaches)
        {
            tileCache.purge();
        }

        tileCaches.clear();
    }

    protected void redrawLayers()
    {
        mapView.getLayerManager().redrawLayers();
    }

    /**
     * Creates a map view using an XML layout file supplied by getLayoutId() and finds
     * the map view component inside it with getMapViewId().
     *
     * @return the Android MapView for this activity.
     */
    protected MapView initMapView(View v)
    {
        return (MapView) v.findViewById(getMapViewId());
    }

    /**
     * Override to enable hill shading.
     *
     * @return null or the HillsRenderConfig to use (defining height model path and algorithm)
     */
    protected HillsRenderConfig getHillsRenderConfig()
    {
        return null;
    }
}
