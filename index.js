const dayToday = moment().format("MMM Do");
const dayTodayName = moment().format("dddd");
const currentTime = moment().format("h:mm:ss a");
const days = [];

let daysRequired = 7;

for (let i = 1; i <= daysRequired; i++) {
  days.push(moment().add(i, "days").format("dddd"));
}

window.addEventListener("load", function () {
  weather.fetchMapBox("denizli");
});

let weather = {
  openWeatherKey: "process.env.OPEN_WEATHER_KEY",
  mapBoxKey:
    "process.env.MAX_BOX_KEY",
  fetchMapBox: function (city, state = null) {
    fetch(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        city +
        ".json?access_token=" +
        this.mapBoxKey
    )
      .then((response) => response.json())
      .then((data) => {
        this.getGeoCoding(data, state);
      })
      .catch(err => console.log(err))
  },
  getGeoCoding: function (data, state) {
    const { features } = data;
    const lat = features[0].center[1];
    const lon = features[0].center[0];
    const place_name = features[0].place_name;

    this.fetchWeater(lat, lon, place_name, state);
  },
  fetchWeater: function (lat, lon, place_name, state) {
    fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=current,hourly,minutely,alerts&units=metric&appid=" +
        this.openWeatherKey
    )
      .then((responseNext) => responseNext.json())
      .then((dataNext) => this.displayWeather(dataNext, place_name, state))
      .catch(err => console.log(err));
  },
  displayWeather: function (dataNext, place_name, state) {
    const { daily } = dataNext;
    for (let i = 0; i < 8; i++) {
      // todo: get the TODAY weather forecast
      if (i == 0) {
        const { icon, description, main } = dataNext.daily[i].weather[0];
        const { min, max } = dataNext.daily[i].temp;
        const { humidity } = dataNext.daily[i];
        const { clouds } = dataNext.daily[i];
        const { wind_speed } = dataNext.daily[i];

        setIcon(icon, "today");
        setBackground(main);

        document.querySelector(
          ".left-side .general-info .date-div .date-info h3"
        ).innerHTML = dayTodayName.substring(0, 3) + ", " + dayToday;
        document.querySelector(
          ".left-side .general-info .date-div .date-info h2"
        ).innerHTML = "Today";

        document.querySelector(".img-div h2").innerHTML = main;
        document.querySelector(
          ".left-side .general-info .desciption"
        ).innerHTML = description;
        
        document.querySelector(".left-side .general-info .city").innerHTML =
          place_name;
        document.querySelector("#max-temp").innerHTML = Math.trunc(max) + " °C";
        document.querySelector("#min-temp").innerHTML = Math.trunc(min) + " °C";
        document.querySelector("#humidity-value").innerHTML = humidity + " %";
        document.querySelector("#wind-value").innerHTML = wind_speed + " km/h";
        document.querySelector("#cloudy-value").innerHTML = clouds + " %";
      } else {
        // todo: get forecast for the next seven days

        const weekly = document.querySelector(".weekly");

        const { min, max } = dataNext.daily[i].temp;
        const { icon } = dataNext.daily[i].weather[0];

        if (state == "change") {
          weekly.firstElementChild.remove();
        }

        const card = document.createElement("div");
        card.classList.add("card");

        const dayInfo = document.createElement("p");
        dayInfo.classList.add("day");
        dayInfo.innerText = days[i - 1];

        const iconDOM = document.createElement("img");

        setIcon(icon, "week", iconDOM);
        iconDOM.classList.add("icon");

        const tempDiv = document.createElement("div");
        tempDiv.classList.add("temp-div");

        const maxTemp = document.createElement("p");
        maxTemp.classList.add("max");
        maxTemp.innerText = Math.trunc(max);

        const minTemp = document.createElement("p");
        minTemp.classList.add("min");
        minTemp.innerText = Math.trunc(min);

        tempDiv.appendChild(maxTemp);
        tempDiv.appendChild(minTemp);
        card.appendChild(dayInfo);
        card.appendChild(iconDOM);
        card.appendChild(tempDiv);
        weekly.appendChild(card);
      }
    }
    this.currentTemp(place_name);
  },

  search: function () {
    const inputValue = document.querySelector(".search-div .search-bar");
    this.fetchMapBox(inputValue.value, (state = "change"));
    inputValue.value = "";
  },

  currentTemp: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.openWeatherKey
    )
      .then((response) => response.json())
      .then((data) => this.displayCurrentTemp(data))
      .catch(err => console.log(err))
  },
  displayCurrentTemp: function (data) {
    const { temp } = data.main;
    document.querySelector(".left-side .general-info .temp").innerHTML =
      Math.trunc(temp) + "<span>°C</span>";
  },
};

