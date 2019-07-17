let toDoArray = [];
let keyNames = [];

let days = [];
let webcamLocation = [];
let averageMax;
let averageMin;




class WeatherDate {
    constructor(max, min, mainDescription, specificDescription, day) {
        this.max = max;
        this.min = min;
        this.mainDescription = mainDescription;
        this.specificDescription = specificDescription;
        this.day = day;
    }
}


$(document).ready(function () {
    let firebaseConfig = {
        apiKey: "AIzaSyCUcH5ibC9EUc2JBDfS8zprT9ccnOgxRhk",
        authDomain: "pack-your-bag-project.firebaseapp.com",
        databaseURL: "https://pack-your-bag-project.firebaseio.com",
        projectId: "pack-your-bag-project",
        storageBucket: "",
        messagingSenderId: "604698367094",
        appId: "1:604698367094:web:a6470ea0bcfd991e"
    };

    firebase.initializeApp(firebaseConfig);

    let database = firebase.database().ref('items');


    /*
     let ui = new firebaseui.auth.AuthUI(firebase.auth());
 
     $('#newAccount').on('click', function(event) {
         event.preventDefault();
         ui.start('#firebaseui-auth-container', {
             signInOptions: [
               firebase.auth.EmailAuthProvider.PROVIDER_ID
             ],
             callbacks: {
                 signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                   // User successfully signed in.
                   // Return type determines whether we continue the redirect automatically
                   // or whether we leave that to developer to handle.
                   console.log(authResult);
                   console.log('signed in')
                   $('.modal').modal('close');
                   return false;
                 },
                 uiShown: function() {
                   // The widget is rendered.
                   // Hide the loader.
                   // document.getElementById('loader').style.display = 'none';
                 }
               },
           });
     })
 
     $('#signOut').on('click', function(event) {
         event.preventDefault();
         firebase.auth().signOut().then(function() {
             // Sign-out successful.
             console.log('signed out')
           }).catch(function(error) {
             // An error happened.
             console.log('error while signing out');
           });
     })
     */

     $('#newSearch').on('click', function(event) {
        event.preventDefault();
        //if user is logged in then keep their saved list and display that, possibly let them choose which list? 
        $('#userInputs').attr('class', 'display');
        $('#results').attr('class', 'displayNone');
        toDoArray = [];
        keyNames = [];
        days = [];
        webcamLocation = [];
        console.log(toDoArray);
        $('#displayList').html('');
        $('#weather').html('');
        $("#webcam").html('');
        $('#duration').val('');
        $('#search').val('');
        $('#destName').html('');
        database.remove();
     });


    $('#submit').on('click', function(event) {
        event.preventDefault();
        $('#userInputs').attr('class', 'displayNone');
        let duration = $('#duration').val().trim();
        let queryCity = $('#search').val().trim();
        $('#destName').html(queryCity);
        let weatherQuery = 'https://api.openweathermap.org/data/2.5/forecast?q=' + queryCity + '&units=imperial&appid=338262b3fa00c9266be3386ca9f0c86d';
        $.ajax({ url: weatherQuery, method: 'GET' }).then(function (response) {
            console.log(response);
            let curDay = new Date(response.list[0].dt * 1000);
            let curIndex = 0;
            let lat = response.city.coord.lat;
            console.log(lat);
            let lng = response.city.coord.lon;
            let highSum = 0;
            let lowSum = 0;
            console.log(lng);
            for (let i = 0; i < response.cnt; i++) {
                let day = new Date(response.list[i].dt * 1000);
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
                highSum += response.list[i].main.temp_max;
                lowSum += response.list[i].main.temp_min;
            }
            averageMax = highSum / 40;
            if (averageMax > 65) {
                database.once('value', function(initial) {
                    let content = initial.val();
                    console.log(content);
                    console.log(duration);
                    if (content === null) {
                        let warmSuggestedItems = [`${duration} pairs of socks`, `${duration} pairs of underwear`, `${duration} pairs of shorts`, `${duration} warm weather shirts`, `${Math.round(duration / 2)} pajamas`, 'swimsuit', 'light jacket', 'sandals', 'tennis shoes', 'sunglasses', 'shampoo', 'conditioner', 'body wash', 'face soap', 'face lotion', 'hair product', 'hair brush', 'tooth brush', 'toothpaste', 'floss', 'medications', 'books', 'laptop', 'laptop charger', 'cell phone', 'cell phone charger'];
                        for (let i=0; i < warmSuggestedItems.length; i++) {
                            database.push(
                                warmSuggestedItems[i]
                            );
                        }
                    }
                });
            } else {
                database.once('value', function(initial) {
                    let content = initial.val();
                    console.log(content);
                    console.log(duration);
                    if (content === null) {
                        let coldSuggestedItems = [`${duration} pairs of socks`, `${duration} pairs of underwear`, `${duration} pairs of pants`, `${duration} shirts`, `${Math.round(duration / 2)} pajamas`, 'sweater', 'jacket', 'tennis shoes', 'shampoo', 'conditioner', 'body wash', 'face soap', 'face lotion', 'hair product', 'hair brush', 'tooth brush', 'toothpaste', 'floss', 'medications', 'books', 'laptop', 'laptop charger', 'cell phone', 'cell phone charger'];
                        for (let i=0; i < coldSuggestedItems.length; i++) {
                            database.push(
                                coldSuggestedItems[i]
                            );
                        }
                    }
                });
            }
            averageMin = lowSum / 40;
            console.log(days);
            webcamLocation.push(lat);
            webcamLocation.push(lng);
            displayWeather();
            webcamSearch();
        });
    });

    database.on('child_added', function(snap) {
        console.log(snap);
        let newItem = snap.val();
        console.log(newItem);
        let itemKey = snap.key;
        console.log(itemKey);
        keyNames.push(itemKey);
        toDoArray.push(newItem);
        displayItems(toDoArray);
    });

    $('#add-to-list').on('click', function(event) {
        event.preventDefault();
        let itemName = $("#add-this-item").val().trim();
        $('#add-this-item').val('');
        if (toDoArray.includes(itemName) === false) {
            database.push(
                itemName
            );
        }
    });

    $(document.body).on("click", ".deleteItem", function () {
        let toPackNumber = $(this).attr("data-to-do");
        database.child(keyNames[toPackNumber]).remove();
        toDoArray.splice(toPackNumber, 1);
        keyNames.splice(toPackNumber, 1);
        console.log(toDoArray);
        console.log(keyNames);
        displayItems(toDoArray);
    });

});

