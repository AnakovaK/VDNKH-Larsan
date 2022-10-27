var myMap;
var ADDRESS_PREFIX = "http://vdnh.ru/";
var placemarks = [];
var placemarkIconsInactive = [];
var placemarkIconsActive = [];

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

    placeKeys = Object.keys(places)
    for (var placeKey in placeKeys) {
            var place = places[parseInt(placeKeys[placeKey])]
            placemarkIconsInactive[placeKey] = "static/img/icons/inactive/" + place.properties.icon + ".svg"
            placemarkIconsActive[placeKey] = "static/img/icons/active/" + place.properties.icon + "-active.svg"
            placemarkToAdd = new ymaps.Placemark(place.geometry.coordinates.reverse(),{
                balloonContentHeader: '',
                balloonContentBody: "Содержимое <em>балуна</em> метки",
                balloonContentFooter: "Подвал",
                hintContent: "Хинт метки",

            },{
                iconLayout: 'default#image',
                iconImageHref: placemarkIconsInactive[placeKey],
                iconImageSize: [25, 35],
                hideIconOnBalloonOpen: false,

            })
            myMap.geoObjects.add(placemarkToAdd);
            placemarks[placeKey] = placemarkToAdd;

    }
     for (let i = 0; i < placemarks.length; i++) {
         placemarks[i].events
                 .add('balloonopen', function (e){
                     e.get('target').options.set('iconImageHref', placemarkIconsActive[i]);
                     e.get('target').options.set('iconImageSize', [35, 45]);
                     console.log(places[parseInt(placeKeys[i])].geometry.coordinates.reverse())
                     myMap.setCenter(places[parseInt(placeKeys[i])].geometry.coordinates.reverse(), 17, {
                         duration: 400
                     })

                 })
                 .add('balloonclose', function (e){
                     e.get('target').options.set('iconImageHref', placemarkIconsInactive[i]);
                     e.get('target').options.set('iconImageSize', [25, 35]);
                     myMap.setCenter([55.832135, 37.628041], 15, {
                         duration: 300
                     })
                 })
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
