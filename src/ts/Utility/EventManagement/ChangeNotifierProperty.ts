import { Event } from "./Event";
import { PropertyChangedEvent } from "./PropertyChangedEvent";
import * as types from "../../types";

export class ChangeNotifierProperty {
  private _value: any = null;
  private owner: any;
  private propertyName: string;
  private notifier: Event | PropertyChangedEvent;
  public fireAlways: boolean = false;
  public changedPredicate: types.NotifierPropertyChangedPredicate | null = null;

  /**
   *
   * @param owner Owner object.
   * @param propertyName Property name.
   * @param notifier Event or PropertyChangedEvent to fire changes.
   * @param fireAlways Fires event whether or not value is changed.
   * @param changedPredicate Predicate to decide if value has been changed. Equal sign comparation is used when it is null.
   */
  constructor(
    owner: any,
    propertyName: string,
    notifier: Event | PropertyChangedEvent,
    fireAlways: boolean = false,
    changedPredicate: types.NotifierPropertyChangedPredicate | null = null
  ) {
    this.owner = owner;
    this.propertyName = propertyName;
    this.notifier = notifier;
    this.fireAlways = fireAlways;
    this.changedPredicate = changedPredicate;
  }
  /**
   * Sets property value and fires event if necessary.
   * @param valueOrFn Property value or function with previous value argument.
   */
  setValue = (valueOrFn: any | types.SetValueFunction) => {
    const wrappedFunction = this.isWrappedFunction();
    let value = valueOrFn;
    if (valueOrFn && typeof valueOrFn === "function") {
      if (wrappedFunction) {
        this._value.fn = valueOrFn;
        this._fireChanged();
        return;
      }
      const fnResult = valueOrFn(this._value);
      if (fnResult !== undefined) {
        value = fnResult;
      } else {
        this._fireChanged();
        return;
      }
    }
    let changed = (this.changedPredicate || (() => this._value !== value))(this._value, value);

    this._value = value;
    if (changed || this.fireAlways) this._fireChanged();
  };
  /**
   * Sets property value without firing event.
   * @param valueOrFn Property value or function with previous value argument.
   */
  setValueSilent = (valueOrFn: any | types.SetValueFunction) => {
    let value = valueOrFn;
    if (valueOrFn && typeof valueOrFn === "function") {
      if (this.isWrappedFunction()) {
        this._value.fn = valueOrFn;
        return;
      }
      const fnResult = valueOrFn(this._value);
      if (fnResult !== undefined) {
        value = fnResult;
      } else {
        return;
      }
    }
    this._value = value;
  };
  /**
   * Returns property value.
   * @returns Property value.
   */
  getValue = () => {
    if (this.isWrappedFunction()) {
      return this._value.fn;
    }
    return this._value;
  };

  isWrappedFunction = () => {
    return this._value && this._value.type && this._value.type === "WrappedFunction";
  };
  /**
   * Fires event.
   */
  private _fireChanged = () => {
    if (this.notifier instanceof Event) this.notifier.fireEvent(this.owner, { property: this.propertyName, value: this._value });
    else this.notifier.fireEvent(this.owner, this.propertyName, this._value);
  };
}

export class ChangeNotifierPropertyCreator {
  public owner: any;
  public notifier: Event | PropertyChangedEvent;
  constructor(owner: any, notifier: Event | PropertyChangedEvent) {
    this.owner = owner;
    this.notifier = notifier;
  }
  /**
   * Creates ChangeNotifierProperty with constructed owner and notifier, and with the specified arguments.
   * @param propertyName Property name.
   * @param fireAlways Fires event whether or not value is changed.
   * @param changedPredicate Predicate to decide if value has been changed. Equal sign comparation is used when it is null.
   * @returns
   */
  create = (
    propertyName: string,
    fireAlways: boolean = false,
    changedPredicate: types.NotifierPropertyChangedPredicate | null = null
  ) => {
    return new ChangeNotifierProperty(this.owner, propertyName, this.notifier, fireAlways, changedPredicate);
  };
}
