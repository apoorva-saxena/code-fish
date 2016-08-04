(function(exports) {

  function initMap() {
    var currentUser;
    var socket = io();
    socket.on('current user', function(data) {
      currentUser = data.user;
      var citiesContacted = currentUser.citiesContacted;

      geocoder = new google.maps.Geocoder();

      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: { lat: 0, lng:0},
        styles: [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
      });

      for(var i = 0; i < citiesContacted.length; i++) {
        codeAddress(citiesContacted[i]);
      }
    });
  }

  function codeAddress(address) {
    geocoder.geocode( {address:address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
         var image = '../images/anchor2.png';
        var marker = new google.maps.Marker({ map: map,
                                              position: results[0].geometry.location,
                                              icon: image
                                            });
      }
    });
  }

exports.initMap = initMap;
})(this);
