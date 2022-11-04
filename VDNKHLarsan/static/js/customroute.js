var coords = [];
var placeMarks = [];

ymaps.ready(init)

function init(){
    console.log(routeData)
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

     var myMap2 = new ymaps.Map('map', {
             center: [55.832135, 37.628041],
             zoom: 15,
             controls: ['smallMapDefaultSet']
         },
         {
             restrictMapArea: [
                [55.819519, 37.581011],
                 [55.849442, 37.661223]
             ]
         },
         {
              searchControlProvider: 'yandex#search'
         }
     );

     myMap2.setType(myMapType);

     var test = 0;
    for (var item of routeData) {
        console.log(item)
        coords[test] = places[item].geometry.coordinates.reverse();
                myMap2.geoObjects.add(new ymaps.Placemark(coords[test],
            {
                iconContent: test + 1
            }));
        test++;

    }

    multiRoute2 = new ymaps.multiRouter.MultiRoute({
         referencePoints: coords,
         params:{
             routingMode: 'pedestrian',
         }
     }, {
         routeActiveMarkerVisible: false,
         routeOpenBalloonOnClick: false,
         wayPointVisible: false
     })

    myMap2.geoObjects.add(multiRoute2)


    myMap2.controls.remove("trafficControl")
    myMap2.controls.remove("fullscreenControl")
    myMap2.controls.remove("typeSelector")
    myMap2.controls.remove("rulerControl")
    myMap2.controls.remove("searchControl")
    }