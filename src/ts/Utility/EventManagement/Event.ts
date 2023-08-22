import { EventListener, EventSubscribe } from "../../types";

/**
 * Runs listener functions when triggered.
 */
export class Event {
  private _listeners: Array<EventListener> = [];
  private _timeoutId: number | null = null;
  public delay: number | null = null;
  private postInvokeFn: EventListener | null = null;

  constructor(delay: number | null = null, postInvokeFn: EventListener | null = null) {
    this.delay = delay;
    this.postInvokeFn = postInvokeFn;
  }

  /**
   * Subscribes listener function.
   * @param listener Function listens event triggers.
   */
  subscribe: EventSubscribe = (listener) => {
    this._listeners.push(listener);
  };
  /**
   * Unsubscribes listener function.
   * @param listener Function listens event triggers.
   */
  unsubscribe: EventSubscribe = (listener) => {
    if (listener) {
      const index = this._listeners.findIndex((x) => x === listener);
      if (index >= 0) {
        this._listeners.splice(index, 1);
      }
    }
  };
  /**
   * Clears all subscribers.
   */
  clearSubscribers: () => void = () => {
    this._listeners.splice(0, this._listeners.length);
  };
  /**
   * Fires Event.
   * @param sender Owner of event.
   * @param args Value attached to event.
   */
  fireEvent: (sender: any, args: any) => void = (sender, args) => {
    if (this.delay && !isNaN(this.delay) && this.delay > 0) {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
      }

      this._timeoutId = setTimeout(
        () => {
          this._invoke(sender, args);
        },
        this.delay,
        null
      );

      return;
    }
    this._invoke(sender, args);
  };
  /**
   * Invokes listener functions and the function after listener invocations.
   * @param sender Owner of event.
   * @param args Value attached to event.
   */
  private _invoke: EventListener = (sender, args) => {
    this._listeners.forEach((x) => x(sender, args));
    if (this.postInvokeFn) this.postInvokeFn(sender, args);
  };
}
