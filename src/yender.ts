import React from 'react'
import { immutagen } from './immutagen'

export * from './render-props'

/** Extract the argument types of a function */
type In<T> = T extends (...args: infer U) => any ? U : []

/** Loosely typed React element (the best we can do, for now) */
type Element = JSX.Element

/** Every generated element wraps the next element */
export interface Yenderator<Yield extends Element> {
  value: Yield
  next?: (props: Yield['props']) => Yenderator<Yield>
}

/** Stateless component that yields internally */
export interface Yender<Render> {
  (...args: In<Render>): Element
  displayName: string
}

/** Convert a generator to a stateless component */
export function yender<
  Yield extends Element,
  Render extends (props?: object, context?: any) => Iterator<Yield>
>(render: Render): Yender<Render> {
  const gen: (...args: In<Render>) => Yenderator<Yield> = immutagen(render)
  const compose = (ctx: Yenderator<Yield>): Element =>
    ctx.next
      ? React.cloneElement(ctx.value, undefined, (props: object) =>
          compose(ctx.next!(props))
        )
      : ctx.value

  const component = (...args: In<Render>) => compose(gen(...args))
  component.displayName = 'YenderComponent'
  return component
}
