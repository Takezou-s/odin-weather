import { Component } from "./Core/Component";
import { ComponentFromString } from "./Core/ComponentFromString";
import { Container } from "./Core/Container";
import { Dropdown } from "bootstrap";

export default class SearchResult extends Container {
  private innerContainer!: Container;
  constructor() {
    super({
      classes:
        "border border-top-0 rounded-0 rounded-bottom-2 position-absolute w-100 bg-dark d-flex flex-column z-3 pt-2 overflow-auto",
      // classes: "dropdown-menu",
      styles: { maxHeight: "156px" },
    });
  }
  private _loading!: Component;
  protected _initNode(): void {
    super._initNode();
    this.innerContainer = new Container({ classes: "w-100 bg-dark d-flex flex-column z-3 py-2 overflow-auto" });
    this._loading = new ComponentFromString({
      htmlString: `
            <div style="width: max-content; height: 50px" class="d-flex justify-content-center align-items-center m-auto">
                <div class="spinner-border text-info" role="status"></div>
            </div>
            `,
    });
  }

  public showCities(
    cities: Array<{ name: string; region: string; country: string; url: string }>,
    clickHandler: (url: string, info: string) => void
  ) {
    this.clearChildren();
    if (cities.length <= 0) {
      this.addChildren(
        new ComponentFromString({
          htmlString: `
          <div class="mx-2 fs-3">City not found!</div>
        `,
        })
      );
      //   new Dropdown(this.node).show();
      return;
    }
    cities.forEach((city) => {
      const button = document.createElement("button");
      button.className = "btn btn-outline-light text-start rounded-0 border-0 border-bottom";
      button.innerHTML = `
      <div class="fw-medium fs-5 lh-1">${city.name}</div>
      <div class="fw-light fs-6 lh-1 opacity-75">${city.region}, ${city.country}</div>
      `;
      button.onclick = () => {
        clickHandler(city.url, city.name + ", " + city.region + ", " + city.country);
      };
      this.addChildren(button);
    });
    // new Dropdown(this.node, {autoClose: true}).show();
  }

  public showLoading() {
    // new Dropdown(this.node, {autoClose: true}).show();
    if (!this._loading.node.isConnected) {
      this.node.append(this._loading.render());
      this.clearChildren();
    }
  }

  public hideLoading() {
    this._loading.node.remove();
  }
}
