import { StateBindFunction } from "../../types";
import { Component } from "./Component";

export class ComponentFromElement extends Component {
  constructor(
    element: HTMLElement | string,
    propBindings: { propName: string; fn: (comp: Component) => StateBindFunction }[],
    props?: any
  ) {
    super(props);
    if (typeof element === "string") this.node = document.createElement(element);
    else this.node = element;
    for (const propBinding of propBindings) {
      const state = this._ps[propBinding.propName];
      if (!state || !propBinding.fn) continue;
      this._bindToState(state, propBinding.fn(this));
    }
  }
  protected _initNode(): void {}
}
