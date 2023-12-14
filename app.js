document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([51.505, -0.09], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  
    var control = L.Routing.control({
      waypoints: [
        L.latLng(50.43998787931736, 30.54988182847573),
        L.latLng(50.45022938109185, 30.524317921637806)
      ],
      routeWhileDragging: true
    }).addTo(map);
  
    // You can customize the appearance of the route line and markers if needed.
    control.on('routesfound', function (e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      console.log('Distance: ' + summary.totalDistance + ' meters');
      console.log('Time: ' + summary.totalTime + ' seconds');
    });
  });
  