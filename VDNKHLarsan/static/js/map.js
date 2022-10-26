

var myMap;



ymaps.ready(init);

function init () {

    myMap = new ymaps.Map('map', {
        center: [55.832135, 37.628041],
        zoom: 14,
        // controls: ['smallMapDefaultSet']
    },
        // {
        // restrictMapArea: [
        //     // [55.822535, 37.609675],
        //     // [55.843460, 37.642077]
        // ]},
        {
        searchControlProvider: 'yandex#search'}
    );


    for (var place in Object.values(places)) {
        console.log(place.geometry.coordinates.reverse())


    }

    // foreach(places, (index, place) => {
    //     console.log(place.geometry.coordinates.reverse())
    //     myMap.geoObjects.add(new ymaps.Placemark(place.geometry.coordinates.reverse(),{
    //         balloonContentHeader: "Балун метки",
    //         balloonContentBody: "Содержимое <em>балуна</em> метки",
    //         balloonContentFooter: "Подвал",
    //         hintContent: "Хинт метки"
    //     }))
    // })



    myMap.controls.remove("trafficControl")
    myMap.controls.remove("fullscreenControl")
    myMap.controls.remove("typeSelector")
    myMap.controls.remove("rulerControl")


}