$('#sectionToggle').on('click', function(event) {
    event.preventDefault();
    if ($(this).attr('data-toggle') === 'closed') {
        $('#collapsibleSection').attr('class', 'displaySection');
        $('#toggleIcon').attr('src', 'assets/images/collapseSection.svg');
        $('#toggleIcon').attr('alt', 'collapse section arrow');
        $(this).attr('data-toggle', 'open');
    } else {
        $('#collapsibleSection').attr('class', 'displayNoneSmall');
        $('#toggleIcon').attr('src', 'assets/images/expandSection.svg');
        $('#toggleIcon').attr('alt', 'expand section arrow');        
        $(this).attr('data-toggle', 'closed');
    }
});



function displayItems(arr) {
    $('#displayList').html('');
    for (let j = 0; j < arr.length; j++) {
        let newLi = $('<li>').addClass('collection-item').attr('id', 'item-' + j);
        let checkboxContent = `<label><input type="checkbox" /><span>${arr[j]}</span></label>`;
        let button = $("<button>").attr({ "data-to-do": j, "class": "deleteItem" }).html('<i class="material-icons close">close</i>');
        button.addClass('waves-effect waves-light btn-small')
        newLi.append(checkboxContent);
        newLi.append(button);
        $('#displayList').append(newLi);
    }
}


function displayWeather() {
    $('#weather').html('');
    $('#weather').append(`<h4>Forecast</h4>`);
    for (let i = 0; i < days.length; i++) {
        let maxMax = -1000;
        let minMin = 1000;
        let currentArr = days[i];
        let descriptions = [];
        for (let j = 0; j < currentArr.length; j++) {
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
        let dayName = $('<h5>');
        dayName.addClass('weatherDay');
        let dateInfo = currentArr[0].day;
        let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let dayOfWeek = daysOfWeek[dateInfo.getDay()];
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let month = months[dateInfo.getMonth()];
        let dayNum = dateInfo.getDate();
        dayName.html(dayOfWeek + '<br>' + month + ' ' + dayNum);
        let tempInfo = $('<div>');
        let dayMax = $('<p>');
        dayMax.html('High: ' + maxMax + '&#176;F');
        let dayMin = $('<p>');
        dayMin.html('Low: ' + minMin + '&#176;F');
        let dayDescr = $('<div>');
        dayDescr.addClass('descrContainer');
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
        } else {
            descript.html('<p class="sentenceCase">' + descriptions[0] + '</p>');
        }

        dayDescr.append(descript);

        /*for (let k = 0; k < descriptions.length; k++) {
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
        data: "data",
        method: "GET",
        url: queryURL,
        success: function (response) {
            $("#webcam").html('');
            $("#webcam").append(`<h4>Click Images to View Live Webcams</h4>`);
            for (var i = 0; i < 6; i++) {
                var webcam = response.result.webcams[i].image.daylight.preview;
                var link = response.result.webcams[i].player.day.link;
                var newDiv = $("<div>");
                $(newDiv).append("<a href='" + link + "' target='_blank''><img src='" + webcam + "'></a>");
                $(newDiv).attr('id', 'web-img')
                $("#webcam").append(newDiv);
            }
            $('#results').attr('class', 'display');
        },
        error: function () {
            $('#webcam').append('<p>An error occurred when calling the Webcams Travel API. It\'s possible there are no webcams near your destination.</p>');
        }
    })
}





















/*

Flow: 
user puts in destination and duration of trip
calls weather api 
display weather info
if above 65 display warm packing list
if below then cold packing list
use coordinates returned from weather search in webcam api call
display webcams

on refresh if user is not logged in then delete all info from firebase -- if multiple users are using at same time this may be a problem if warm/cold packing list is in firebase root...

if user is logged in display their saved packing list --  what if they are going to destination that is cold/warm -- should they have two packing lists? thinking no...
    allow users to name packing list when saved and choose to display that packing list
    if user saves packing list store checked status somehow 
*/



