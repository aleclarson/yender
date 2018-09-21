import { Component, ReactNode } from 'react';
interface ParentProps<T extends object = any> {
    children?: ReactNode[] | ((props: T) => ReactNode);
}
declare type In<T> = T extends (...args: infer U) => any ? U : [];
/** Extract the functional "render children" prop */
declare type ChildFunction<T extends ParentProps> = Exclude<T['children'], ReactNode[] | undefined>;
declare type RPC = Component<ParentProps> | ((props: ParentProps) => ReactNode);
/** Extract the render props of a component */
export declare type RenderProps<T extends RPC> = In<ChildFunction<T extends Component<ParentProps> ? T['props'] : In<T>[0]>>[0];
/** An element factory function */
export declare type Render<P extends object = any> = (props: P, context?: any) => ReactNode;
export {};
