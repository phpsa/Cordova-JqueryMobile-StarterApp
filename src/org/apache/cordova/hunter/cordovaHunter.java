package org.apache.cordova.hunter;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.TaskStackBuilder;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import org.apache.cordova.*;

import android.support.v4.app.NotificationCompat;

public class cordovaHunter extends DroidGap {

    private static final int FM_NOTIFICATION_ID = 10000;

    @Override
    public void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        super.setIntegerProperty("loadUrlTimeoutValue", 60000);
        super.loadUrl("file:///android_asset/www/index.html");

        addNotification("hello", "Welcome to the New World Order");
    }

    private void addNotification(String Title, String Message) {
        NotificationCompat.Builder builder =
                new NotificationCompat.Builder(this)
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentTitle(Title)
                .setContentText(Message);

        Intent notificationIntent = new Intent(this, cordovaHunter.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);
        builder.setContentIntent(contentIntent);

        // Add as notification
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        manager.notify(FM_NOTIFICATION_ID, builder.build());
    }

    private void removeNotification() {
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        manager.cancel(FM_NOTIFICATION_ID);
    }
    
    @Override
	public void onDestroy() {
		super.onDestroy();
		removeNotification();
	}
}
