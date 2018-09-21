Object.defineProperty(exports, "__esModule", { value: true });
function immutagen(genFun) {
    // Create a function that clones the generator before calling `next`
    function nextFactory(args, history) {
        return function next(value) {
            //
            // Replay history to clone the generator state.
            const gen = genFun(...args);
            let result = gen.next();
            if (history && history.length) {
                history.forEach($ => (result = gen.next($)));
            }
            //
            // Generate the next value.
            const calls = history ? history.concat(value) : [value];
            return {
                value: result.value,
                next: result.done ? undefined : nextFactory(args, calls),
                mutable: gen
            };
        };
    }
    return function gen(...args) {
        const gen = genFun(...args);
        return {
            value: gen.next().value,
            next: nextFactory(args),
            mutable: gen
        };
    };
}
exports.immutagen = immutagen;
