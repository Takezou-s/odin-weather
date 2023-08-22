import { Component } from "./Core/Component";

/**
 * Dummy body component to add Components inside of it.
 */
export default (() => {
  const node = document.body;
  const render = (component: Component) => {
    node.appendChild(component.render());
  };

  return { render };
})();
