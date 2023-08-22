import { State, StateStore } from "../../Utility/State";
import * as types from "../../types";

/**
 * Component base class. Subclasses should override "initNode" method and set value of "node" property.
 */
export abstract class Component {
  protected _update = false;
  /**
   * State binds.
   */
  protected _stateBinds: Array<{ state: State; fn: types.StateBindFunction }> = [];
  /**
   * State store.
   */
  protected _stateStore = new StateStore(this, 50);
  /**
   * Changed states.
   */
  protected _changedStates: Array<State> = [];
  /**
   * External states(set via "props" in constructor) is accessed by this component.
   */
  protected _ps: any = {};
  /**
   * External state values(set via "props" in constructor) is accessed by other components.
   */
  props: any;
  /**
   * Classes state to add to node element. Since classes can be added via props, use this to specify internal classes.
   */
  protected _classes!: State;
  /**
   * HTMLElement object to append to document.
   */
  _node!: HTMLElement | SVGSVGElement;

  get node(): HTMLElement | SVGSVGElement {
    return this._node;
  }

  set node(value: HTMLElement | SVGSVGElement) {
    this._node = value;
  }

  constructor(props: any | null = null) {
    this._stateStore.subscribeStoreChanged(this._stateChangedHandler);

    props = props || {};
    props.children = props.children || [];
    if(!Array.isArray(props.children)){
      props.children = [props.children];
    }
    props.styles = props.styles || {};
    props.classes = props.classes || "";
    if (props) {
      const createStatesFromProps = () => {
        for (const key in props) {
          let value = props[key];
          if (value && typeof value === "function") {
            value = { fn: value, type: "WrappedFunction" };
          }
          this._ps[key] = this._createState(`props.${key}`, value, true);
        }
      };

      const handler = {
        get: (target: any, prop: string, receiver: any) => {
          return this.getPropValue(prop);
        },
        set: (obj: any, prop: string, value: any | types.SetValueFunction) => {
          this.setPropValue(prop, value);
          return true;
        },
      };

      this.props = new Proxy(Object.assign({}, props), handler);
      createStatesFromProps();
    }

    this._classes = this._createState("classes", document.createElement("div").classList, true);
    this._initNode();
    this._initStatesWrapper();
  }

  addClass(...classNames: string[]): void {
    this._classes.setValueT<DOMTokenList>((list) => {
      classNames.forEach((className) => {
        const splitted = className.trim().split(" ");
        splitted.forEach((x) => {
          if (x && x.length > 0) {
            list.add(x);
          }
        });
      });
      return list;
    });
  }

  removeClass(...classNames: string[]): void {
    this._classes.setValueT<DOMTokenList>((list) => {
      classNames.forEach((className) => {
        const splitted = className.trim().split(" ");
        splitted.forEach((x) => {
          if (x && x.length > 0) {
            list.remove(x);
          }
        });
      });
      return list;
    });
  }

