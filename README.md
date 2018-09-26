# yender

Use generator functions to harness the power of ["render props"](https://reactjs.org/docs/render-props.html) while avoiding ["callback hell"](http://callbackhell.com).

**Why call it "yender"?** It's a portmanteau of "yield" and "render"

*Note:* This is essentially a mirror of [epitath](https://github.com/Astrocoders/epitath) with Typescript support (and a better name, imo).

### Example

```ts
import {yender} from 'yender'

const HelloWorld = yender(function* () {
  const {foo} = yield <Foo />

  console.log(foo) // => true
  return 'Hello world'
})

const element: JSX.Element = <HelloWorld />
```

Where `Foo` is the following:
```ts
import {Render} from 'yender'

const Foo = (props: FooProps) =>
  props.children({ foo: true })

interface FooProps {
  // Children must be optional.
  children?: Render<{ foo: true }>
}
```

In the `HelloWorld` generator function, the `foo` variable returned by `yield <Foo />` is untyped ([see here](https://github.com/Microsoft/TypeScript/issues/26959)).

For type safety, we need to use explicit types:

```ts
import {RenderProps as P} from 'yender'

const HelloWorld = yender(function* () {
  // `typeof` is required because `Foo` is a function, not a class
  const {foo}: P<typeof Foo> = yield <Foo />

  const bar: string = foo // [ts] Type 'true' is not assignable to type 'string'.

  console.log(foo) // => true
  return 'Hello world'
})
```

### The `@yender` decorator

Component classes are supported, too!

```ts
import {Component} from 'react'
import {yender} from 'yender'

@yender
class HelloWorld extends Component {
  *render() {
    const {foo} = yield <Foo />
    return 'Hello ' + this.props.world
  }
}

// Without decorators
yender(HelloWorld)
```
