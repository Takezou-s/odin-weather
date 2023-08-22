import { Container } from "./Core/Container";

export default class WeatherSummary extends Container {
  private cityEl!: HTMLElement;
  private countryEl!: HTMLElement;
  private chanceOfRainEl!: HTMLElement;
  private temperatureEl!: HTMLElement;
  private imgEl!: HTMLImageElement;
  private conditionEl!: HTMLElement;
  constructor(props: {
    city: string;
    region: string;
    country: string;
    chanceOfRain: number;
    temperature: number;
    img: string;
    condition: string;
  }) {
    super({
      ...props,
      nodeType: "div",
      classes: "row m-0 row-gap-3",
    });
  }

  protected _initNode(): void {
    super._initNode();

    this.cityEl = document.createElement("span");
    this.cityEl.className = "fs-1 lh-1 fw-medium";

    this.countryEl = document.createElement("span");
    this.countryEl.className = "fs-4 lh-1 fw-medium";

    this.chanceOfRainEl = document.createElement("span");
    this.chanceOfRainEl.className = "opacity-75 mt-2";

    this.temperatureEl = document.createElement("span");
    this.temperatureEl.className = "fw-semibold display-2 mt-5";

    this.imgEl = document.createElement("img");
    this.conditionEl = document.createElement("span");
    this.conditionEl.className = "fw-semibold";

    const col1 = new Container({ classes: "col-8 p-0 d-flex flex-column" });
    col1.addChildren([this.cityEl, this.countryEl, this.chanceOfRainEl, this.temperatureEl]);

    const col2 = new Container({ classes: "col-4 p-0 d-flex flex-column align-items-center" });
    col2.addChildren([this.imgEl, this.conditionEl]);

    this.addChildren([col1, col2]);
  }

  protected _initStates(): void {
    super._initStates();

    const showCountryInfo = (region: string, country: string) => {
      this.countryEl.textContent = (region.length > 0 ? region + ", " : "") + country;
    };

    this._bindToState(this._ps.city, ({ getValue }) => {
      this.cityEl.textContent = getValue();
    });

    this._bindToState(this._ps.region, ({ getValue }) => {
      showCountryInfo(getValue(), this.props.country);
    });

    this._bindToState(this._ps.country, ({ getValue }) => {
      showCountryInfo(this.props.region, getValue());
    });

    this._bindToState(this._ps.chanceOfRain, ({ getValue }) => {
      this.chanceOfRainEl.textContent = "Chance of rain: " + getValue() + "%";
    });

    this._bindToState(this._ps.temperature, ({ getValue }) => {
      this.temperatureEl.textContent = getValue() + " °C";
    });

    this._bindToState(this._ps.img, ({ getValue }) => {
      this.imgEl.src = getValue();
      this.imgEl.height = 100;
    });

    this._bindToState(this._ps.condition, ({ getValue }) => {
      this.conditionEl.textContent = getValue();
    });
  }
}
