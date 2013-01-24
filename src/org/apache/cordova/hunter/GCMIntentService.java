package org.apache.cordova.hunter;

import com.google.android.gcm.*;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import com.plugin.GCM.GCMPlugin;


import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;

import android.app.Notification.Builder;

public class GCMIntentService extends GCMBaseIntentService {

    public static final String ME = "GCMReceiver";

    public GCMIntentService() {
        super("GCMIntentService");
    }
    private static final String TAG = "GCMIntentService";

    @Override
    public void onRegistered(Context context, String regId) {

        Log.v(ME + ":onRegistered", "Registration ID arrived!");
        Log.v(ME + ":onRegistered", regId);

        JSONObject json;

        try {
            json = new JSONObject().put("event", "registered");
            json.put("regid", regId);

            Log.v(ME + ":onRegisterd", json.toString());

            // Send this JSON data to the JavaScript application above EVENT should be set to the msg type
            // In this case this is the registration ID
            GCMPlugin.sendJavascript(json);

        } catch (JSONException e) {
            // No message to the user is sent, JSON failed
            Log.e(ME + ":onRegisterd", "JSON exception");
        }
    }

    @Override
    public void onUnregistered(Context context, String regId) {
        Log.d(TAG, "onUnregistered - regId: " + regId);
    }

    @Override
    protected void onMessage(Context context, Intent intent) {
        Log.d(TAG, "onMessage - context: " + context);

        // Extract the payload from the message
        Bundle extras = intent.getExtras();
        if (extras != null) {
            try {
                Log.v(ME + ":onMessage extras ", extras.getString("message"));

                JSONObject json;
                json = new JSONObject().put("event", "message");


                // My application on my host server sends back to "EXTRAS" variables message and msgcnt
                // Depending on how you build your server app you can specify what variables you want to send
                //
                json.put("message", extras.getString("message"));
                json.put("msgcnt", extras.getString("msgcnt"));

                Log.v(ME + ":onMessage ", json.toString());

                
//                String message = extras.getString("message");
//                String title = extras.getString("title");
//                
//                Notification.Builder mBuilder = new Notification.Builder((this))
//                        .setSmallIcon(R.drawable.notification_icon)
//                        .setContentTitle(title)
//                        .setContentText(message);
//                // Creates an explicit intent for an Activity in your app
//                Intent resultIntent = new Intent(this, ResultActivity.class);
                
                
                
                
                
                GCMPlugin.sendJavascript(json);
                // Send the MESSAGE to the Javascript application
            } catch (JSONException e) {
                Log.e(ME + ":onMessage", "JSON exception");
            }
        }


    }

    @Override
    public void onError(Context context, String errorId) {
        Log.e(TAG, "onError - errorId: " + errorId);
    }
}
