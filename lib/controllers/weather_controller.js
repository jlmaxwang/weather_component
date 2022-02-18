import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    console.log("The 'weather' controller is now loaded!");
  }

  static targets = ["submit", "name", "date", "description", "temperature", "icon", "input"];

  fetchWeather(event) {
    event.preventDefault();
    const cityName = this.inputTarget.value;
    console.log(cityName);
    const coordinate = [];
    const token = 'f4b94e8857a4d88c7f907ba6ae2d1d29';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=pk.eyJ1IjoiamxtYXh3YW5nIiwiYSI6ImNremYwaDdzeTA1cHUycW8zM2NuOThvZ3MifQ.p1ZUg8SVgXSt1CpeHVMJDQ`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const place = data.features[0];
        console.log(data.features[0]);
        const longitude = place.center[0];
        const latitude = place.center[1];
        coordinate.push(latitude, longitude);
        console.log(coordinate);
        const baseUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinate[0]}&lon=${coordinate[1]}&appid=${token}`;
        fetch(baseUrl)
          .then(response => response.json())
          .then(weather => this.#renderResults(weather));
      });
  }

  #renderResults(weather) {
    const tempC = Math.round(weather.main.temp - 273.15);
    const tempF = Math.round((weather.main.temp - 273.15) * 1.8 + 32);
    this.iconTarget.src = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    this.temperatureTarget.innerText = `${tempC}°C <--> ${tempF} °F`;
    this.descriptionTarget.innerText = `${weather.weather[0].description}`;
    this.nameTarget.innerText = weather.name;
    const today = new Date();
    const localOffset = weather.timezone + today.getTimezoneOffset() * 60;
    const localDate = new Date(today.setUTCSeconds(localOffset));
    const options = {
      weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
    };
    const formattedDate = localDate.toLocaleDateString("en-US", options);
    this.dateTarget.innerText = formattedDate;
  }
}
