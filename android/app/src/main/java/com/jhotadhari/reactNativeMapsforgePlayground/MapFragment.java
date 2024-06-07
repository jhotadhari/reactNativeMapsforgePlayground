/*
 * Copyright 2014 Ludwig M Brinckmann
 * Copyright 2015-2019 devemux86
 *
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.jhotadhari.reactNativeMapsforgePlayground;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import org.mapsforge.core.model.Dimension;
import org.mapsforge.core.model.MapPosition;
import org.mapsforge.core.util.LatLongUtils;
import org.mapsforge.map.android.util.AndroidUtil;
import org.mapsforge.map.android.view.MapView;
import org.mapsforge.map.layer.overlay.Marker;
import org.mapsforge.map.layer.renderer.TileRendererLayer;
import org.mapsforge.map.rendertheme.InternalRenderTheme;
import org.mapsforge.map.rendertheme.XmlRenderTheme;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * The simplest form of creating a map viewer based on the MapViewerTemplate.
 * It also demonstrates the use simplified cleanup operation at activity exit.
 */
public class MapFragment extends MapFragmentTemplate {

    MapFragment( ReactContext reactContext, ArrayList center, int zoom, int minZoom, int maxZoom  ) {
        super( reactContext, center, zoom, minZoom, maxZoom );
    }
    public MapView getMapView() {
        return mapView;
    }

    /**
     * This MapViewer uses the built-in default theme.
     *
     * @return the render theme to use
     */
    @Override
    protected XmlRenderTheme getRenderTheme() {
        return InternalRenderTheme.DEFAULT;
    }

    /**
     * This MapViewer uses the standard xml layout in the Samples app.
     */
    @Override
    protected int getLayoutId() {
        return R.layout.mapviewer;
    }

    /**
     * The id of the mapview inside the layout.
     *
     * @return the id of the MapView inside the layout.
     */
    @Override
    protected int getMapViewId() {
        return R.id.mapView;
    }

    /**
     * The name of the map file.
     *
     * @return map file name
     */
    @Override
    protected String getMapFileName() {
        return "Berlin.map";
    }

    /**
     * Creates a simple tile renderer layer with the AndroidUtil helper.
     */
    @Override
    protected void createLayers() {
        TileRendererLayer tileRendererLayer = AndroidUtil.createTileRendererLayer(this.tileCaches.get(0),
                this.mapView.getModel().mapViewPosition, getMapFile(), getRenderTheme(), false, true, false);
        this.mapView.getLayerManager().getLayers().add(tileRendererLayer);

        WritableMap params = new WritableNativeMap();
        params.putInt( "nativeTag", this.getId() );
        sendEvent( reactContext, "MapLayersCreated", params );

        MapInputListener mapInputListener = new MapInputListener( this.reactContext, this.getId(), this.mapView );
        this.mapView.addInputListener( mapInputListener );
    }

    /**
     * Creates the tile cache with the AndroidUtil helper
     */
    @Override
    protected void createTileCaches() {
        this.tileCaches.add(AndroidUtil.createTileCache(getActivity(), getPersistableId(),
                this.mapView.getModel().displayModel.getTileSize(), this.getScreenRatio(),
                this.mapView.getModel().frameBufferModel.getOverdrawFactor()));
    }

    @Override
    protected MapPosition getInitialPosition() {
        int tileSize = this.mapView.getModel().displayModel.getTileSize();
        byte zoomLevel = LatLongUtils.zoomForBounds(new Dimension(tileSize * 4, tileSize * 4), getMapFile().boundingBox(), tileSize);
        return new MapPosition(getMapFile().boundingBox().getCenterPoint(), zoomLevel);
    }

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setTitle(getClass().getSimpleName());
//    }
}
