function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var immutagen_1 = require("./immutagen");
__export(require("./render-props"));
/** Convert a generator to a stateless component */
function yender(render) {
    const gen = immutagen_1.immutagen(render);
    const compose = (ctx) => ctx.next
        ? react_1.default.cloneElement(ctx.value, undefined, (props) => compose(ctx.next(props)))
        : ctx.value;
    const component = (...args) => compose(gen(...args));
    component.displayName = 'YenderComponent';
    return component;
}
exports.yender = yender;
