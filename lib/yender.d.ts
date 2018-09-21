export * from './render-props';
/** Extract the argument types of a function */
declare type In<T> = T extends (...args: infer U) => any ? U : [];
/** Loosely typed React element (the best we can do, for now) */
declare type Element = JSX.Element;
/** Every generated element wraps the next element */
export interface Yenderator<Yield extends Element> {
    value: Yield;
    next?: (props: Yield['props']) => Yenderator<Yield>;
}
/** Stateless component that yields internally */
export interface Yender<Render> {
    (...args: In<Render>): Element;
    displayName: string;
}
/** Convert a generator to a stateless component */
export declare function yender<Yield extends Element, Render extends (props?: object, context?: any) => Iterator<Yield>>(render: Render): Yender<Render>;
