import { mdiThermometer, mdiWeatherWindy, mdiWater, mdiWhiteBalanceSunny } from "@mdi/js";
import AirConditionContainer from "./AirConditionContainer";
import AirConditionItem from "./AirConditionItem";
import { Component } from "./Core/Component";
import { ComponentFromString } from "./Core/ComponentFromString";
import { Container } from "./Core/Container";
import WeatherSummary from "./WeatherSummary";
import ForecastContainer from "./ForecastContainer";
import ForecastSummary from "./ForecastSummary";
import DayForecastContainer from "./DayForecastContainer";
import DayForecast from "./DayForecast";
import SearchResult from "./SearchResult";

export default class Page extends Container {
  private timeoutId?: number;
  private idle: boolean = true;
  private waitForInput: boolean = false;

  private apiKey!: string;
  private url!: string;

  private searchCityEl!: HTMLInputElement;
  private _loading!: Component;

  private column1!: Container;
  private weatherSummary!: WeatherSummary;
  private airConditionContainer!: AirConditionContainer;
  private realFeel!: AirConditionItem;
  private wind!: AirConditionItem;
  private chanceOfRain!: AirConditionItem;
  private uvIndex!: AirConditionItem;

  private column2!: Container;
  private forecastContainer!: ForecastContainer;
  private forecastSummary1!: ForecastSummary;
  private forecastSummary2!: ForecastSummary;
  private forecastSummary3!: ForecastSummary;
  private forecastSummary4!: ForecastSummary;
  private forecastSummary5!: ForecastSummary;
  private forecastSummary6!: ForecastSummary;
  private dayForecastContainer!: DayForecastContainer;
  private dayForecast1!: DayForecast;
  private dayForecast2!: DayForecast;
  private dayForecast3!: DayForecast;

  private searchContainer!: Container;
  private searchResult!: SearchResult;

  private errorEl!: Component;
  constructor() {
    super({ nodeType: "div", classes: "row vw-100 vh-100 m-0 align-items-start align-content-start row-gap-3 p-3" });
  }

