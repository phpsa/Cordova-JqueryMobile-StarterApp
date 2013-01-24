var $GLOBALS = {
    'Facebook_App_id' : '317511395000921',
    'Facebook_App_permissions' : ["email", "user_about_me"]
    
};


$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
    $.mobile.allowCrossDomainPages = true;
               
});

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

//Track our longitude and latitude consistantly
navigator.geolocation.getCurrentPosition(function (position) {
    DrawMap(position.coords.latitude,position.coords.longitude);
}, function (error) {
    DrawMap('-45.774318','170.704365');
});
                
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
                
}
function MoveMarker(gLat,gLong) {
    var marker = $('#mapCanvas').gmap('get', 'markers').m_1;
    var yourCurrentLatLng = new google.maps.LatLng( gLat,gLong);
    marker.setPosition(yourCurrentLatLng);
                 
}
var markerPos = '1';
var watchID = navigator.geolocation.watchPosition(function(position) { 
    MoveMarker(position.coords.latitude,position.coords.longitude);
            
}, function () {
    console.log('called');
    if(markerPos == 1){
        MoveMarker('-45.773001','170.701532');
        markerPos = 0;
    }else{
        MoveMarker('-45.774318','170.704365');
        markerPos = 1;
    }
}, {
    frequency: 3000
});
           
           
           $( '#map' ).on( 'pageinit',function(event, ui){
 setTimeout(function () {
     
      $('#mapCanvas').gmap('refresh');
 }, 500)
           
           
});
           
            
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