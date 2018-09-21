import { Component, ReactNode } from 'react'

interface ParentProps<T extends object = any> {
  children?: ReactNode[] | ((props: T) => ReactNode)
}

// Infer the argument types of a function
type In<T> = T extends (...args: infer U) => any ? U : []

/** Extract the functional "render children" prop */
type ChildFunction<T extends ParentProps> = Exclude<
  T['children'],
  ReactNode[] | undefined
>

// Component with render props
type RPC = Component<ParentProps> | ((props: ParentProps) => ReactNode)

/** Extract the render props of a component */
export type RenderProps<T extends RPC> = In<
  ChildFunction<T extends Component<ParentProps> ? T['props'] : In<T>[0]>
>[0]

/** An element factory function */
export type Render<P extends object = any> = (
  props: P,
  context?: any
) => ReactNode
