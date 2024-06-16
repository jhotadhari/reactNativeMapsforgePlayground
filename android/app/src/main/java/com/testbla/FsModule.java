package com.testbla;

import android.os.Build;
import android.os.Environment;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.File;
import java.io.FileFilter;
import java.nio.file.Path;

public class FsModule extends ReactContextBaseJavaModule {

	final static int APP_STORAGE_ACCESS_REQUEST_CODE = 501; // Any value

	ReactContext reactContext;

	public FsModule(@Nullable ReactApplicationContext reactContext_) {
		super(reactContext_);
		reactContext = reactContext_;
	}

	@Override
    public String getName() {
        return "FsModule";
    }

    @ReactMethod
    public void getInfo( String navDir, Promise promise ) {
        Log.d( "navDir", String.valueOf( navDir ) );
        try {
            WritableMap response = new WritableNativeMap();

            if ( Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && ! Environment.isExternalStorageManager() ) {
            	response.putBoolean( "needExternalStorageManager", true );
            	promise.resolve( response );
				return;
            }



			File path = new File( navDir );
//			Log.d( "path", String.valueOf( path.toString() ) );


//
			response.putString( "navParent", String.valueOf( path.getParent() ) );
//			Log.d( "navDir", String.valueOf( path.getParent() ) );
            WritableArray navChildrenArray = new WritableNativeArray();
//            Log.d( "isDirectory", String.valueOf( path.isDirectory() ) );
            if ( path.isDirectory() ) {
                File[] files = path.listFiles();
                for (int i = 0; i < files.length; i++) {
//        			Log.d( "bla[i]", String.valueOf( files[i].toString() ) );
                    WritableMap fileInfoMap = new WritableNativeMap();
                    fileInfoMap.putString( "name", files[i].toString() );
                    fileInfoMap.putBoolean( "isDir", files[i].isDirectory() );
                    fileInfoMap.putBoolean( "isFile", files[i].isFile() );
                    fileInfoMap.putBoolean( "canRead", files[i].canRead() );
                    fileInfoMap.putBoolean( "canExecute", files[i].canExecute() );
                    navChildrenArray.pushMap( fileInfoMap );
                }

            }
			response.putArray( "navChildren", navChildrenArray );
            promise.resolve( response );
        } catch(Exception e) {
            promise.reject("Error", e);
        }
    }

}