  protected _initNode(): void {
    super._initNode();
    this.apiKey = "f054270712344488acf91819230208";
    this.url = localStorage.getItem("url") || "izmir";
    this._loading = new ComponentFromString({
      htmlString: `
      <div class="position-absolute top-50 start-50 translate-middle" style="width: max-content">
        <div class="spinner-border text-info" role="status"></div>
      </div>
      `,
    });
    this.searchResult = new SearchResult();

    this.searchCityEl = document.createElement("input");
    this.searchCityEl.className = "form-control";
    this.searchCityEl.type = "text";
    this.searchCityEl.placeholder = "Search for cities";
    this.searchCityEl.oninput = this.searchCityChangedHandler.bind(this);
    this.searchContainer = new Container({ classes: "offset-xl-1 col-xl-10 col-lg-12 p-0 position-relative" });
    // this.searchContainer.addChildren([this.searchCityEl, this.searchResult]);
    this.searchContainer.addChildren([this.searchCityEl]);
    this.addChildren(this.searchContainer);

    this.column1 = new Container({ classes: "offset-xl-1 col-xl-6 col-lg-7 p-0 pe-lg-3 d-flex flex-column gap-3 justify-content-between align-self-stretch" });
    this.weatherSummary = new WeatherSummary({
      city: "Madrid",
      region: "",
      country: "Spain",
      chanceOfRain: 0,
      temperature: 31,
      img: "https://picsum.photos/200",
      condition: "Sunny",
    });
    this.column1.addChildren(this.weatherSummary);

    this.airConditionContainer = new AirConditionContainer();
    this.realFeel = new AirConditionItem({ icon: mdiThermometer, title: "Real Feel", info: "30 °C" });
    this.wind = new AirConditionItem({ icon: mdiWeatherWindy, title: "Wind", info: "0.2 km/h" });
    this.chanceOfRain = new AirConditionItem({ icon: mdiWater, title: "Chance of Rain", info: "0%" });
    this.uvIndex = new AirConditionItem({ icon: mdiWhiteBalanceSunny, title: "UV Index", info: "3" });
    this.airConditionContainer.addAirConditionItem(this.realFeel);
    this.airConditionContainer.addAirConditionItem(this.wind);
    this.airConditionContainer.addAirConditionItem(this.chanceOfRain);
    this.airConditionContainer.addAirConditionItem(this.uvIndex);
    this.column1.addChildren(this.airConditionContainer);

    this.column2 = new Container({ classes: "col-xl-4 col-lg-5 p-0 d-flex gap-3 flex-column justify-content-between align-self-stretch" });
    this.forecastContainer = new ForecastContainer();
    this.forecastSummary1 = new ForecastSummary({ time: "06:00", img: "https://picsum.photos/200", temperature: 25 });
    this.forecastSummary2 = new ForecastSummary({ time: "06:00", img: "https://picsum.photos/200", temperature: 25 });
    this.forecastSummary3 = new ForecastSummary({ time: "06:00", img: "https://picsum.photos/200", temperature: 25 });
    this.forecastSummary4 = new ForecastSummary({ time: "06:00", img: "https://picsum.photos/200", temperature: 25 });
    this.forecastSummary5 = new ForecastSummary({ time: "06:00", img: "https://picsum.photos/200", temperature: 25 });
    this.forecastSummary6 = new ForecastSummary({ time: "06:00", img: "https://picsum.photos/200", temperature: 25 });
    this.forecastContainer.addForecastSummary(this.forecastSummary1);
    this.forecastContainer.addForecastSummary(this.forecastSummary2);
    this.forecastContainer.addForecastSummary(this.forecastSummary3);
    this.forecastContainer.addForecastSummary(this.forecastSummary4);
    this.forecastContainer.addForecastSummary(this.forecastSummary5);
    this.forecastContainer.addForecastSummary(this.forecastSummary6);
    this.column2.addChildren(this.forecastContainer);

    this.dayForecastContainer = new DayForecastContainer();
    this.dayForecast1 = new DayForecast({
      day: "Today",
      img: "https://picsum.photos/200",
      condition: "Sunny",
      tempDay: 36,
      tempNight: 22,
    });
    this.dayForecast2 = new DayForecast({
      day: "Today",
      img: "https://picsum.photos/200",
      condition: "Sunny",
      tempDay: 36,
      tempNight: 22,
    });
    this.dayForecast3 = new DayForecast({
      day: "Today",
      img: "https://picsum.photos/200",
      condition: "Sunny",
      tempDay: 36,
      tempNight: 22,
    });
    this.dayForecastContainer.addDayForecast(this.dayForecast1);
    this.dayForecastContainer.addDayForecast(this.dayForecast2);
    this.dayForecastContainer.addDayForecast(this.dayForecast3);
    this.column2.addChildren(this.dayForecastContainer);

    this.errorEl = new ComponentFromString({
      htmlString: `
      <div class="text-center">
        <div class="display-2">An error occured!</div>
        <button class="btn btn-lg btn-outline-light mt-4">Try Again</button>
      </div>
    `,
    });

    this.errorEl.node.querySelector("button")?.addEventListener("click", () => {
      this.fetchData(this.url);
    });

    window.addEventListener("click", (ev) => {
      if (ev.target === this.searchCityEl && this.searchCityEl.value.length >= 3 && !this.waitForInput) {
        this.searchContainer.addChildren(this.searchResult);
        return;
      }
      this.searchContainer.removeChildren(this.searchResult);
    });

    this.fetchData(this.url);
  }

