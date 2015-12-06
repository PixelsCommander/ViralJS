window.onbeforeunload = function(e) {
    return ('After closing the tab you will stop seeding application to the people near you.');
}

var sentByData = {};
var appId = location.href.indexOf('localhost') !== -1 ? '1214376798578200' : '1194624743886739';

if (typeof ViralContainer !== 'undefined') {
    console.log('And our meta is...');
    console.log(ViralContainer.meta || 'No meta information');

    sentByData = ViralContainer.meta;
} else {
    sentByData = {
        name: 'Express server with ViralJS middleware',
        avatar: 'http://publicdomainvectors.org/photos/1313181674.png',
        id: 0
    };
}

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
    }
}

function checkLoginState() {
    console.log('checkLoginState');
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    console.log('fbAsyncInit ' + appId);

    //alert('Starting FB init');
    FB.init({
        appId: appId,
        xfbml: true,
        version: 'v2.4',
        cookie: true
    });

    //alert('Getting login status');
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {

        FB.api('/me/picture', function (imageResponse) {
            console.log('Successful login for: ' + response.name);
            console.log('Id: ' + response.id);

            var thisUserData = {
                avatar: imageResponse.data.url,
                name: response.name,
                id: response.id
            };

            ViralContainer.writeMeta(thisUserData);

            ViralContainer.socket.on('connectionsGraph', function (data) {
                console.log('Received graph data');
                drawGraph(data);
            });

            ViralContainer.socket.emit('addConnection', {
                a: sentByData,
                b: thisUserData
            });

            if (sentByData) {
                console.log('You received application from ' + sentByData.name);
            }
        });
    });
}
