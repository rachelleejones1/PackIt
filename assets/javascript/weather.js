let days = [];

class WeatherDate {
    constructor(max, min, mainDescription, specificDescription, day) {
        this.max = max;
        this.min = min;
        this.mainDescription = mainDescription;
        this.specificDescription = specificDescription;
        this.day = day;
    }
}


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
});


/*
continue working on weather api call, display results attractively 
somehow get 
*/