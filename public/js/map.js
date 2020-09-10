// function initMap() {
//     console.log(window.user);
//     adoptMeMap = new google.maps.Map(document.getElementById('map'), {
//       center: {lat: -34.397, lng: 150.644},
//       zoom: 8
//     });
// }

function initMap() {
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: {
            lat: 40.4654,
            lng: -3.693
        }
    });
    console.log()
    if (window.user) {
        console.log("hola")
        console.log(window.user)
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 11,
            center: {
                lat: +window.user.location.lat,
                lng: -3.4
            }
        });
            var position = new google.maps.LatLng({ "lat": 40.4646422, "lng": "-3.693248499999999" })
            console.log("JSONNNNNN : " + JSON.stringify(position))
            new google.maps.Marker({
                position: { "lat": 40.4646422, "lng": -3.693248499999999 },
                map: map
            })
    }
}  
    // addTweet(tweet) {
    //   const [lng, lat] = tweet.location.coordinates
  
    //   const tweetMarker = new google.maps.Marker({
    //     position: { lat, lng },
    //     map: this.map
    //   });
  
    //   const infoWindow = new google.maps.InfoWindow({
    //     maxWidth: 300,
    //     content: `
    //       <p>${tweet.body}</p>
    //     `
    //   });
  
    //   tweetMarker.addListener('click', function () {
    //     infoWindow.open(this.map, tweetMarker);
    //   });
  
    //   this.markers.push(tweetMarker)
    // }
  
  