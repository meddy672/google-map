
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
  ]




  var viewModel = function() {

    var self = this;
    self.filter = ko.observable('');
    self.locationList = ko.observableArray(model);
    self.filterList = function(){

        return ko.utils.arrayFilter(self.locationList(), function(location) {

          if(location.title == self.filter()){

            return location.title
          }
          
           else if( location.title.includes(self.filter()) ){
              
              return location.title
           }

           else{

              return self.locationList.remove(location)
           }
 
        });
    };
  }
 


 function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
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
          //icon: icon,
          id: i
        });

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





ko.applyBindings(new viewModel);
