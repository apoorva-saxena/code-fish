(function(exports) {

var currentUser;
var socket = io();
socket.on('current user', function(data) {
currentUser = data.user;
console.log(currentUser);
});
var city = "London";
function initMap()
{
  geocoder = new google.maps.Geocoder();


  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 2,
      center: { lat: 0, lon:0}
  });
  codeAddress(city);
}

function codeAddress(address)
{
  geocoder.geocode( {address:address}, function(results, status)
  {
    if (status == google.maps.GeocoderStatus.OK)
    {
      map.setCenter(results[0].geometry.location);//center the map over the result
      //place a marker at the location
      var marker = new google.maps.Marker(
      {
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
   }
  });
}
exports.socket = socket;
})(this);
