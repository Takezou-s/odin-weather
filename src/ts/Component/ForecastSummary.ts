import { Container } from "./Core/Container";

export default class ForecastSummary extends Container {
  private timeEl!: HTMLElement;
  private imgEl!: HTMLImageElement;
  private temperatureEl!: HTMLElement;

  constructor(props: { time: string; img: string; temperature: number }) {
    super({ ...props, nodeType: "div", classes: "col-2 d-flex flex-column align-items-center gap-2 m-0 p-0" });
  }

  protected _initNode(): void {
    super._initNode();

    this.timeEl = document.createElement("span");
    this.timeEl.className = "opacity-75 fw-medium";

    this.imgEl = document.createElement("img");

    this.temperatureEl = document.createElement("span");
    this.temperatureEl.className = "fs-5 fw-semibold";

    this.addChildren([this.timeEl, this.imgEl, this.temperatureEl]);
  }

  protected _initStates(): void {
    super._initStates();

    this._bindToState(this._ps.time, ({ getValue }) => {
      this.timeEl.textContent = getValue();
    });

    this._bindToState(this._ps.temperature, ({ getValue }) => {
      this.temperatureEl.textContent = getValue() + " °C";
    });

    this._bindToState(this._ps.img, ({ getValue }) => {
      this.imgEl.src = getValue();
      this.imgEl.height = 50;
    });
  }
}
