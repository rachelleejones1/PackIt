let toDoArray = [];
let dbKey = null;
let days = [];
let storedMax;
let storedDur;

class WeatherDate {
    constructor(max, min, mainDescription, specificDescription, day) {
        this.max = max;
        this.min = min;
        this.mainDescription = mainDescription;
        this.specificDescription = specificDescription;
        this.day = day;
    }
}

function displayNewList(arr) {
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

function chooseSuggestedList(averageMax, duration) {
    if (averageMax > 65) {
        toDoArray = [`${duration} pairs of socks`, `${duration} pairs of underwear`, `${duration} pairs of shorts`, `${duration} warm weather shirts`, `${Math.round(duration / 2)} pajamas`, 'swimsuit', 'light jacket', 'sandals', 'tennis shoes', 'sunglasses', 'shampoo', 'conditioner', 'body wash', 'face soap', 'face lotion', 'hair product', 'hair brush', 'tooth brush', 'toothpaste', 'floss', 'medications', 'books', 'laptop', 'laptop charger', 'cell phone', 'cell phone charger'];
        displayNewList(toDoArray);
    } else {
        toDoArray = [`${duration} pairs of socks`, `${duration} pairs of underwear`, `${duration} pairs of pants`, `${duration} shirts`, `${Math.round(duration / 2)} pajamas`, 'sweater', 'jacket', 'tennis shoes', 'shampoo', 'conditioner', 'body wash', 'face soap', 'face lotion', 'hair product', 'hair brush', 'tooth brush', 'toothpaste', 'floss', 'medications', 'books', 'laptop', 'laptop charger', 'cell phone', 'cell phone charger'];
        displayNewList(toDoArray);
    }
}

function addToLocalList() {
    let itemName = $("#add-this-item").val().trim();
    $('#add-this-item').val('');
    if (toDoArray.includes(itemName) === false) {
        toDoArray.push(itemName);
        displayNewList(toDoArray);
    }
}

function removeFromLocalList(listNumber) {
    toDoArray.splice(listNumber, 1);
    displayNewList(toDoArray)
}

function firebaseSignIn() {
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', {
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                $('.modal').modal('close');
                dbKey = authResult.user.uid;
                displaySavedUserList(dbKey);
                $('#userOptions').attr('class', 'displayFlex');
                $('#nonUserOptions').attr('class', 'displayNone');
                return false;
            },
            uiShown: function () {
            }
        },
    });
}

function firebaseSignOut() {
    firebase.auth().signOut().then(function () {
    }).catch(function (error) {
    });
}

function saveListToUser(userId, arr) {
    let databaseRoot = firebase.database();
    let userRef = databaseRoot.ref('users');
    userRef.child(userId).set({
        items: arr
    });
}

function displaySavedUserList(userId) {
    let databaseRoot = firebase.database();
    let userDir = databaseRoot.ref('users/' + userId);
    userDir.on('value', function (snap) {
        let response = snap.val();
        let savedList = response.items;
        toDoArray = savedList;
        displayNewList(toDoArray);
    });
};


function checkValid(search, queryCountry, duration) {
    let hasNumber = /\d/;
    if (search === "" || duration < 1) {
        $('#invalid-modal').modal('open');
    } else {
        if (hasNumber.test(search) === false) {
            callWeatherAPI(search, queryCountry, duration);
        } else {
            $('#invalid-modal').modal('open');
        }  
    }
}

function callWeatherAPI(queryCity, queryCountry, duration) {
    let weatherQuery = 'https://api.openweathermap.org/data/2.5/forecast?q=' + queryCity + ',' + queryCountry + '&units=imperial&appid=338262b3fa00c9266be3386ca9f0c86d';
    $.ajax({
        url: weatherQuery, method: 'GET', error: function () {
            $('#weatherError-modal').modal('open');
        }
    }).then(function (response) {
        $('#userInputs').attr('class', 'displayNone');
        $('#destName').html(queryCity);
        let curDay = new Date(response.list[0].dt * 1000);
        let curIndex = 0;
        let lat = response.city.coord.lat;
        let lng = response.city.coord.lon;
        let highSum = 0;
        let lowSum = 0;
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
        let averageMax = highSum / 40;
        storedMax = averageMax;
        storedDur = duration;
        let averageMin = lowSum / 40;
        if (dbKey === null) {
            chooseSuggestedList(averageMax, duration);
        } else {
            displaySavedUserList(dbKey);
        }
        displayWeather();
        webcamSearch(lat, lng);
    });
}

