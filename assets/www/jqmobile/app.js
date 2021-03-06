var eCount = 0;
//jQuery Mobile inititalisation
$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
    $.mobile.allowCrossDomainPages = true;           
});


var theCompass = theCompass || {};

theCompass.Compass = (function () {
    var lastHeading = -1,
    
    
    // cache the jQuery selectors
    $headText = $("#compassHeader"),
    $compass = $("#compass"),
    // displays the degree
    updateHeadingText = function (event, heading) {
        event.preventDefault();
        $headText.html(heading + "&deg;");
        return false;
    },
    // adjusts the rotation of the compass
    updateCompass = function (event, heading) {
        event.preventDefault();
        // to make the compass dial point the right way
        var rotation = 360 - heading,
        rotateDeg = 'rotate(' + rotation + 'deg)';
        // TODO: fix - this code only works on webkit browsers, not wp7
        $compass.css('-webkit-transform', rotateDeg);
        return false;
    };
    // bind both of the event handlers to the "newHeading" event
    $("body").bind("newHeading", updateCompass).bind("newHeading", updateHeadingText);
}());


var showMapPage = function() {
    $.mobile.changePage( $('#map'), {
        transition: "slide"
    } );
//check if we want to reload the map.!!!
}

var showPreferences = function () {
    window.plugins.applicationPreference.show("org.apache.cordova.hunter.preferences");
}
            
var showCompassPage = function () {
    $.mobile.changePage( $('#CompassPage'), {
        transition: "slide"
    } );
}
            
var toggleTorch = function () {
    window.plugins.Torch.toggle( 
        function() {
            console.log('torch toggle success');
        },
        function(e) {     
            console.log('torch toggle error');
            console.log(e);
        });   
}



var quitApp = function () {
    clearTimeout(PowerRunningEvent);
    clearTimeout(watchID);
    window.plugins.Torch.turnOff(function(){},function(){});
    power_release();
    navigator.app.exitApp();
}


function power_acquire() {
    window.plugins.powerManagement.acquire(
        function() {
        // alert( 'hooray' );/
        },
        function() {
        //  alert( 'oh no!' );
        }
        );
};
		
function power_release() {
    window.plugins.powerManagement.release(
        function() {
        //   alert( 'hooray' );
        },
        function() {
        //   alert( 'oh no!' );
        }
        );
}
		
function power_dim() {
    window.plugins.powerManagement.dim(
        function() {
        //  alert( 'hooray' );
        },
        function() {
        //   alert( 'oh no!' );
        }
        );
}

var PowerRunningEvent;

var testPowerManagerSetting = function(){
    console.log("testing Powermanager Settings");
    window.plugins.applicationPreference.load(function(prefs) {
        $GLOBALS.APPLICATION_PREFERENCES = prefs;
        if($GLOBALS.APPLICATION_PREFERENCES.disable_screenout == "true"){
            if(!$GLOBALS.POWERMANAGER_AQUIRED){
                $GLOBALS.POWERMANAGER_AQUIRED = true;
                power_acquire();
            }
        }else{
            if($GLOBALS.POWERMANAGER_AQUIRED){
                power_release();
            }
        }
    },function(err){
        console.log(err);
    });
        
    PowerRunningEvent = setTimeout(testPowerManagerSetting,5000); //every 5 seconds
}

