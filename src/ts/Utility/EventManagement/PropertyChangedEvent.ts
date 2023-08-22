import { Event } from "./Event";
import * as types from "../../types";

/**
 * Notifies property value changes to listeners.
 */
export class PropertyChangedEvent {
  private _event: Event;

  subscribe: types.EventSubscribe;
  unsubscribe: types.EventSubscribe;
  clearSubscribers: () => void;

  constructor(delay: number | null = null, postInvokeFn?: EventListener | null) {
    this._event = new Event(delay, postInvokeFn);
    this.subscribe = this._event.subscribe;
    this.unsubscribe = this._event.unsubscribe;
    this.clearSubscribers = this._event.clearSubscribers;
  }

  /**
   * Fires event.
   * @param sender Owner of event.
   * @param property Name of changed property.
   * @param value Property value.
   */
  fireEvent: (sender: any, property: string, value: any) => void = (sender, property, value) => {
    this._event.fireEvent(sender, { property, value });
  };
}
