import { Container } from "./Core/Container";

export default class DayForecast extends Container {
  private dayEl!: HTMLElement;
  private imgEl!: HTMLImageElement;
  private conditionEl!: HTMLElement;
  private tempDayEl!: HTMLElement;
  private tempNightEl!: HTMLElement;

  constructor(props: { day: string; img: string; condition: string; tempDay: number; tempNight: number }) {
    super({ ...props, nodeType: "div", classes: "row m-0 mt-3 p-0 align-items-center" });
  }

  protected _initNode(): void {
    super._initNode();

    this.dayEl = document.createElement("span");
    this.dayEl.className = "col-3 m-0 p-0 opacity-75";

    const imgContainer = document.createElement("span");
    imgContainer.className = "col-3 m-0 p-0 text-end";
    this.imgEl = document.createElement("img");
    this.imgEl.className = "me-2";
    imgContainer.appendChild(this.imgEl);

    this.conditionEl = document.createElement("span");
    this.conditionEl.className = "col-3 m-0 p-0 fw-semibold";

    this.tempDayEl = document.createElement("strong");
    this.tempNightEl = document.createElement("span");

    const span = document.createElement("span");
    span.className = "col-3 m-0 p-0 d-flex justify-content-end";
    span.append(this.tempDayEl);
    span.append("/");
    span.append(this.tempNightEl);

    this.addChildren([this.dayEl, imgContainer, this.conditionEl, span]);
  }

  protected _initStates(): void {
    super._initStates();

    this._bindToState(this._ps.day, ({ getValue }) => {
      this.dayEl.textContent = getValue();
    });

    this._bindToState(this._ps.img, ({ getValue }) => {
      this.imgEl.src = getValue();
      this.imgEl.height = 50;
    });

    this._bindToState(this._ps.condition, ({ getValue }) => {
      this.conditionEl.textContent = getValue();
    });

    this._bindToState(this._ps.tempDay, ({ getValue }) => {
      this.tempDayEl.textContent = getValue();
    });

    this._bindToState(this._ps.tempNight, ({ getValue }) => {
      this.tempNightEl.textContent = getValue();
    });
  }
}