function clearPastSearch() {
    $('#userInputs').attr('class', 'display');
    $('#results').attr('class', 'displayNone');
    toDoArray = [];
    days = [];
    $('#displayList').html('');
    $('#weather').html('');
    $("#webcam").html('');
    $('#duration').val('');
    $('#search').val('');
    $('#destName').html('');
    $('#countryCode').val('');
    $('#countryCode').formSelect();
    $('.dropdown-trigger').css('color', 'rgba(0,0,0,0.3)');
}


function menuToggle(dataToggle) {
    if (dataToggle.attr('data-toggle') === 'closed') {
        $('#collapsibleSection').attr('class', 'displaySection');
        $('#toggleIcon').attr('src', 'assets/images/collapseSection.svg');
        $('#toggleIcon').attr('alt', 'collapse section arrow');
        dataToggle.attr('data-toggle', 'open');
    } else {
        $('#collapsibleSection').attr('class', 'displayNoneSmall');
        $('#toggleIcon').attr('src', 'assets/images/expandSection.svg');
        $('#toggleIcon').attr('alt', 'expand section arrow');
        dataToggle.attr('data-toggle', 'closed');
    }
}

function changeSelectFontColor() {
    $('.dropdown-trigger').css('color', 'rgba(0,0,0,0.87)');
}

function webcamSearch(queryLat, queryLng) {
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
            for (let i = 0; i < Math.min(6, response.result.webcams.length); i++) {
                let webcam = response.result.webcams[i].image.daylight.preview;
                let link = response.result.webcams[i].player.day.link;
                let newDiv = $("<div>");
                $(newDiv).append("<a href='" + link + "' target='_blank''><img src='" + webcam + "'></a>");
                $(newDiv).attr('id', 'web-img')
                $("#webcam").append(newDiv);
            }
            $('#results').attr('class', 'display');
            if (response.result.webcams.length === 0) {
                $("#webcam").html('');
                $('#webcam').append('<h4>There are no webcams near your destination.</h4>');

            }
        },
        error: function () {
            $('#webcam').append('<p>An error occurred when calling the Webcams Travel API. It\'s possible there are no webcams near your destination.</p>');
        }
    })
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
        } else if (descriptions[0] === 'rain' || descriptions[0] === 'moderate rain' || descriptions[0] === 'heavy intensity rain') {
            descript.html('<img src="assets/images/Rain.svg" class="weatherIcon" alt="rain icon"/><p class="sentenceCase">' + descriptions[0] + '</p>')
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
        tempInfo.append(dayMax);
        tempInfo.append(dayMin);
        dayInfo.append(dayName);
        dayInfo.append(tempInfo);
        dayInfo.append(dayDescr);
        $('#weather').append(dayInfo);
    }
}


$(document).ready(function () {
    $('.parallax').parallax();
    $('select').formSelect();
    $('.modal').modal();


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

    $('#signIn').on('click', function (event) {
        event.preventDefault();
        firebaseSignIn();
    });

    $('#signOut').on('click', function (event) {
        event.preventDefault();
        firebaseSignOut();
        $('#userOptions').attr('class', 'userOnly');
        $('#nonUserOptions').attr('class', 'signInButtons');
        chooseSuggestedList(storedMax, storedDur);
    });

    $('.select-wrapper').on('click', function() {
        changeSelectFontColor();
    });

    $('#saveList').on('click', function (event) {
        event.preventDefault();
        saveListToUser(dbKey, toDoArray);
    })

    $('#submit').on('click', function (event) {
        event.preventDefault();
        checkValid($('#search').val().trim(), $('#countryCode').val(), $('#duration').val().trim());
    });

    $('#newSearch').on('click', function(event) {
        event.preventDefault();
        clearPastSearch();
    })

    $('#add-to-list').on('click', function (event) {
        event.preventDefault();
        addToLocalList();
    });

    $(document.body).on('click', '.deleteItem', function (event) {
        event.preventDefault();
        removeFromLocalList($(this).attr("data-to-do"));
    });

    $('#sectionToggle').on('click', function (event) {
        event.preventDefault();
        menuToggle($(this))
    });
});


