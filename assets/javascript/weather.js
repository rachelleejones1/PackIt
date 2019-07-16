
class WeatherDate {
    constructor(max, min, mainDescription, specificDescription, day) {
        this.max = max;
        this.min = min;
        this.mainDescription = mainDescription;
        this.specificDescription = specificDescription;
        this.day = day;
    }
}


let days = [];
let webcamLocation = []


$('#submit').on('click', function (event) {
    event.preventDefault();
    let queryCity = $('#search').val().trim();
    let weatherQuery = 'https://api.openweathermap.org/data/2.5/forecast?q=' + queryCity + '&units=imperial&appid=338262b3fa00c9266be3386ca9f0c86d';
$.ajax({ url: weatherQuery, method: 'GET' }).then(function (response) {
        console.log(response);
        let curDay = new Date(response.list[0].dt*1000);
        let curIndex = 0;
        let lat = response.city.coord.lat;
        console.log(lat);
        let lng = response.city.coord.lon;
        console.log(lng);
        for (i = 0; i < response.cnt; i++) {
            let day = new Date(response.list[i].dt*1000);
            if (day.getDate() != curDay.getDate()) {
                curIndex++;
            }
            curDay = day;

            if (days.length <= curIndex) {
                days.push([]);
            }

            days[curIndex].push(new WeatherDate(
                response.list[i].main.temp_max,
                response.list[i].main.temp_min,
                response.list[i].weather[0].main,
                response.list[i].weather[0].description,
                day));
        }
        console.log(days);
        webcamLocation.push(lat);
        webcamLocation.push(lng);
        displayWeather();
        webcamSearch();
    });
    
});

