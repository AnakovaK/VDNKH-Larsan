var coords = [];
var placeMarks = [];

ymaps.ready(init)

function init(){
    var cnt = 0;
      var MQLayer = function () {
           var layer = new ymaps.Layer('https://api.maptiler.com/maps/outdoor/%z/%x/%y.png?key=KMWOM1cg8sVU6qvP43lH', {
               projection: ymaps.projection.sphericalMercator
           })
           layer.getCopyrights = function () {
               return ymaps.vow.resolve('');
           };
           layer.getZoomRange = function () {
               return ymaps.vow.resolve([0, 19]);
           };

           return layer;
       };

      ymaps.layer.storage.add('mq#aerial', MQLayer);

       var myMapType = new ymaps.MapType('MQ + Ya', ['mq#aerial']);

       ymaps.mapType.storage.add(myMapType);

     var myMap = new ymaps.Map('map_routes', {
             center: [55.832135, 37.628041],
             zoom: 15,
             controls: ['smallMapDefaultSet']
         },
         {
             restrictMapArea: [
                 [55.819909, 37.593784],
                 [55.850090, 37.654994]
             ]
         },
         {
              searchControlProvider: 'yandex#search'
         }
     );

     myMap.setType(myMapType);

     for (var item of routesObject.routes[2].items) {
        coords[cnt] = places[parseInt(item.place)].geometry.coordinates.reverse();
        myMap.geoObjects.add(new ymaps.Placemark(coords[cnt],
            {
                iconContent: cnt + 1
            }));
        cnt++;
    }

     multiRoute = new ymaps.multiRouter.MultiRoute({
         referencePoints: coords,
         params:{
             routingMode: 'pedestrian',

         }
     }, {
         routeActiveMarkerVisible: false,
         routeOpenBalloonOnClick: false,
         wayPointVisible: false
     })

    myMap.geoObjects.add(multiRoute)
}