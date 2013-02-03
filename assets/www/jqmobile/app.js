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

//jQuery Mobile inititalisation
$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
    $.mobile.allowCrossDomainPages = true;           
});

//Device Ready Calls
document.addEventListener("deviceready", function () {
    //set your code to only fire once the deviceready has been triggered here !
    theCompass.Compass.watchId = navigator.compass.watchHeading(function (heading) {
		// only magnetic heading works universally on iOS and Android
		// round off the heading then trigger newHeading event for any listeners
		var newHeading = Math.round(heading.magneticHeading);
		$("body").trigger("newHeading", [newHeading]);
	}, function (error) {
		// if we get an error, show its code
		alert("Compass error: " + error.code);
	}, {frequency : 100});

    }, false);

//Individial Bits
/** TORCH START**/
$('.Torch').on('click', function(e) {
    window.plugins.Torch.toggle( 
        function() {
            //success the torch is toggled
            $('#Torch').toggleClass("active");
        },
        function() {}     
        //Error Occured the torch is toggled
        );     
});
/** TORCH END**/

/** BARCODE SCANNER START **/
$('.Barcode').on('click', function(e) {
    window.plugins.barcodeScanner.scan( function(result) {
        alert("We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);
    }, function(error) {
        alert("Scanning failed: " + error);
    }
    );
            
});
/** BARCODE SCANNER END **/

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
function initMap(){
    
    navigator.geolocation.getCurrentPosition(function (position) {
        DrawMap(position.coords.latitude,position.coords.longitude);
    }, function (error) {
        initMap();
    });
}

function watchMap(){
    var watchID = navigator.geolocation.watchPosition(function(position) { 
        MoveMarker(position.coords.latitude,position.coords.longitude);
    }, function () {
        watchMap();
    }, {
        frequency: 3000
    });
}

//Track our longitude and latitude consistantly
function DrawMap(gLat,gLong) {
                
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
    var marker = $('#mapCanvas').gmap('get', 'markers').m_1;
    var yourCurrentLatLng = new google.maps.LatLng( gLat,gLong);
    marker.setPosition(yourCurrentLatLng);
                 
}

           
//Refresh the map on call to the display page.        
$( '#map' ).on( 'pageinit',function(event, ui){
    setTimeout(function () {
        $('#mapCanvas').gmap('refresh');
    }, 1500)
});

/** GOOGLE MAPS END **/