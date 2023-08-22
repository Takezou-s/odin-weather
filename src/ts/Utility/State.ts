import * as types from "../types";
import { ChangeNotifierProperty } from "./EventManagement/ChangeNotifierProperty";
import { Event } from "./EventManagement/Event";
import { PropertyChangedEvent } from "./EventManagement/PropertyChangedEvent";
import { PropertyChangedListener } from "./EventManagement/PropertyChangedListener";

export class StateStore {
  private _owner: any;
  private _propertyNotifier = new PropertyChangedEvent(null, null);
  private _propertyChangedListener = new PropertyChangedListener();
  protected _states: Array<State> = [];
  private _stateChangedEvent: Event;

  constructor(owner: any, delay: number) {
    this._owner = owner;
    this._stateChangedEvent = new Event(delay, this._resetChanged);
  }
  /**
   * Creates and returns state with constructed and given arguments.
   * @param stateName Name of state.
   * @param initialValue Initial value.
   * @param fireAlways Fires event whether or not value is changed.
   * @param changedPredicate Predicate to decide if value has been changed. Equal sign comparation is used when it is null.
   * @returns
   */
  createState = (
    stateName: string,
    initialValue: any | types.SetValueFunction = null,
    fireAlways: boolean = false,
    changedPredicate: types.NotifierPropertyChangedPredicate | null = null
  ) => {
    const state = new State(this._owner, stateName, this._propertyNotifier, initialValue, fireAlways, changedPredicate);
    this._states.push(state);

    this._propertyChangedListener.listenAnyProperty(this._propertyNotifier.subscribe, this._propertyChangedHandler);

    return state;
  };
  /**
   * Adds listener to store changed event.
   * @param listener Event listener.
   */
  subscribeStoreChanged = (listener: types.EventListener) => {
    this._stateChangedEvent.subscribe(listener);
  };
  /**
   * Removes listener from store changed event.
   * @param listener Event listener.
   */
  unsubscribeStoreChanged = (listener: types.EventListener) => {
    this._stateChangedEvent.unsubscribe(listener);
  };

  getStateValue = (stateName: string) => {
    let result = null;
    const state = this._findState(stateName);
    if (state) {
      result = state.getValue();
    }
    return result;
  };

  setStateValue = (stateName: string, value: any | types.SetValueFunction) => {
    const state = this._findState(stateName);
    if (state) {
      state.setValue(value);
    }
  };

  protected _converters: { stateName: string; getter?: (value: any) => any; setter?: (value: any) => any }[] = [];
  exportStateValues() {
    const arr: { stateName: string; value: any }[] = [];
    this._states.forEach((x) => {
      if (x.isWrappedFunction()) {
        return;
      }
      const converter = this._converters.find((y) => y.stateName === x.stateName)?.getter;
      const value = converter ? converter(x.getValue()) : x.getValue();
      arr.push({ stateName: x.stateName, value: value });
    });
    return arr;
  }

  importStateValues(arr: { stateName: string; value: any }[]) {
    arr.forEach((x) => {
      const state = this._findState(x.stateName);
      if (state?.isWrappedFunction()) {
        return;
      }
      const converter = this._converters.find((y) => y.stateName === x.stateName)?.setter;
      this.setStateValue(x.stateName, converter ? converter(x.value) : x.value);
    });
  }
  public get getDelay(): number | null {
    return this._stateChangedEvent.delay;
  }

  public set setDelay(value: number) {
    this._stateChangedEvent.delay = value;
  }

  private _resetChanged = () => {
    this._states.forEach((x) => (x.changed = false));
  };

  private _findState = (stateName: string) => {
    return this._states.find((x) => x.stateName === stateName);
  };

  private _propertyChangedHandler: types.PropertyChangedEventListener = (sender, property, value) => {
    const state = this._findState(property);
    if (state) {
      state.changed = true;
    }
    this._stateChangedEvent.fireEvent(
      this._owner,
      this._states.filter((x) => x.changed)
    );
  };
}

export class State {
  private _property: ChangeNotifierProperty;
  private _stateName: string;

  changed: boolean = false;

  constructor(
    owner: any,
    stateName: string,
    notifier: Event | PropertyChangedEvent,
    initialValue: any | types.SetValueFunction = null,
    fireAlways: boolean = false,
    changedPredicate: types.NotifierPropertyChangedPredicate | null = null
  ) {
    this._property = new ChangeNotifierProperty(owner, stateName, notifier, fireAlways, changedPredicate);
    if (initialValue && typeof initialValue === "function") {
      initialValue = { fn: initialValue, type: "WrappedFunction" };
    }
    this._property.setValueSilent(initialValue);
    this._stateName = stateName;
  }

  public get stateName(): string {
    return this._stateName;
  }

  getValue = () => {
    return this._property.getValue();
  };

  getValueT = <T>(): T | null => {
    return this.getValue() as T;
  };

  setValue = (value: any | types.SetValueFunction) => {
    this._property.setValue(value);
  };

  setValueT = <T>(value: T | ((prevValue: T) => T)) => {
    this.setValue(value);
  };

  isWrappedFunction = () => {
    return this._property.isWrappedFunction();
  };
}
