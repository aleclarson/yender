import { cloneElement, Component, ComponentClass } from 'react'
import { immutagen } from './immutagen'

export * from './render-props'

/** The constructor of generator functions */
const GeneratorFunction = function*(): any {}.constructor

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
  Render extends (props?: object) => Iterator<Yield>
>(render: Render): Yender<Render>

/** Decorate a component class */
export function yender(componentType: ComponentClass): void

/** @internal */
export function yender<
  Yield extends Element,
  Render extends (props?: object) => Iterator<Yield>
>(arg: Render | ComponentClass): Yender<Render> | void {
  if (arg.prototype instanceof Component) {
    return decorate(arg as ComponentClass)
  }
  const render = arg as Render
  const gen: (...args: In<Render>) => Yenderator<Yield> = immutagen(render)
  const compose = (ctx: Yenderator<Yield>): Element =>
    ctx.next
      ? cloneElement(ctx.value, undefined, (props: object) =>
          compose(ctx.next!(props))
        )
      : ctx.value

  const componentType = (...args: In<Render>) => compose(gen(...args))
  componentType.displayName = 'YenderComponent'
  return componentType
}

/** Wrap the `render` method of a component class */
function decorate(componentType: ComponentClass): void {
  const { render } = componentType.prototype
  if (render instanceof GeneratorFunction) {
    Object.defineProperty(componentType.prototype, 'render', {
      value: yender(render),
    })
  } else {
    throw Error('Cannot use @yender when `render` is not a generator function')
  }
}