//Device Ready Calls
document.addEventListener("deviceready", function () {

    console.log(++eCount + ": DeviceReady");
    
    console.log(++eCount + ": bind back button");
    document.addEventListener("backbutton", function () {
        navigator.app.backHistory();
        return false;
    }, false);
            
        
    testPowerManagerSetting();
    
    initMap();

    var optionsmenu = new OptionsMenu({
        id: "optionsmenu",
        items: [ 
        [ {
            label: "Map",
            image: "menu/ic_menu_mapmode.png",
            action: showMapPage
        }, 
        {
            label: "Torch",
            image: "menu/ic_menu_torch.png",
            action: toggleTorch
        },
        
        {
            label: "Compass",
            image: "menu/ic_menu_compass.png",
            action: showCompassPage
        }, 
        {
            label: "Settings",
            image: "menu/ic_menu_settings.png",
            action: showPreferences
        },
        {
            label: "Quit",
            image: "menu/ic_menu_exit.png",
            action: quitApp
        } ],
        ] 
    });
    
    //set your code to only fire once the deviceready has been triggered here !
    navigator.compass.watchHeading(function (heading) {
        // only magnetic heading works universally on iOS and Android
        // round off the heading then trigger newHeading event for any listeners
        var newHeading = Math.round(heading.magneticHeading);
        $("body").trigger("newHeading", [newHeading]);
    }, function (error) {
        // if we get an error, show its code
        alert("Compass error: " + error.code);
    }, {
        frequency : 100
    });
    
    

}, false);


/** FACEBOOK AUTH START **/
var facebook_plugin = {
    login: function() {
        window.plugins.facebookConnect.login({
            permissions: $GLOBALS.Facebook_App_permissions, 
            appId: $GLOBALS.Facebook_App_id
        }, function(result) {
            console.log("facebookConnect.login:" + JSON.stringify(result));
        });
    },
    requestWithGraphPath: function() {
        window.plugins.facebookConnect.requestWithGraphPath("/me/friends", function(result) {
            //console.log("facebookConnect.requestWithGraphPath:" + JSON.stringify(result));
            $('#fbgraphdata').text(JSON.stringify(result));
            $('facebookDialog').popup("open");
        });
    },
    dialog : function() {
        var dialogOptions = {
            link: 'https://developers.facebook.com/docs/reference/dialogs/',
            picture: 'http://fbrell.com/f8.jpg',
            name: 'Facebook Dialogs',
            caption: 'Reference Documentation',
            description: 'Using Dialogs to interact with users.'
        };

        window.plugins.facebookConnect.dialog('feed', dialogOptions, function(response) {
            console.log("facebookConnect.dialog:" + JSON.stringify(response));
        });
    },
    logout : function() {
        window.plugins.facebookConnect.logout(function(result) {
            console.log("facebookConnect.logout:" + JSON.stringify(result));
        });
    }
};
/** FACEBOOK AUTH END **/



/** GOOGLE MAPS START **/
var watchID;

function initMap(){
    console.log("MAP:: InitMap")
    navigator.geolocation.getCurrentPosition(function (position) {
        DrawMap(position.coords.latitude,position.coords.longitude);
    }, function (error) {
        console.log(error);
        initMap();
    });
}

function watchMap(){
    console.log("MAP:: WatchMap");
    var watchID = navigator.geolocation.watchPosition(function(position) { 
        MoveMarker(position.coords.latitude,position.coords.longitude);
    }, function (e) {
        console.log(e);
        console.log('rebuild');
        watchMap();
    }, {
        frequency: 5000
    });
}

//Track our longitude and latitude consistantly
function DrawMap(gLat,gLong) {
    console.log("MAP:: DrawMap")
    var yourStartLatLng = new google.maps.LatLng( gLat,gLong);
    $('#mapCanvas').gmap({
        'zoom' : 16,
        'center': yourStartLatLng,
        'disableDefaultUI': true,
        'mapTypeId': google.maps.MapTypeId.TERRAIN
                
    });
    $('#mapCanvas').gmap('addMarker', {
        'id' : 'm_1', 
        'position': gLat +',' + gLong
    });
    watchMap();         
}
    
function MoveMarker(gLat,gLong) {
    console.log("MAP:: MoveMarker")
    var marker = $('#mapCanvas').gmap('get', 'markers').m_1;
    var yourCurrentLatLng = new google.maps.LatLng( gLat,gLong);
    marker.setPosition(yourCurrentLatLng);
                 
}
