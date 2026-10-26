const WeatherApp = class{
  constructor(apiKey,resultBlockSelector) {
    this.apiKey = apiKey;
    this.resultsBlock = document.querySelector(resultBlockSelector);
    this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
    this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;
    this.currentWeather = undefined
    this.forecast = undefined
  }
  getCurrentWeather(query) {
    let url = this.currentWeatherLink.replace("{query}", query);
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", () => {
      this.currentWeather = JSON.parse(req.responseText);
      console.log(this.currentWeather);
      this.drawWeather()
    });
    req.send();
  }
  getForecast(query) {
    let url = this.forecastLink.replace("{query}", query);
    fetch(url).then((response) =>  {
      return response.json()
    }).then((data) => {
      console.log(data);
      this.forecast = data.list;
      this.drawWeather();
    });
  }

  getWeather(query) {
    this.getCurrentWeather(query);
    this.getForecast(query);
  }

  drawWeather() {
    this.resultsBlock.innerHTML = "";
    if (this.currentWeather) {
      const date = new Date(this.currentWeather.dt * 1000);
      const weatherBlock = this.createWeatherBlock(

        `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
        this.currentWeather.main.temp,
        this.currentWeather.main.feels_like,
        this.currentWeather.weather[0].icon,
        this.currentWeather.weather[0].description
      );
      this.resultsBlock.appendChild(weatherBlock);
    }
    if(this.forecast) {
      for (let i = 0; i < this.forecast.length; i++) {
        let weather = this.forecast[i];
        const date = new Date(weather.dt * 1000);
        const weatherBlock = this.createWeatherBlock(
          `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
          weather.main.temp,
          weather.main.feels_like,
          weather.weather[0].icon,
          weather.weather[0].description
        );
        this.resultsBlock.appendChild(weatherBlock);
      }
    }
  }

  createWeatherBlock(dateString, temperature, feelsLike, iconName,description) {
    const weatherBlock = document.createElement("div");
    weatherBlock.className = 'weather-block';

    const dateBlock = document.createElement("div");
    dateBlock.className = "weather-date"
    dateBlock.innerHTML = dateString;
    weatherBlock.appendChild(dateBlock);

    const temperatureBlock = document.createElement("div");
    temperatureBlock.className = "weather-temperature";
    temperatureBlock.innerHTML = `${temperature}°C`;
    weatherBlock.appendChild(temperatureBlock);

    const temperatureFellBlock = document.createElement("div");
    temperatureFellBlock.className = "weather-temperature-feels-like";
    temperatureFellBlock.innerHTML = `Odczuwalne: ${feelsLike}°C`;
    weatherBlock.appendChild(temperatureFellBlock);

    const iconImg = document.createElement("img");
    iconImg.className = "weather-icon";
    iconImg.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
    weatherBlock.appendChild(iconImg);

    const weatherDescription = document.createElement("div");
    weatherDescription.className = "weather-description";
    weatherDescription.innerHTML = description;
    weatherBlock.appendChild(weatherDescription);



    return weatherBlock;
  }
}

document.weatherApp = new WeatherApp("c15e6f3a380ecb5a1f65a77150557708", "#aktualna-pogoda");

document.querySelector("#przycisk").addEventListener("click", function(){
  const query = document.querySelector("#miasto").value;
  document.weatherApp.getWeather(query);
});