  toggleClass(...classNames: string[]): void {
    this._classes.setValueT<DOMTokenList>((list) => {
      classNames.forEach((className) => {
        const splitted = className.trim().split(" ");
        splitted.forEach((x) => {
          if (x && x.length > 0) {
            list.toggle(x);
          }
        });
      });
      return list;
    });
  }
  /**
   * Node creation and element appendings are made in this method.
   */
  protected abstract _initNode(): void;
  /**
   * Wraps "_initStates" method to ensure some statements is done.
   */
  private _initStatesWrapper() {
    const setClassName = (internal?: string, external?: string) => {
      const className = (internal?.trim() + " " + external?.trim()).trim();
      if (className && className.length > 0) {
        if (this.node.nodeName === "svg") {
          let str: any = this.node.classList.value;
          str = str.trim().split(" ");
          (str as string[]).forEach((x) => {
            if (x) this.node.classList.remove(x);
          });

          str = className.split(" ");
          (str as string[]).forEach((x) => {
            if (x) this.node.classList.add(x);
          });
        } else {
          (this.node as HTMLElement).className = className;
        }
      }
    };

    this._bindToState(this._classes, ({ getValueT }) => {
      // this.node.className = (getValue() + " " + this._getClassesFromProps()).trim();
      setClassName(getValueT<DOMTokenList>()!.value, this._getClassesFromProps());
    });

    if (this._ps) {
      if (this._ps.styles) {
        this._bindToState(this._ps.styles, ({ getValue }) => {
          const value = getValue();
          for (const style in value) {
            if (Object.prototype.hasOwnProperty.call(this.node.style, style)) {
              (this.node.style as any)[style] = value[style];
            }
          }
        });
      }

      if (this._ps.classes) {
        this._bindToState(this._ps.classes, ({ getValue }) => {
          // this.node.className = (this._classes.getValue() + " " + getValue()).trim();
          setClassName(this._classes.getValueT<DOMTokenList>()!.value, getValue());
        });
      }
    }

    this._initStates();
  }
  /**
   * State creations and bindings are made in this method.
   */
  protected _initStates(): void {}
  /**
   * Returns classes from props for node element.
   * @returns
   */
  private _getClassesFromProps(): string {
    let result = "";
    if (this._ps && this._ps.classes) {
      result = this._ps.classes.getValue() as string;
    }
    return result;
  }
  /**
   * Subscribe an external state store changes, for global state management.
   * @param store State store to listen to.
   */
  protected _subscribeStateStore(store: StateStore) {
    store.subscribeStoreChanged(this._stateChangedHandler);
  }
  protected _unsubscribeStateStore(store: StateStore) {
    store.unsubscribeStoreChanged(this._stateChangedHandler);
  }
  /**
   * Creates state to use inside the component.
   * @param stateName Name of state.
   * @param initValue Initial value of state.
   * @param fireAlways Fires event whether or not value is changed.
   * @param changedPredicate Predicate to decide if value has been changed. Equal sign comparation is used when it is null.
   * @returns
   */
  protected _createState = (
    stateName: string,
    initValue: any | types.SetValueFunction,
    fireAlways: boolean = false,
    changedPredicate: types.NotifierPropertyChangedPredicate | null = null
  ) => {
    const state = this._stateStore.createState(stateName, initValue, fireAlways, changedPredicate);
    return state;
  };
  /**
   * State, props -> element bindings are made in this method. Use this method inside "initStates method."
   * @param state State whose changes are listened.
   * @param callbackFn State change listener function.
   */
  protected _bindToState = (state: State, callbackFn: types.StateBindFunction) => {
    this._stateBinds.push({ state, fn: callbackFn });
  };
  /**
   * Reflects state changes to elements.
   */
  private _reflectStates = () => {
    if (!this._update || !this._changedStates || this._changedStates.length <= 0) {
      this._stateBinds.forEach((x) => x.fn({ state: x.state, getValue: x.state.getValue, getValueT: x.state.getValueT }));
    } else {
      this._changedStates.forEach((x) => {
        const stateBind = this._stateBinds.find((y) => y.state === x || y.state.stateName === x.stateName);
        if (stateBind) {
          stateBind.fn({ state: stateBind.state, getValue: stateBind.state.getValue, getValueT: stateBind.state.getValueT });
        }
      });
      this._changedStates = [];
    }
  };
  /**
   * Reflect changes to elements.
   */
  private _reflectToElements = () => {
    this._reflectStates();
  };
  /**
   * Renders component and returns node.
   * @returns Node to append to document.
   */
  render() {
    this._reflectToElements();
    this._update = true;
    return this.node;
  }
  /**
   * Returns prop value.
   * @param propName Prop name.
   * @returns
   */
  getPropValue = (propName: string) => {
    return this._stateStore.getStateValue(`props.${propName}`);
  };
  /**
   * Sets prop value.
   * @param propName Prop name.
   * @param value New value.
   */
  setPropValue = (propName: string, value: any | types.SetValueFunction) => {
    this._stateStore.setStateValue(`props.${propName}`, value);
  };

  private _stateChangedHandler = (sender: any, args: any) => {
    this._changedStates = args;
    this.render();
  };
}
