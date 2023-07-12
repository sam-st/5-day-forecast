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
var today = dayjs(); //used this to display the date in a certain format.
var keys = Object.keys(localStorage); //gets all the keys from my local storage


function init() {
    for (i = 0; i < keys.length; i++) { //iterates through the keys
        var cityName = keys[i]; //sets cityName to the key value
        var cityBtn = $('<button>').text(cityName); //makes a button with cityName as the text content
        cityBtn.addClass("btn btn-secondary city-btn"); //adds classes to buttons
        btnArray.push(cityName); //adds cityName to array to check for repetition later
        btnParentEl.append(cityBtn); //apends to parent element
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
function handleSearch(cityName) { //retrieves city name from search bar

    fetch(buildURL(cityName))
        .then(function (response) {
            if (!response.ok) {
                alert("Geolocation not found"); //alert if a non existant city is entered
            } else {
                localStorage.setItem(cityName, cityName); //adds existing city to local storage to have premade buttons on refresh.

                if (btnArray.includes(cityName) === false) { //checks to see if the array already includes the city name I searched
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

    $('#wicon').attr('src', iconURL); //adds the icon code URL to the HTML element that will display the image.

    cityNameEl.text(cityName + " " + today.format("MM/DD/YYYY")); //displays the date in a certain format that i like.
    tempEl.text("Temperature: " + degrees + "°F");
    windEl.text("Wind Speed: " + windSpeed + "mph");
    humidEl.text("Humidity: " + humidity + "%");

    var cnt = 7; //weatherData.list is a 40 object array. info for every 3 hours for 5 days. 40/5 = 8. another way to find out to 
    //increment by 8 is to do 24/3 = 8. (24 hours, info for every 3 hours. 1 day is 8 objects). start at 7 because its the 8th index.

    var dayCnt = 1; //starting at one because i have the current date info above and I want to make a 5 day forecast for the next 5 days.

    //below is how .add() works in dayJS. the date attached to my today variable, even though I would add one to it
    //would remain the same value, so I had to make a counter variable that added an additional day each time to my today
    //variable upon an iteration of the loop.
    //------------------------------------------
    //const a = dayjs()  
    //const b = a.add(7, 'day')
    // a -> the original value and will not change
    // b -> the manipulation result

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
        cnt += 8; //go to next day for OpenWeatherAPI
        dayCnt += 1; //go to next day, but different API
    })
}

//builds the URL. I made it a function because it became repetitive to add search parameters every time. makes code neater too in my opinon
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
    var cityNameArray = searchVal.split(" "); //makes the array, even if the city name is just one word.
    var cityName ="";
    var wordArray;

    //i made this because I wanted uniformity on the previous search buttons regardless of what the user types.
    for(i=0; i<cityNameArray.length; i++){ //handles if the city has mulitple words in it (San Diego, Los Angeles, etc.)
        wordArray = cityNameArray[i].split(""); //splits the word up into individual letters
        wordArray[0]= wordArray[0].toUpperCase(); //makes the first letter of the word uppercase
        cityName = cityName+ wordArray.join("") +" "; //string builder to put the city name back together
    }

    handleSearch(cityName); //sends new (formatted) word to handleSearch function
})

//event listener for city buttons
btnParentEl.on('click', ".city-btn", function () {
    cityName = $(this).text(); //gets the text content inside the button clicked
    handleClick(cityName);
})