function displayWeather () {
    for (i = 0; i < days.length; i++) {
        let maxMax = -1000;
        let minMin = 1000;
        let currentArr = days[i];
        let descriptions = [];
        for (j = 0; j < currentArr.length; j++) {
            if (currentArr[j].max > maxMax) {
                maxMax = currentArr[j].max;
            }
            if (currentArr[j].min < minMin) {
                minMin = currentArr[j].min;
            }
            if (descriptions.includes(currentArr[j].specificDescription) === false) {
                descriptions.push(currentArr[j].specificDescription);
            }

        }
        let dayInfo = $('<div>');
        dayInfo.addClass('weatherSection');
        let dayName = $('<h3>');
        dayName.addClass('weatherDay');
        let dateInfo = currentArr[0].day;
        let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let dayOfWeek = daysOfWeek[dateInfo.getDay()];
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let month = months[dateInfo.getMonth()];
        let dayNum = dateInfo.getDate();
        dayName.html(dayOfWeek+ '<br>' + month + ' ' + dayNum);
        let tempInfo = $('<div>');
        let dayMax = $('<p>');
        dayMax.html('High: ' + maxMax + '&#176;F');
        let dayMin = $('<p>');
        dayMin.html('Low: ' + minMin + '&#176;F');
        let dayDescr = $('<div>');
        let descript = $('<div>');

        if (descriptions[0] === 'clear sky') {
            descript.html('<img src="assets/images/ClearSky.svg" class="weatherIcon" alt="clear sky icon"/><p>Clear Sky</p>')
        } else if (descriptions[0] === 'few clouds') {
            descript.html('<img src="assets/images/FewClouds.svg" class="weatherIcon" alt="few clouds icon"/><p>Few Clouds</p>')
        } else if (descriptions[0] === 'scattered clouds') {
            descript.html('<img src="assets/images/ScatteredClouds.svg" class="weatherIcon" alt="scattered clouds icon"/><p>Scattered Clouds</p>')
        } else if (descriptions[0] === 'broken clouds' || descriptions[0] === 'overcast clouds') {
            descript.html('<img src="assets/images/BrokenClouds.svg" class="weatherIcon" alt="broken clouds icon"/><p class="sentenceCase">' + descriptions[0] + '</p>')
        } else if (descriptions[0] === 'shower rain' || descriptions[0] === 'light rain') {
            descript.html('<img src="assets/images/Showers.svg" class="weatherIcon" alt="shower rain icon"/><p class="sentenceCase">' + descriptions[0] + '</p>')
        } else if (descriptions[0] === 'rain') {
            descript.html('<img src="assets/images/Rain.svg" class="weatherIcon" alt="rain icon"/><p>Rain</p>')
        } else if (descriptions[0] === 'thunderstorm') {
            descript.html('<img src="assets/images/Thunderstorm.svg" class="weatherIcon" alt="thunderstorm icon"/><p>Thunderstorms</p>')
        } else if (descriptions[0] === 'snow') {
            descript.html('<img src="assets/images/Snow.svg" class="weatherIcon" alt="snow icon"/><p>Snow</p>')
        } else if (descriptions[0] === 'mist') {
            descript.html('<img src="assets/images/Mist.svg" class="weatherIcon" alt="mist icon"/><p>Mist</p>')
        }    else {
            descript.html('<p class="sentenceCase">' + descriptions[0] + '</p>');
        }

        dayDescr.append(descript);

        /*for (k = 0; k < descriptions.length; k++) {
            let descript = $('<div>');
            if (descriptions[k] === 'clear sky') {
                descript.append('<img src="assets/images/ClearSky.svg" class="weatherIcon" alt="clear sky icon"/><p>Clear Sky</p>')
            } else if (descriptions[k] === 'few clouds') {
                descript.append('<img src="assets/images/FewClouds.svg" class="weatherIcon" alt="few clouds icon"/><p>Few Clouds</p>')
            } else if (descriptions[k] === 'scattered clouds') {
                descript.append('<img src="assets/images/ScatteredClouds.svg" class="weatherIcon" alt="scattered clouds icon"/><p>Scattered Clouds</p>')
            } else if (descriptions[k] === 'broken clouds') {
                descript.append('<img src="assets/images/BrokenClouds.svg" class="weatherIcon" alt="broken clouds icon"/><p>Broken Clouds</p>')
            } else if (descriptions[k] === 'shower rain' || descriptions[k] === 'light rain') {
                descript.append('<img src="assets/images/Showers.svg" class="weatherIcon" alt="shower rain icon"/><p class="sentenceCase">' + descriptions[k] + '</p>')
            } else if (descriptions[k] === 'rain') {
                descript.append('<img src="assets/images/Rain.svg" class="weatherIcon" alt="rain icon"/><p>Rain</p>')
            } else if (descriptions[k] === 'thunderstorm') {
                descript.append('<img src="assets/images/Thunderstorm.svg" class="weatherIcon" alt="thunderstorm icon"/><p>Thunderstorms</p>')
            } else if (descriptions[k] === 'snow') {
                descript.append('<img src="assets/images/Snow.svg" class="weatherIcon" alt="snow icon"/><p>Snow</p>')
            } else if (descriptions[k] === 'mist') {
                descript.append('<img src="assets/images/Mist.svg" class="weatherIcon" alt="mist icon"/><p>Mist</p>')
            }    else {
                descript.append('<p>' + descriptions[k] + '</p>');
            }
            dayDescr.append(descript);
        }*/

        tempInfo.append(dayMax);
        tempInfo.append(dayMin);

        dayInfo.append(dayName);
        dayInfo.append(tempInfo);
        dayInfo.append(dayDescr);

        console.log(dayInfo);
        $('#weather').append(dayInfo);
    }
}

function webcamSearch() {
    console.log('blue');
    let queryLat = webcamLocation[0];
    console.log(queryLat);
    let queryLng = webcamLocation[1];
    console.log(queryLng);
    let queryURL = "https://webcamstravel.p.rapidapi.com/webcams/list/nearby=" + queryLat + "," + queryLng + ",250" + "?show=webcams:image,player";
    $.ajax({
        headers: {
            "X-RapidAPI-Host": "webcamstravel.p.rapidapi.com",
            "X-RapidAPI-Key": "27c7e87c7dmshda62b4854259734p18e751jsn4a9528e072f1",
            },
        data:"data",
        method: "GET",
        url: queryURL,
        success: function(response){
            console.log(response);
            $("#webcam").html('');
            for (var i=0; i<4; i++){
                var webcam = response.result.webcams[i].image.daylight.preview;
                $("#webcam").append("<img src='" + webcam +"'>");
           }
        },
        error: function() {
            $('#webcam').append('<p>An error occurred when calling the Webcams Travel API. It\'s possible there are no webcams near your destination.</p>');
        }
    })
}