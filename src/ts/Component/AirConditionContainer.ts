import AirConditionItem from "./AirConditionItem";
import { ComponentFromString } from "./Core/ComponentFromString";
import { Container } from "./Core/Container";

export default class AirConditionContainer extends Container {
  private airConditionItems: Array<AirConditionItem> = [];

  constructor() {
    super({ nodeType: "div", classes: "col-12 row bg-secondary rounded-4 m-0 p-4 row-gap-3" });
  }

  protected _initNode(): void {
    super._initNode();
    this.addChildren(
      new ComponentFromString({
        htmlString: `
    <div class="opacity-75 m-0 p-0">AIR CONDITIONS</div>
    `,
      })
    );
  }

  public addAirConditionItem(item: AirConditionItem) {
    this.airConditionItems.push(item);
    this.addChildren(item);
  }

  public removeAirConditionItem(item: AirConditionItem) {
    const index = this.airConditionItems.findIndex((x) => x === item);
    if (index >= 0) {
      this.airConditionItems.splice(index, 1);
    }
    this.removeChildren(item);
  }

  public clearAirConditionItems() {
    this.airConditionItems.forEach((x) => this.removeChildren(x));
    this.airConditionItems = [];
  }
}
