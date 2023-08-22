import * as types from "../../types";

export class PropertyChangedListener {
  /**
   * Listens event when both owner and property/predicate matches.
   * @param subscriptionFn Subscription function to listen.
   * @param listenerFn Listener funciton. This function is called when event is triggered.
   * @param propOwner Expected owner of property/event.
   * @param property Expected property name or predicate to check if listener function should be called.
   */
  listen = (
    subscriptionFn: types.EventSubscribe,
    listenerFn: types.PropertyChangedEventListener,
    propOwner: any,
    property: null | undefined | string | types.PropertyChangedPredicate
  ) => {
    const checkSender = (sender: any) => {
      return sender && propOwner ? propOwner === sender : true;
    };

    const checkProperty = (property: string) => {
      return !property || property === "__any__" ? true : property === property;
    };

    let predicate: types.PropertyChangedPredicate = (sender, property) => true;
    if (property) {
      if (Object.prototype.toString.call(property) === "[object String]") {
        predicate = (sender, property) => checkSender(sender) && checkProperty(property);
      } else {
        predicate = property as types.PropertyChangedPredicate;
      }
    }

    subscriptionFn(this._getWrappedListener(listenerFn, predicate));
  };
  /**
   * Listens any property value changed when owner matches.
   * @param subscriptionFn Subscription function to listen.
   * @param listenerFn Listener function. This function is called when event is triggered.
   * @param propOwner Expected owner of property/event.
   */
  listenOwnersAnyProperty = (subscriptionFn: types.EventSubscribe, listenerFn: types.PropertyChangedEventListener, propOwner: any) => {
    this.listen(subscriptionFn, listenerFn, propOwner, null);
  };
  /**
   * Listens event when property/predicate matches.
   * @param subscriptionFn Subscription function to listen.
   * @param listenerFn Listener function. This function is called when event is triggered.
   * @param property Expected property name or predicate to check if listener function should be called.
   */
  listenProperty = (
    subscriptionFn: types.EventSubscribe,
    listenerFn: types.PropertyChangedEventListener,
    property: string | types.PropertyChangedPredicate
  ) => {
    this.listen(subscriptionFn, listenerFn, null, property);
  };
  /**
   * Listens event always.
   * @param subscriptionFn Subscription function to listen.
   * @param listenerFn Listener function. This function is called when event is triggered.
   */
  listenAnyProperty = (subscriptionFn: types.EventSubscribe, listenerFn: types.PropertyChangedEventListener) => {
    this.listen(subscriptionFn, listenerFn, null, null);
  };

  private _getWrappedListener(
    listenerFn: types.PropertyChangedEventListener,
    predicate: types.PropertyChangedPredicate
  ): types.EventListener {
    return (sender, { property, value }) => {
      if (predicate(sender, property)) {
        listenerFn(sender, property, value);
      }
    };
  }
}
