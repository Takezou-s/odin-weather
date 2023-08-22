import { ComponentFromString } from "./Core/ComponentFromString";
import { Container } from "./Core/Container";
import ForecastSummary from "./ForecastSummary";

export default class ForecastContainer extends Container {
  private forecastSummaries: Array<ForecastSummary> = [];

  constructor() {
    super({ nodeType: "div", classes: "col-12 row bg-secondary rounded-4 m-0 p-4 row-gap-3" });
  }

  protected _initNode(): void {
    super._initNode();
    this.addChildren(
      new ComponentFromString({
        htmlString: `
    <div class="col-12 opacity-75 fw-medium m-0 p-0">
        TODAY'S FORECAST
    </div>
    `,
      })
    );
  }

  public addForecastSummary(item: ForecastSummary) {
    this.forecastSummaries.push(item);
    this.addChildren(item);
  }

  public removeForecastSummary(item: ForecastSummary) {
    const index = this.forecastSummaries.findIndex((x) => x === item);
    if (index >= 0) {
      this.forecastSummaries.splice(index, 1);
    }
    this.removeChildren(item);
  }

  public clearForecastSummaries() {
    this.forecastSummaries.forEach((x) => this.removeChildren(x));
    this.forecastSummaries = [];
  }
}
