import { Component } from "./Component";

export class ComponentFromString extends Component {
  constructor(props: { htmlString: string; styles?: any; classes?: string }) {
    super(props);
  }
  protected _initNode(): void {
    const parsed = new DOMParser().parseFromString(this.props.htmlString, "text/html");
    this.node = parsed.body.querySelector("*")?.cloneNode(true) as HTMLElement;
  }
}
