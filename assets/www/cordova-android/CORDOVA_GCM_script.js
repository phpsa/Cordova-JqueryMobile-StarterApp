gApp = new Array();

gApp.deviceready = false;
gApp.gcmregid = '';

gApp.pushProfile = {};

var getDeviceData = function() {
    var data = {
        Platform: device.platform,
        Version: device.version,
        Uuid: device.uuid,
        Name: device.name,
        Screen: {
            Width: screen.width,
            Height: screen.height,
            Color: screen.colorDepth
        }    
    };
    return data;
};

window.onbeforeunload  =  function(e) {

    if ( gApp.gcmregid.length > 0 )
    {
        // The same routines are called for success/fail on the unregister. You can make them unique if you like
        window.GCM.unregister( GCM_Success, GCM_Fail );      // close the GCM

    }
};

document.addEventListener('deviceready', function() {
    
    console.log("GCM DEVICEREADY CALLED");
    
    // This is the Cordova deviceready event. Once this is called Cordova is available to be used
    $("#app-status-ul").append('<li>deviceready event received</li>' );

    $("#app-status-ul").append('<li>calling GCMRegistrar.register, register our Sender ID with Google</li>' );


    gApp.DeviceReady = true;


    // Some Unique stuff here,
    // The first Parm is your Google email address that you were authorized to use GCM with
    // the Event Processing rountine (2nd parm) we pass in the String name
    // not a pointer to the routine, under the covers a JavaScript call is made so the name is used
    // to generate the function name to call. I didn't know how to call a JavaScript routine from Java
    // The last two parms are used by Cordova, they are the callback routines if the call is successful or fails
    //
    // CHANGE: your_app_id
    // TO: what ever your GCM authorized senderId is
    //
    if( window.plugins){
        window.plugins.GCM.register($GLOBALS.GCM_KEY, "GCM_Event", GCM_Success, GCM_Fail );
    }else{
        window.GCM.register($GLOBALS.GCM_KEY, "GCM_Event", GCM_Success, GCM_Fail );
    }
}, false );


function
GCM_Event(e)
{

    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');


    switch( e.event )
    {
        case 'registered':
            // the definition of the e variable is json return defined in GCMReceiver.java
            // In my case on registered I have EVENT and REGID defined
            gApp.gcmregid = e.regid;
            if ( gApp.gcmregid.length > 0 )
            {
                $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");


                //Ok we managed to get regstered!!!! :-)
                var apiUrl = 'http://localhost/gcm/';
                var postData = {
                    visible : true,
                    allow_push : true,
                    device_data : getDeviceData(),
                    gcm_regid: e.regid,
                    name : 'anonymous'
                };
                
                $.ajax({
                    type: "POST",
                    url: apiUrl,
                    data: postData,
                    dataType: 'json'
                }).done(function (data,textStatus,jqXHR) {
                    console.log("api call success");
                    console.log(JSON.stringify(data));
                    console.log(JSON.stringify(textStatus));
                }).fail(function(jqXHR,textStatus,errorThrown) {
                    console.log("api call FAIL");
                    console.log(JSON.stringify(jqXHR));
                    console.log(JSON.stringify(textStatus));
                    console.log(JSON.stringify(errorThrown));
                }).always(function(data,textStatus,jqXHR){
                    console.log("API ALways Called");
                //here we sould build our current object!
                });
               
            //gApp.pushProfile

            // ==============================================================================
            // ==============================================================================
            // ==============================================================================
            //
            // This is where you would code to send the REGID to your server for this device
            //
            // ==============================================================================
            // ==============================================================================
            // ==============================================================================

            }

            break

        case 'message':
            // the definition of the e variable is json return defined in GCMIntentService.java
            // In my case on registered I have EVENT, MSG and MSGCNT defined

            // You will NOT receive any messages unless you build a HOST server application to send
            // Messages to you, This is just here to show you how it might work

            $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.message + '</li>');

            $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.msgcnt + '</li>');


            break;


        case 'error':

            $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');

            break;



        default:
            $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');

            break;
    }
}

function
GCM_Success(e)
{
    $("#app-status-ul").append('<li>GCM_Success -> We have successfully registered and called the GCM plugin, waiting for GCM_Event:registered -> REGID back from Google</li>');

}

function
GCM_Fail(e)
{
    console.log(e);
    $("#app-status-ul").append('<li>GCM_Fail -> GCM plugin failed to register</li>');

    $("#app-status-ul").append('<li>GCM_Fail -> ' + e.msg + '</li>');

}

