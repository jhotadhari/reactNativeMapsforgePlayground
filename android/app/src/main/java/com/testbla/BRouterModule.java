package com.testbla;

import static android.content.Context.BIND_AUTO_CREATE;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.xmlpull.v1.XmlPullParserException;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.GZIPInputStream;

import btools.routingapp.BRouterServiceConnection;
import btools.routingapp.IBRouterService;
import io.ticofab.androidgpxparser.parser.GPXParser;
import io.ticofab.androidgpxparser.parser.domain.Gpx;
import io.ticofab.androidgpxparser.parser.domain.TrackPoint;


public class BRouterModule extends ReactContextBaseJavaModule {

	ReactContext reactContext;

	public BRouterModule(@Nullable ReactApplicationContext reactContext_) {
		super(reactContext_);
		reactContext = reactContext_;
	}

	@Override
    public String getName() {
        return "BRouterModule";
    }

    @ReactMethod
    public void getTrackFromParams(ReadableMap params, Promise promise ) {
        try {
            WritableMap response = new WritableNativeMap();


            Bundle brouterParams = new Bundle();
            brouterParams.putString( "lonlats", params.getString("lonLats") );
            brouterParams.putString( "v", "bicycle" );
            brouterParams.putInt( "fast", 0 );


            BRouterConnector brouterConnector = BRouterConnector.getInstance( reactContext );
            IBRouterService brouterService = brouterConnector.getBRouterService();
            if (brouterService == null) {
                brouterService = brouterConnector.reconnectToBRouter();
                if (brouterService == null) {
//                    return new RouteCalculationResult("BRouter service is not available");
                    promise.resolve( false );
                    return;
                }
            }

            try {
                String gpxMessage = brouterService.getTrackFromParams(brouterParams);

                Log.d( "TEST gpxMessage", gpxMessage );

                if (gpxMessage == null) {
//                    gpxMessage = "no result from brouter";
                    promise.resolve( false );
                    return;
                }
                boolean isZ64Encoded = gpxMessage.startsWith("ejY0"); // base-64 version of "z64"
                if (!(isZ64Encoded || gpxMessage.startsWith("<"))) {
//                    return new RouteCalculationResult(gpxMessage);
                    promise.resolve( false );
                    return;
                }
                InputStream gpxStream;
                if (isZ64Encoded) {
                    ByteArrayInputStream bais = new ByteArrayInputStream(Base64.decode(gpxMessage, Base64.DEFAULT));
                    bais.read(new byte[3]); // skip prefix
                    gpxStream = new GZIPInputStream(bais);
                } else {
                    gpxStream = new ByteArrayInputStream(gpxMessage.getBytes("UTF-8"));
                }


                GPXParser parser = new GPXParser();
                Gpx parsedGpx = null;
                WritableArray positions = null;
                try {
                    parsedGpx = parser.parse(gpxStream);
                } catch (IOException | XmlPullParserException e) {
                    e.printStackTrace();
                    promise.resolve( false );
                    return;
                }
                if (parsedGpx == null) {
                    promise.resolve(false);
                    return;
                } else {
                    positions = new WritableNativeArray();
                    List points = parsedGpx.getTracks().get(0).getTrackSegments().get(0).getTrackPoints();
                    for (int index = 0; index < points.size(); index++) {
                        TrackPoint point = (TrackPoint) points.get( index );
                        WritableArray latLongArray = new WritableNativeArray();
                        latLongArray.pushDouble( (Double) point.getLatitude() );
                        latLongArray.pushDouble( (Double) point.getLongitude() );
                        positions.pushArray( latLongArray );
                    }
                }
                response.putArray("positions", positions );

            } catch (Exception e) {
//                return new RouteCalculationResult("Exception calling BRouter: " + e); //$NON-NLS-1$
            }

            promise.resolve( response );
        } catch(Exception e) {
            promise.reject("Error", e);
        }
    }

}