const setIcon = (code, Attribute = null, iconDOM = null) => {
  if (Attribute == "today") {
    if (code == "01d") {
      document.querySelector(".img-div img").src = "./icons/animated/day.svg";
    } else if (code == "02d") {
      document.querySelector(".img-div img").src =
        "./icons/animated/cloudy-day-3.svg";
    } else if (code == "03d") {
      document.querySelector(".img-div img").src =
        "./icons/animated/cloudy.svg";
    } else if (code == "04d") {
      document.querySelector(".img-div img").src =
        "./icons/animated/cloudy.svg";
    } else if (code == "09d") {
      document.querySelector(".img-div img").src =
        "./icons/animated/rainy-6.svg";
    } else if (code == "10d") {
      document.querySelector(".img-div img").src =
        "./icons/animated/rainy-3.svg";
    } else if (code == "11d") {
      document.querySelector(".img-div img").src =
        "./icons/animated/thunder.svg";
    } else if (code == "13d") {
      document.querySelector(".img-div img").src =
        "./icons/animated/snowy-6.svg";
    } else {
      document.querySelector(".img-div img").src =
        "https://openweathermap.org/img/wn/" + code + ".png";
    }
  } else if (Attribute == "week") {
    if (code == "01d") {
      iconDOM.setAttribute("src", "./icons/animated/day.svg");
    } else if (code == "02d") {
      iconDOM.setAttribute("src", "./icons/animated/cloudy-day-3.svg");
    } else if (code == "03d") {
      iconDOM.setAttribute("src", "./icons/animated/cloudy.svg");
    } else if (code == "04d") {
      iconDOM.setAttribute("src", "./icons/animated/cloudy.svg");
    } else if (code == "09d") {
      iconDOM.setAttribute("src", "./icons/animated/rainy-6.svg");
    } else if (code == "10d") {
      iconDOM.setAttribute("src", "./icons/animated/rainy-3.svg");
    } else if (code == "11d") {
      iconDOM.setAttribute("src", "./icons/animated/thunder.svg");
    } else if (code == "13d") {
      iconDOM.setAttribute("src", "./icons/animated/snowy-6.svg");
    } else {
      document.querySelector(".img-div img").src = iconDOM.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + code + ".png"
      );
    }
  }
};

const setBackground = (main) => {
  const containerDOM = document.querySelector(".container");

  if (main.toLowerCase() == "rain") {
    containerDOM.style.backgroundImage = "url(./img/this_rain.jpg)";
  } else if (main.toLowerCase() == "clouds") {
    containerDOM.style.backgroundImage = "url(./img/this_cloudy.jpg)";
  } else if (main.toLowerCase() == "clear") {
    containerDOM.style.backgroundImage = "url(./img/this_sun.jpg)";
  } else if (main.toLowerCase() == "snow") {
    containerDOM.style.backgroundImage = "url(./img/this_snow.jpg)";
  } else {
    containerDOM.style.backgroundImage = "url(./img/this_rain.jpg)";
  }
};

document
  .querySelector(".right-side .search-div button")
  .addEventListener("click", function () {
    weather.search();
  });

document
  .querySelector(".search-div .search-bar")
  .addEventListener("keyup", function (e) {
    if (e.key == "enter") {
      weather.search();
    }
  });
