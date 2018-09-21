export interface Immutagen<Yield = any> {
  value: Yield
  next?: (value?: any) => Immutagen<Yield>
  mutable: Iterator<Yield>
}

export function immutagen<Args extends any[], Yield>(
  genFun: (...args: Args) => Iterator<Yield>
): (...args: Args) => Immutagen<Yield> {
  // Create a function that clones the generator before calling `next`
  function nextFactory(args: Args, history?: any[]) {
    return function next(value?: any): Immutagen<Yield> {
      //
      // Replay history to clone the generator state.
      const gen = genFun(...args)
      let result = gen.next()
      if (history && history.length) {
        history.forEach($ => (result = gen.next($)))
      }
      //
      // Generate the next value.
      const calls = history ? history.concat(value) : [value]
      return {
        value: result.value,
        next: result.done ? undefined : nextFactory(args, calls),
        mutable: gen,
      }
    }
  }
  return function gen(...args: Args): Immutagen<Yield> {
    const gen = genFun(...args)
    return {
      value: gen.next().value,
      next: nextFactory(args),
      mutable: gen,
    }
  }
}
