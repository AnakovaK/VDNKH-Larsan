ymaps.ready(['Heatmap']).then(function init() {
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

    var myMap = new ymaps.Map('map', {
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
    myMap.setType(myMapType)

    var date = new Date();
    var todayDate = date.getDate().toString().padStart(2, "0")
    var formatedDate = `${todayDate}.${date.getMonth()}.${date.getFullYear()}`
    var time = date.getHours()
    if (time < 10 || time > 22) {
        time = 0
    }

    var data = []
    for (var building of congestion) {
        if (building != null) {
            data.push({
                type: 'Feature',
                id: building.ObjectName,
                geometry: {
                    type: 'Point',
                    coordinates: [building.Latitude, building.Longitude]
                },
                properties: {
                    weight: building[formatedDate] / congestion[0][formatedDate] * time
                }
            })
        }
    }

    var heatmap = new ymaps.Heatmap(data, {
        radius: 27,
        opacity: 0.8,
        dissipating: false,
        intensityOfMidpoint: 0.2,
        gradient: {
            0.1: 'rgba(128, 255, 0, 0.7)',
            0.2: 'rgba(255, 255, 0, 0.8)',
            0.7: 'rgba(234, 72, 58, 0.9)',
            1.0: 'rgba(162, 36, 25, 1)'
        }
    })
    heatmap.setMap(myMap)
})