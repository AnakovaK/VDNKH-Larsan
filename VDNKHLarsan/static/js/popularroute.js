var coords = [];
var placeMarks = [];
var myMap;
var ADDRESS_PREFIX = "http://vdnh.ru/";
var placemarkIconsInactive = [];
var placemarkIconsActive = [];
var tierOneCategories = ['Павильон', 'Развлечения', 'Музей', 'Храм', 'Аттракцион'];
var tierTwoCategories = ['Павильон', 'Еда', 'Развлечения', 'Зеленая зона', 'Музей', 'Спорт', 'Мастерская', 'Храм', 'Прокат', 'Сувениры', 'Читальня', 'Аттракцион']
var tierThreeCategories = ['Павильон', 'Въезд', 'Еда', 'Развлечения', 'Зеленая зона', 'Музей', 'Спорт', 'Аллея', 'Мастерская', 'Детская площадка', 'Храм', 'Памятник', 'Вход', 'Фонтан', 'Пикник', 'Парковка', 'Площадь', 'Инфоцентр', 'Пруд', 'Банкомат', 'Прокат', 'Туалеты', 'Сувениры', 'Такси', 'Остановка', 'Другое', 'Вендинговый аппарат', 'Медпункт', 'Читальня', 'Билеты', 'Аттракцион']


ymaps.ready(init)

function init() {
    var test = 0;
    for (var item of routeData) {
        coords[test] = places[item].geometry.coordinates.reverse();
        test++;
    }

    multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: coords,
        params: {
            routingMode: 'pedestrian',
        }
    }, {
        routeOpenBalloonOnClick: false,
        wayPointVisible: true
    })

    var IconLayoutClass = ymaps.templateLayoutFactory.createClass(
        '<img class = "my-mark" width={{properties.iconImageSize[0]}} height={{properties.iconImageSize[1]}} src = {{properties.iconImageHref}}>'+
        '{% if properties.textVisible == "Visible" %}'+
        '<p id = "caption-text" style="padding-right:100px; text-align: center; font-size: 0.9em; line-height: 1; margin:0px; text-shadow: 0 0 3px #fff;"> {{properties.iconCaption}}</p>'+
        '{% endif %}',{
            build: function (){
                IconLayoutClass.superclass.build.call(this)
                if (!this.inited) {
                    this.inited = true
                    var properties = this.getData().properties
                    var zoom = myMap.getZoom()
                    var element = this.getParentElement().getElementsByClassName("my-mark")[0]

                    myMap.events.add('boundschange', function () {
                        var currentZoom = myMap.getZoom()

                        if (currentZoom != zoom) {
                            zoom = currentZoom
                            if (zoom <= 17) {
                                properties.textVisible = "Invisible"
                            } else {
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
                balloonContentFooter: `<button type="button" value="${place.id}" id = "addToRoute" onClick="window.location.reload();">Добавить в маршрут</button>`,
                iconImageHref: placemarkIconsInactive[placeKey],
                iconCaption: place.properties.show_title,
                iconImageSize: chooseSize(place),
                textVisible: "Invisible",
                type: place.properties.type,
            },
            options: {
                iconLayout: IconLayoutClass,
                iconShape: {
                    type: "Circle",
                    coordinates: [0, 0],
                    radius: chooseSize(place)[0] + 5
                },
                iconImageHref: placemarkIconsInactive[placeKey],
                iconImageSize: chooseSize(place),
                hideIconOnBalloonOpen: false,
            }
        })
    }

    objectManager.setFilter(function (object) {
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
        } else if (e.get('type') == 'balloonclose') {
            objectManager.objects.setObjectOptions(objectId, {
                iconImageHref: placemarkIconsInactive[objectId],
                iconImageSize: [25, 35]
            })
        }


    }

    objectManager.objects.events.add(['balloonopen', 'balloonclose'], onObjectEvent);

    var zoom = myMap.getZoom();
    myMap.events.add('boundschange', function (e) {
        var old = e.get('oldZoom')
        var nw = e.get('newZoom')
        if (old != nw) {

            if (nw <= 16) {
                objectManager.setFilter(function (object) {
                    return tierOneCategories.includes(object.properties.type)
                })
            }
            if (nw == 17) {
                objectManager.setFilter(function (object) {
                    return tierTwoCategories.includes(object.properties.type)
                })
            }
            if (nw >= 18) {
                objectManager.setFilter(function (object) {
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

    myMap.geoObjects.add(multiRoute)

    myMap.controls.remove("trafficControl")
    myMap.controls.remove("fullscreenControl")
    myMap.controls.remove("typeSelector")
    myMap.controls.remove("rulerControl")
    myMap.controls.remove("searchControl")
}

function chooseSize(placeObj) {
    if (placeObj.properties.type == "Павильон") {
        return [25, 35]
    }
    return [15, 25]
}