  private async fetchData(city: string) {
    this.removeChildren(this.column1);
    this.removeChildren(this.column2);
    this.removeChildren(this.errorEl);
    this.showLoading();
    try {
      const [response] = await Promise.all([
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=3`),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
          }, 750);
        }),
      ]);
      const data = await response.json();
      this.weatherSummary.props.city = data.location.name;
      this.weatherSummary.props.region = data.location.region;
      this.weatherSummary.props.country = data.location.country;
      this.weatherSummary.props.chanceOfRain = data.forecast.forecastday[0].day.daily_chance_of_rain;
      this.weatherSummary.props.temperature = data.current.temp_c;
      this.weatherSummary.props.img = data.current.condition.icon;
      this.weatherSummary.props.condition = data.current.condition.text;

      this.realFeel.props.info = data.current.feelslike_c + " °C";
      this.wind.props.info = data.current.wind_kph + " km/h";
      this.chanceOfRain.props.info = data.forecast.forecastday[0].day.daily_chance_of_rain;
      this.uvIndex.props.info = data.current.uv;

      this.setForecastSummary(data, this.forecastSummary1, "06:00", 6);
      this.setForecastSummary(data, this.forecastSummary2, "09:00", 9);
      this.setForecastSummary(data, this.forecastSummary3, "12:00", 12);
      this.setForecastSummary(data, this.forecastSummary4, "15:00", 15);
      this.setForecastSummary(data, this.forecastSummary5, "18:00", 18);
      this.setForecastSummary(data, this.forecastSummary6, "21:00", 21);

      this.setDayForecast(data, this.dayForecast1, "Today", 0);
      this.setDayForecast(data, this.dayForecast2, this.getDayString(1), 1);
      this.setDayForecast(data, this.dayForecast3, this.getDayString(2), 2);

      this.addChildren(this.column1);
      this.addChildren(this.column2);
      localStorage.setItem("url", city);
    } catch {
      this.addChildren(this.errorEl);
    } finally {
      this.hideLoading();
    }
  }

  private getDayString(dayFromStart: number) {
    let today = new Date().getDay();
    const arr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return arr[(today + dayFromStart) % 7];
  }

  private setDayForecast(data: any, dayForecast: DayForecast, day: string, index: number) {
    dayForecast.props.day = day;
    dayForecast.props.img = data.forecast.forecastday[index].day.condition.icon;
    dayForecast.props.condition = data.forecast.forecastday[index].day.condition.text;
    dayForecast.props.tempDay = data.forecast.forecastday[index].day.maxtemp_c;
    dayForecast.props.tempNight = data.forecast.forecastday[index].day.mintemp_c;
  }

  private setForecastSummary(data: any, forecastSummary: ForecastSummary, time: string, index: number) {
    forecastSummary.props.time = time;
    forecastSummary.props.img = data.forecast.forecastday[0].hour[index].condition.icon;
    forecastSummary.props.temperature = data.forecast.forecastday[0].hour[index].temp_c;
  }

  private searchCityChangedHandler(ev: any) {
    const city = ev.target.value;
    if (!this.idle) return;
    if (city.length < 3) {
      this.searchContainer.removeChildren(this.searchResult);
      return;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      // this.searchContainer.removeChildren(this.searchResult);
      // this.searchResult.clearChildren();
    }
    this.waitForInput = false;
    this.searchResult.showLoading();
    this.searchContainer.addChildren(this.searchResult);
    this.timeoutId = setTimeout(
      () => {
        this.idle = false;
        let arr: any = [];
        fetch(`https://api.weatherapi.com/v1/search.json?key=${this.apiKey}&q=${city}`)
          .then((res) => res.json())
          .then((data) => (arr = data))
          .catch((err) => console.log("Error searching city", err))
          .finally(() => {
            this.searchResult.hideLoading();
            this.idle = true;
            this.searchResult.showCities(arr, (url: string, info: string) => {
              this.searchCityEl.value = info;
              this.waitForInput = true;
              this.fetchData(url);
            });
          });
      },
      1000,
      null
    );
  }

  private showLoading() {
    this.node.append(this._loading.render());
  }

  private hideLoading() {
    this._loading.node.remove();
  }
}
