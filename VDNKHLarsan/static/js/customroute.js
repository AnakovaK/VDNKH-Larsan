var coords = [];
var placeMarks = [];
 var myMap;
 var ADDRESS_PREFIX = "http://vdnh.ru/";
 var placemarkIconsInactive = [];
 var placemarkIconsActive = [];
 var categorites = [];
 var tierOneCategories = ['Павильон','Развлечения','Музей', 'Храм','Аттракцион'];
 var tierTwoCategories = ['Павильон', 'Еда', 'Развлечения', 'Зеленая зона', 'Музей', 'Спорт', 'Мастерская', 'Храм', 'Прокат', 'Сувениры', 'Читальня', 'Аттракцион']
 var tierThreeCategories = ['Павильон', 'Въезд', 'Еда', 'Развлечения', 'Зеленая зона', 'Музей', 'Спорт', 'Аллея', 'Мастерская', 'Детская площадка', 'Храм', 'Памятник', 'Вход', 'Фонтан', 'Пикник', 'Парковка', 'Площадь', 'Инфоцентр', 'Пруд', 'Банкомат', 'Прокат', 'Туалеты', 'Сувениры', 'Такси', 'Остановка', 'Другое', 'Вендинговый аппарат', 'Медпункт', 'Читальня', 'Билеты', 'Аттракцион']


ymaps.ready(init)

