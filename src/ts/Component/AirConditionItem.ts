import { Container } from "./Core/Container";
import { Icon } from "./Core/Icon";

export default class AirConditionItem extends Container {
  private iconEl!: Icon;
  private titleEl!: HTMLElement;
  private infoEl!: HTMLElement;

  constructor(props: { icon: string; title: string; info: string }) {
    super({ ...props, nodeType: "div", classes: "col-6 d-flex gap-3 m-0 p-0" });
  }

  protected _initNode(): void {
    super._initNode();

    this.iconEl = new Icon({ classes: "opacity-75 fs-2" });

    this.titleEl = document.createElement("div");
    this.titleEl.className = "opacity-75";

    this.infoEl = document.createElement("div");
    this.infoEl.className = "fs-2 fw-semibold";

    const div = document.createElement("div");
    div.append(this.titleEl, this.infoEl);

    this.addChildren([this.iconEl, div]);
  }

  protected _initStates(): void {
    super._initStates();

    this._bindToState(this._ps.icon, ({ getValue }) => {
      this.iconEl.props.path = getValue();
    });

    this._bindToState(this._ps.title, ({ getValue }) => {
      this.titleEl.textContent = getValue();
    });

    this._bindToState(this._ps.info, ({ getValue }) => {
      this.infoEl.textContent = getValue();
    });
  }
}
