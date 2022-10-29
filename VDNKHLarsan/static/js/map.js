var myMap;
var ADDRESS_PREFIX = "http://vdnh.ru/";
var placemarks = [];
var placemarkIconsInactive = [];
var placemarkIconsActive = [];
var listBoxItems = [];

ymaps.ready(init);

function init () {

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
             [55.822535, 37.609675],
             [55.843460, 37.642077]
        ]},
        {
        searchControlProvider: 'yandex#search'}
    );

    myMap.setType(myMapType);

    objectManager = new ymaps.ObjectManager({})

    placeKeys = Object.keys(places)
    cnt = 0;
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
                    balloonContentHeader: place.properties.type_s1,
                    balloonContentBody: "Содержимое <em>балуна</em> метки",
                    balloonContentFooter: "Подвал",
                    hintContent: place.properties.icon,
                },
                options: {
                    iconLayout: 'default#image',
                    iconImageHref: placemarkIconsInactive[placeKey],
                    iconImageSize: [25, 35],
                    hideIconOnBalloonOpen: false,
                }
            })


    }

    myMap.geoObjects.add(objectManager)
    console.log(objectManager)

    function onObjectEvent (e){
         var objectId = e.get('objectId');
         console.log(places[parseInt(placeKeys[objectId])].geometry.coordinates.reverse())
         if (e.get('type') == 'balloonopen'){
              objectManager.objects.setObjectOptions(objectId, {
                  iconImageHref: placemarkIconsActive[objectId],
                  iconImageSize: [35, 45]
              })
             myMap.setCenter(places[parseInt(placeKeys[objectId])].geometry.coordinates.reverse(), 17, {
                 duration: 400
             })
         }
         else if (e.get('type') == 'balloonclose'){
              objectManager.objects.setObjectOptions(objectId, {
                  iconImageHref: placemarkIconsInactive[objectId],
                  iconImageSize: [25, 35]
              })
             myMap.setCenter([55.832135, 37.628041], 15, {
                 duration: 300
             })
         }


}
    console.log(listBoxItems)

    objectManager.objects.events.add(['balloonopen', 'balloonclose'], onObjectEvent);

    listBoxItems = ['Павильон', 'Въезд', 'Еда', 'Развлечения', 'Музей']
            .map(function (title) {
                return new ymaps.control.ListBoxItem({
                    data: {
                        content: title
                    },
                    state: {
                        selected: true
                    }
                })
            }),
        reducer = function (filters, filter) {
            filters[filter.data.get('content')] = filter.isSelected();
            return filters;
        },
        // Теперь создадим список, содержащий 5 пунктов.
        listBoxControl = new ymaps.control.ListBox({
            data: {
                content: 'Фильтр',
                title: 'Фильтр'
            },
            items: listBoxItems,
            state: {
                // Признак, развернут ли список.
                expanded: true,
                filters: listBoxItems.reduce(reducer, {})
            }
        });
    myMap.controls.add(listBoxControl);

    // Добавим отслеживание изменения признака, выбран ли пункт списка.
    listBoxControl.events.add(['select', 'deselect'], function (e) {
        var listBoxItem = e.get('target');
        var filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
        filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
        listBoxControl.state.set('filters', filters);
    });

    var filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', function (filters) {
        // Применим фильтр.
        objectManager.setFilter(getFilterFunction(filters));
    });

    function getFilterFunction(categories) {
        return function (obj) {
            var content = obj.properties.balloonContentHeader;
                return categories[content]
        }
    }


    myMap.controls.remove("trafficControl")
    myMap.controls.remove("fullscreenControl")
    myMap.controls.remove("typeSelector")
    myMap.controls.remove("rulerControl")


}


