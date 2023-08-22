import { Component } from "./Component";

export class Icon extends Component {
  private _pathEl!: SVGPathElement;
  private _intervalId: number | null = null;
  private _centered: boolean = false;

  constructor(props?: { viewBox?: string; path?: string; styles?: any; classes?: string; center?: boolean }) {
    props = props || {};
    props.viewBox = props.viewBox || "0 0 24 24";
    props.path = props.path || "";
    props.center = props.center || false;
    super(props);
  }
  protected _initNode(): void {
    this.node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.node.setAttributeNS(null, "fill", "currentColor");
    this.node.style.display = "inline-block";
    this.node.style.width = "1em";
    this.node.style.height = "1em";
    this._pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.node.appendChild(this._pathEl);
  }

  protected _initStates(): void {
    this._bindToState(this._ps.viewBox, ({ getValue }) => {
      this.node.setAttributeNS(null, "viewBox", getValue());
    });
    this._bindToState(this._ps.path, ({ getValue }) => {
      this._pathEl.setAttributeNS(null, "d", getValue());
    });
    this._bindToState(this._ps.center, ({ getValue }) => {
      if (getValue()) {
        this.center();
      }
    });
  }

  center() {
    return;
    this._intervalId = setInterval(
      () => {
        if (!this.node.isConnected) return;
        if (this._centered) {
          if (this._intervalId) {
            clearInterval(this._intervalId);
          }
          return;
        }
        this.centerPath();
        this._centered = true;
      },
      20,
      null
    );
  }

  private centerPath() {
    const asAny: any = this.node;
    const { width: svgWidth, height: svgHeight } = asAny.viewBox.baseVal;

    const { x: pathX, y: pathY, width: pathWidth, height: pathHeight } = this._pathEl.getBBox();

    this._pathEl.setAttributeNS(
      null,
      "transform",
      `translate(${(svgWidth - pathWidth) / 2 - pathX}, ${(svgHeight - pathHeight) / 2 - pathY})`
    );
  }
}
