var myMap;
var ADDRESS_PREFIX = "http://vdnh.ru/";
var placemarks = [];
var placemarkIconsInactive = [];
var placemarkIconsActive = [];

ymaps.ready(init);

function init () {

    var MQLayer = function () {
    var layer = new ymaps.Layer('https://api.maptiler.com/maps/outdoor/%z/%x/%y.png?key=KMWOM1cg8sVU6qvP43lH', {
        projection: ymaps.projection.sphericalMercator
    })
            layer.getCopyrights = function () {
            return ymaps.vow.resolve('Я насрал');
        };
        // Доступные уровни зума
            layer.getZoomRange = function () {
            return ymaps.vow.resolve([0, 19]);
        };

        return layer;
    };
    // Добавляем слой с ключем.
    ymaps.layer.storage.add('mq#aerial', MQLayer);
    // Создаем тип карты, состоящий из слове 'mq#aerial' и 'yandex#skeleton'
    var myMapType = new ymaps.MapType('MQ + Ya', ['mq#aerial']);
    // Добавим в хранилище типов карты
    ymaps.mapType.storage.add(myMapType);

    myMap = new ymaps.Map('map', {
            center: [55.832135, 37.628041],
            zoom: 15,
            controls: ['smallMapDefaultSet']
    },
        {
        restrictMapArea: [
             [55.822535, 37.609675],
             [55.843460, 37.642077]
        ]},
        {
        searchControlProvider: 'yandex#search'}
    );

    myMap.setType(myMapType);

    objectManager = new ymaps.ObjectManager({
        clusterize: true,
    })

    placeKeys = Object.keys(places)
    for (var placeKey in placeKeys) {
            var place = places[parseInt(placeKeys[placeKey])]
            placemarkIconsInactive[placeKey] = "static/img/icons/inactive/" + place.properties.icon + ".svg"
            placemarkIconsActive[placeKey] = "static/img/icons/active/" + place.properties.icon + "-active.svg"
            objectManager.add({
                type: 'Feature',
                id: placeKey,
                geometry: {
                    type: 'Point',
                    coordinates: place.geometry.coordinates.reverse()
                },
                properties: {
                    balloonContentHeader: '',
                    balloonContentBody: "Содержимое <em>балуна</em> метки",
                    balloonContentFooter: "Подвал",
                    hintContent: "Хинт метки",
                },
                options: {
                    iconLayout: 'default#image',
                iconImageHref: placemarkIconsInactive[placeKey],
                iconImageSize: [25, 35],
                hideIconOnBalloonOpen: false,
                }
            })


    }
     // for (let i = 0; i < placemarks.length; i++) {
     //     placemarks[i].events
     //             .add('balloonopen', function (e){
     //                 e.get('target').options.set('iconImageHref', placemarkIconsActive[i]);
     //                 e.get('target').options.set('iconImageSize', [35, 45]);
     //                 console.log(places[parseInt(placeKeys[i])].geometry.coordinates.reverse())
     //                 myMap.setCenter(places[parseInt(placeKeys[i])].geometry.coordinates.reverse(), 17, {
     //                     duration: 400
     //                 })
     //
     //             })
     //             .add('balloonclose', function (e){
     //                 e.get('target').options.set('iconImageHref', placemarkIconsInactive[i]);
     //                 e.get('target').options.set('iconImageSize', [25, 35]);
     //                 myMap.setCenter([55.832135, 37.628041], 15, {
     //                     duration: 300
     //                 })
     //             })
     // }
     myMap.geoObjects.add(objectManager)

    objectManager.objects.events.add(['balloonopen', 'balloonclose'], onObjectEvent);

     console.log(objectManager)

    function onObjectEvent (e){
    var objectId = e.get('objectId');
    if (e.get('type') == 'balloonopen'){
        objectManager.objects.setObjectOptions(objectId, {
            iconImageHref: placemarkIconsActive[objectId],
            iconImageSize: [35, 45]
        })
        myMap.setCenter(places[parseInt(placeKeys[objectId])].geometry.coordinates.reverse(), 17, {
            duration: 400
        })
    }
    if (e.get('type') == 'balloonclose'){
        objectManager.objects.setObjectOptions(objectId, {
            iconImageHref: placemarkIconsInactive[objectId],
            iconImageSize: [25, 35]
        })
        myMap.setCenter([55.832135, 37.628041], 15, {
            duration: 300
        })
    }
}


    myMap.controls.remove("trafficControl")
    myMap.controls.remove("fullscreenControl")
    myMap.controls.remove("typeSelector")
    myMap.controls.remove("rulerControl")


}



/*
var animatedLayout = ymaps.templateLayoutFactory.createClass(
                '<div class = "placemark"></div>',
                {
                    build: function (){
                        animatedLayout.superclass.build().call(this);
                        var element = this.getParentElement().getElementsByClassName('placemark')[0];
                        var size = this.isActive ? 60 : 34;
                        var smallIcon = new ymaps.Placemark([0, 0],
                            {
                                iconLayout: 'default#imageWithContent',
                                iconImageHref: "static/img/icons/inactive/" + place.properties.icon + ".svg",
                                iconImageSize: [20, 30],
                            })
                        var bigIcon = new ymaps.Placemark([0, -30],{
                            iconLayout: 'default#imageWithContent',
                            iconImageHref: "static/img/icons/active/" + place.properties.icon + ".svg",
                            iconImageSize: [25, 35],
                        })
                        this.getData().options.set('icon', this.isActive ? bigIcon : smallIcon);

                        if (this.isActive){
                            element.classList.add("active");
                            element.style.animation = ".35s show-big-placemark";
                        } else if (this.inited){
                            element.classList.remove("active");
                            element.style.animation = ".35s show-small-placemark"
                        }
                        if (!this.inited){
                            this.inited = true;
                            this.isActive = false;
                            this.getData().geoObject.events.add('click', function (){
                                this.isActive = !this.isActive;
                                this.rebuild();
                            }, this);
                        }
                    }*/