function init(){
    console.log(routeData)
    var test = 0;
    for (var item of routeData) {
        coords[test] = places[item].geometry.coordinates.reverse();
        test++;
        //var placemark = new ymaps.Placemark(coords, {
        //balloonContent: '<img src="http://img-fotki.yandex.ru/get/6114/82599242.2d6/0_88b97_ec425cf5_M" />',
        //iconContent: "Место посещения"});
        //myMap.geoObjects.add(placemark);
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

    var IconLayoutClass = ymaps.templateLayoutFactory.createClass(
        '<img class = "my-mark" width={{properties.iconImageSize[0]}} height={{properties.iconImageSize[1]}} src = {{properties.iconImageHref}}>'+
        '{% if properties.textVisible == "Visible" %}'+
        '<p id = "caption-text" style="margin-top: 10px; font-size: 0.5em; line-height: 0.9; margin-right: 10px"> {{properties.iconCaption}}</p>'+
        '{% endif %}',{
            build: function (){
                IconLayoutClass.superclass.build.call(this)
                if (!this.inited){
                    this.inited = true
                    var properties = this.getData().properties
                    var zoom = myMap.getZoom()
                    var element = this.getParentElement().getElementsByClassName("my-mark")[0]

                    myMap.events.add('boundschange', function (){
                        var currentZoom = myMap.getZoom()

                        if (currentZoom != zoom){
                            zoom = currentZoom
                            if (zoom <= 17){
                                properties.textVisible = "Invisible"
                            }
                            else{
                                properties.textVisible = "Visible"
                            }

                            this.rebuild();
                        }
                    }, this)
            }
                }

    }
         );
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

 myMap = new ymaps.Map('map', {
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

 );

 myMap.setType(myMapType);

 objectManager = new ymaps.ObjectManager({})
 placeKeys = Object.keys(places)
 cnt = 0;
 for (var placeKey in placeKeys) {

     var place = places[parseInt(placeKeys[placeKey])]
     var image = ADDRESS_PREFIX + place.properties.pic
     if (!(categorites.includes(place.properties.type_s1))){
        categorites.push(place.properties.type_s1)
     }
     placemarkIconsInactive[placeKey] = "http://127.0.0.1:8000/static/img/icons/inactive/" + place.properties.icon + ".svg"
     placemarkIconsActive[placeKey] = "http://127.0.0.1:8000/static/img/icons/active/" + place.properties.icon + "-active.svg"
     objectManager.add({
         type: 'Feature',
         id: placeKey,
         geometry: {
             type: 'Point',
             coordinates: place.geometry.coordinates.reverse(),
         },
         properties: {
             balloonContentHeader: place.properties.title,
             balloonContentBody: `<img src="${image}">`,
             balloonContentFooter: `<button type="button" value="${place.id}" id = "addToRoute">Добавить в маршрут</button>`,
             iconImageHref: placemarkIconsInactive[placeKey],
             iconCaption: place.properties.show_title,
             iconImageSize: chooseSize(place),
             textVisible: "Invisible",
             type: place.properties.type,
         },
         options: {
             iconLayout: IconLayoutClass,
             iconShape:{
               type: "Circle",
                 coordinates: [0,0],
                 radius: chooseSize(place)[0] + 5
             },
             iconImageHref: placemarkIconsInactive[placeKey],
             iconImageSize: chooseSize(place),
             hideIconOnBalloonOpen: false,
         }
     })
 }

     objectManager.setFilter(function (object){
                     return tierOneCategories.includes(object.properties.type)
                 })

     myMap.geoObjects.add(objectManager)
     var balloonIdOnClick;

     function onObjectEvent(e) {
         var objectId = e.get('objectId');
         console.log(places[parseInt(placeKeys[objectId])].geometry.coordinates.reverse())
         if (e.get('type') == 'balloonopen') {
             objectManager.objects.setObjectOptions(objectId, {
                 iconImageHref: placemarkIconsActive[objectId],
                 iconImageSize: [35, 45]
             })
             balloonIdOnClick = places[parseInt(placeKeys[objectId])].id
             $("#addToRoute").bind({
                    click : function (){
                     var vl = $(this).val()
                     onClickAddRoute(vl)
             }})
         } else if (e.get('type') == 'balloonclose') {
             objectManager.objects.setObjectOptions(objectId, {
                 iconImageHref: placemarkIconsInactive[objectId],
                 iconImageSize: [25, 35]
             })
         }


     }

     objectManager.objects.events.add(['balloonopen', 'balloonclose'], onObjectEvent);

     var zoom = myMap.getZoom();
     myMap.events.add('boundschange', function (e){
         var old = e.get('oldZoom')
         var nw = e.get('newZoom')
         if (old != nw){

             if (nw <= 16){
                 objectManager.setFilter(function (object){
                     return tierOneCategories.includes(object.properties.type)
                 })
             }
             if (nw == 17){
                 objectManager.setFilter(function (object){
                     return tierTwoCategories.includes(object.properties.type)
                 })
             }
             if (nw >= 18){
                 objectManager.setFilter(function (object){
                     return tierThreeCategories.includes(object.properties.type)
                 })
             }
         }
     })
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

    var bl = 0;
    coords2 = []
    for (var item of routeData) {
        coords2[bl] = places[item].geometry.coordinates.reverse();
        console.log(coords2[bl])
        var temp_pm = new ymaps.Placemark(coords2[item], {}, {
            preset: "islands#circleDotIcon",
            iconColor: '#ff0000'
        });
        myMap.geoObjects.add(temp_pm);
    }

    myMap.geoObjects.add(multiRoute)

    myMap.controls.remove("trafficControl")
    myMap.controls.remove("fullscreenControl")
    myMap.controls.remove("typeSelector")
    myMap.controls.remove("rulerControl")
    myMap.controls.remove("searchControl")
}

 function onClickAddRoute(placeId){
     console.log("Hello button!")
     console.log(placeId)
     $.ajax({
         method: "POST",
         url: "",
         data: {
             'placeId': placeId
         },
         success: function (data){
             alert("It worked")
         },
         error: function (data, textStatus, errorThrown){
             console.log(textStatus)
             console.log(errorThrown)
             alert("ya obosralsa")
         }
     })
 }

 function chooseSize(placeObj){
    if (placeObj.properties.type == "Павильон"){
        return [25, 35]
    }
    return [15, 25]
 }
