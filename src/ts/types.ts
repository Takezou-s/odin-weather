import { State } from "./Utility/State";

/**
 * Event listener function type.
 */
export type EventListener = (sender: any, args: any) => void;
/**
 * Type of event subscription methods.
 */
export type EventSubscribe = (listener: EventListener) => void;
/**
 * PropertyChangedEvent listener function type.
 */
export type PropertyChangedEventListener = (sender: any, property: string, value: any) => void;
/**
 * Function checks if property has changed, for PropertyChangedListeners.
 */
export type PropertyChangedPredicate = (sender: any, property: string) => boolean;
/**
 * Function checks if property has changed, for ChangeNotifierProperty and State.
 */
export type NotifierPropertyChangedPredicate = (oldValue: any, newValue: any) => boolean;
/**
 * Function that sets value by previous value, for ChangeNotifierProperty and State.
 */
export type SetValueFunction = (prevValue: any) => any;

/**
 * State bind function, for Component.
 */
export type StateBindFunction = (stateInfo: { state: State; getValue: () => any; getValueT: <T>() => T | null }) => void;
