import { ComponentFromString } from "./Core/ComponentFromString";
import { Container } from "./Core/Container";
import DayForecast from "./DayForecast";
import ForecastSummary from "./ForecastSummary";

export default class DayForecastContainer extends Container {
  private dayForecasts: Array<DayForecast> = [];

  constructor() {
    super({ nodeType: "div", classes: "bg-secondary rounded-4 p-4" });
  }

  protected _initNode(): void {
    super._initNode();
    this.addChildren(
      new ComponentFromString({
        htmlString: `
        <span class="opacity-75 fw-medium">3-DAY FORECAST</span>
        `,
      })
    );
  }

  public addDayForecast(item: DayForecast) {
    this.dayForecasts.push(item);
    this.addChildren(item);
  }

  public removeDayForecast(item: DayForecast) {
    const index = this.dayForecasts.findIndex((x) => x === item);
    if (index >= 0) {
      this.dayForecasts.splice(index, 1);
    }
    this.removeChildren(item);
  }

  public clearDayForecasts() {
    this.dayForecasts.forEach((x) => this.removeChildren(x));
    this.dayForecasts = [];
  }
}
