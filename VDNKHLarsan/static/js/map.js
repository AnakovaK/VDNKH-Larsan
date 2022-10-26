var myMap;
var ADDRESS_PREFIX = "http://vdnh.ru/";


ymaps.ready(init);

function init () {

    myMap = new ymaps.Map('map', {
        center: [55.832135, 37.628041],
        zoom: 15    ,
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

     MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>')


    places["280"].properties.pic
    placeKeys = Object.keys(places)
    for (var placeKey in placeKeys) {
            var place = places[parseInt(placeKeys[placeKey])]
            console.log(place.geometry.coordinates)
            myMap.geoObjects.add(new ymaps.Placemark(place.geometry.coordinates.reverse(),{
             balloonContentHeader: '',
             balloonContentBody: "Содержимое <em>балуна</em> метки",
             balloonContentFooter: "Подвал",
             hintContent: "Хинт метки"
         },{
                 iconLayout: 'default#imageWithContent',
                 iconImageHref: "static/img/icons/" + place.properties.icon + ".svg",
                 iconImageSize: [30, 42],
                 iconImageOffset: [0, 0]

            }))

    }



    myMap.controls.remove("trafficControl")
    myMap.controls.remove("fullscreenControl")
    myMap.controls.remove("typeSelector")
    myMap.controls.remove("rulerControl")


}