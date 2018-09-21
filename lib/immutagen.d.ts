export interface Immutagen<Yield = any> {
    value: Yield;
    next?: (value?: any) => Immutagen<Yield>;
    mutable: Iterator<Yield>;
}
export declare function immutagen<Args extends any[], Yield>(genFun: (...args: Args) => Iterator<Yield>): (...args: Args) => Immutagen<Yield>;
