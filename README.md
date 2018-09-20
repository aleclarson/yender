# yender

Use generator functions to harness the power of ["render props"](https://reactjs.org/docs/render-props.html) while avoiding ["callback hell"](http://callbackhell.com).

**Why call it "yender"?** It's a portmanteau of "yield" and "render"

*Note:* This is essentially a mirror of [epitath](https://github.com/Astrocoders/epitath) with Typescript support (and a better name, imo).

```ts
import {Component} from 'react'
import yender from 'yender'

// For demonstration purposes
const Foo = (props) =>
  props.children({ foo: true })

const HelloWorld = yender(function* () {
  const {foo} = yield <Foo />
  console.log(foo) // => true
  return 'Hello world'
})
```
