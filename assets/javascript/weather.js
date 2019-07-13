
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


$('#submit').on('click', function (event) {
    event.preventDefault();
    let queryCity = $('#search').val().trim();
    let weatherQuery = 'https://api.openweathermap.org/data/2.5/forecast?q=' + queryCity + '&units=imperial&appid=338262b3fa00c9266be3386ca9f0c86d';
$.ajax({ url: weatherQuery, method: 'GET' }).then(function (response) {
        console.log(response);
        let curDay = new Date(response.list[0].dt*1000);
        let curIndex = 0;
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
        console.log(days)
    });
    displayWeather();
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
        let dayName = $('<h3>');
        dayName.text(currentArr[0].day)
        let tempInfo = $('<div>');
        let dayMax = $('<p>');
        dayMax.text(maxMax);
        let dayMin = $('<p>');
        dayMin.text(minMin);
        let dayDescr = $('<div>');

        for (k = 0; k < descriptions.length; k++) {
            let descript = $('<p>');
            descript.text(descriptions[k]);
            dayDescr.append(descript);
        }

        tempInfo.append(dayMax);
        tempInfo.append(dayMin);

        dayInfo.append(dayName);
        dayInfo.append(tempInfo);
        dayInfo.append(dayDescr);

        console.log(dayInfo);
        $('#weather').append(dayInfo);
    }
}

