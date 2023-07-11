var cityBtnEl = $(".city-btn");
var cityNameEl = $(".city-name");
var searchBtnEl = $(".search-btn");
var tempEl = $(".temp");
var windEl = $(".wind");
var humidEl = $(".humidity");
var btnParentEl = $(".btn-parent");
var btnArray = [];
var weatherIconEl = $(".weather-icon");
var cardEl = $(".card-body");
var today = dayjs();
var keys = Object.keys(localStorage);


function init() {
    for (i = 0; i < keys.length; i++) {
        var cityName = keys[i];
        var cityBtn = $('<button>').text(cityName);
        cityBtn.addClass("btn btn-secondary city-btn");
        btnArray.push(cityName);
        btnParentEl.append(cityBtn);
    }

    fetch("https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=philadelphia&appid=8f16a31f99dc771501735a0303359ecc")
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            showWeather(data);
        })
}
//function to handle click
function handleClick(cityName) {
    fetch(buildURL(cityName))
        .then(function (response) {
            if (!response.ok) {
                alert("Geolocation not found");
            }
            return response.json();
        })
        .then(function (data) {
            showWeather(data);
        });
}

//function to handle search
function handleSearch(cityName) {

    fetch(buildURL(cityName))
        .then(function (response) {
            if (!response.ok) {
                alert("Geolocation not found");
            } else {
                localStorage.setItem(cityName, cityName);

                if (btnArray.includes(cityName) === false) {
                    console.log(btnArray);
                    var cityBtn = $('<button>').text(cityName);
                    cityBtn.addClass("btn btn-secondary city-btn");
                    btnArray.push(cityName);
                    btnParentEl.append(cityBtn);
                }

            } 
            
            return response.json();
        }).then(function (data) {
            showWeather(data);
        });
}
//function to show weather data
function showWeather(weatherData) {
    var cityName = weatherData.city.name;
    var degrees = weatherData.list[0].main.temp;
    var windSpeed = weatherData.list[0].wind.speed;
    var humidity = weatherData.list[0].main.humidity;
    var weatherIcon = weatherData.list[0].weather[0].icon;
    var iconURL = 'http://openweathermap.org/img/w/' + weatherIcon + '.png';

    $('#wicon').attr('src', iconURL);

    cityNameEl.text(cityName + " " + today.format("MM/DD/YYYY"));
    tempEl.text("Temperature: " + degrees + "°F");
    windEl.text("Wind Speed: " + windSpeed + "mph");
    humidEl.text("Humidity: " + humidity + "%");

    var cnt = 7; //40 list objects, 5 days, every 8 indexes is a new day. start at 7 bc index 0 is up above already
    var dayCnt = 1
    $(cardEl).each(function () {
        var newDay = today.add(dayCnt, 'day');
        degrees = weatherData.list[cnt].main.temp;
        windSpeed = weatherData.list[cnt].wind.speed;
        humidity = weatherData.list[cnt].main.humidity;
        weatherIcon = weatherData.list[cnt].weather[0].icon;
        iconURL = 'http://openweathermap.org/img/w/' + weatherIcon + '.png';

        $(this).find(".card-title").text(newDay.format("MM/DD/YYYY"));
        $(this).find(tempEl).text("Temperature: " + degrees + "°F");
        $(this).find(windEl).text("Wind: " + windSpeed + "mph");
        $(this).find(humidEl).text("Humidity: " + humidity + "%");
        $(this).find('#wicon').attr('src', iconURL);
        cnt += 8;
        dayCnt += 1;
    })
}
//builds the URL depending on if its the first load up or not
function buildURL(cityName) {
    var weatherURL = new URL("https://api.openweathermap.org/data/2.5/forecast?units=imperial");
    var params = new URLSearchParams(weatherURL.search);
    params.append("q", cityName);
    params.append("appid", '8f16a31f99dc771501735a0303359ecc');
    weatherURL.search = params.toString();
    return weatherURL;
}

init();//call on my initializer function

//event listener for search button
searchBtnEl.on('click', function () {
    var searchVal = $('.search-box').val().toLowerCase(); //extracts text from search box and makes it lower case to be consistent
    var cityNameArray = searchVal.split(""); //splits the word up so i can extract the first letter
    cityNameArray[0] = cityNameArray[0].toUpperCase(); //makes the first letter upper case
    var cityName = cityNameArray.join(""); //joins the word back together with no commas in between the letters
    handleSearch(cityName); //sends new word to handleSearch function
})
//event listener for city buttons
btnParentEl.on('click', ".city-btn", function () {
    cityName = $(this).text(); //gets the text content inside the button clicked
    handleClick(cityName);
})