
var model = [
          {title: 'Lake Acworth', location: {lat: 34.0560394, lng: -84.689369}, type: 'fun'},
          {title: 'Town Center Mall', location: {lat: 34.0176429, lng: -84.566472},  type: 'fun'},
          {title: 'Kennesaw Mountain Battlefield', location: {lat: 33.9830771, lng: -84.5801223},  type: 'fun'},
          {title: 'SunTrust Park', location: {lat: 33.8907898, lng: -84.4699654},  type: 'fun'},
          {title: 'Barret Parkway Shopping Center', location: {lat: 33.9933893, lng: -84.6007358},  type: 'fun'},
          {title: 'RIdenour Estates', location: {lat: 33.9928034, lng: -84.591437},  type: 'apt'},
          {title: 'Vinings GA', location: {lat: 33.8715574, lng: -84.473635},  type: 'apt'},
          {title: 'Overton Rise Apartments', location: {lat: 33.8862235, lng: -84.4572464},  type: 'apt'},
          {title: 'The Encore', location: {lat: 33.8799177, lng: -84.4575624}, type: 'apt'},
          {title: 'The Reserve at the Ballpark', location: {lat: 33.8944195, lng: -84.4708393},  type: 'apt'},
  ];

  var markers = [];
  var map;
  var largeInfowindow = null;
 


  var viewModel = function() {

    var self = this;
    self.filter = ko.observable('');
    self.locationList = ko.observableArray(model);
    self.markerLocations = ko.observableArray(markers);
    self.filterList = ko.computed(function(){
        return self.locationList().filter(
          function(location){
            filterMarkers(self.filter())
            return (self.filter().length == 0 || location.title.toLowerCase().includes(self.filter().toLowerCase()));
          }
        );
      });
  }



  function filterMarkers(title){

    if(markers.length != 0 ){

      for(var i = 0; i < markers.length; i++){

        if(markers[i].title.toLowerCase().includes(title.toLowerCase())){

          markers[i].setVisible(true);
        }
        else{
          markers[i].setVisible(false)
        }

      }
    }
  }
 


 function initMap() {
  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24');
  largeInfowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: {lat: 34.0691755, lng: -84.6587895},
      styles: styles
    });
    for(var i = 0; i < model.length; i++){

        var position = model[i].location;
        var title = model[i].title;

        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          icon: defaultIcon,
          id: i
        });

        markers.push(marker);
        marker.setMap(map);

        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });

        marker.addListener('mouseover', function() {
          this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
          this.setIcon(defaultIcon);
        });
    }
}


function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
      return markerImage;
}


function googleMapsCustomError(){
    alert('Google Maps custom error triggered');
}


function sideLinkHandler(data){
  largeInfowindow.close()
   for(var i = 0; i < markers.length; i++){
      if(data.title == markers[i].title){
        largeInfowindow.setContent(data.title);
        largeInfowindow.open(map, markers[i]);
        break;
      }
   } 
}


function populateInfoWindow(marker, infowindow) {

  if (infowindow.marker != marker) {

    infowindow.setContent('');
    infowindow.marker = marker;

    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }

    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(map, marker);
  }
}


ko.applyBindings(new viewModel);
