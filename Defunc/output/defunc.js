var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("render/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Defunc;
    (function (Defunc) {
        var DefuncComponent = /** @class */ (function () {
            function DefuncComponent() {
            }
            return DefuncComponent;
        }());
        Defunc.DefuncComponent = DefuncComponent;
        function createElement(tag, props) {
            var children = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                children[_i - 2] = arguments[_i];
            }
            console.log(tag, props, children);
            if (!tag)
                return;
            var elem = document.createElement(tag);
            if (children.length > 0) {
                children.forEach(function (child) {
                    if (typeof child === 'string') {
                        var text = document.createTextNode(child);
                        elem.appendChild(text);
                    }
                    else {
                        console.log(child);
                        elem.appendChild(createElement.apply(void 0, [child.tag, child.props].concat(child.children)));
                    }
                });
            }
            return elem;
        }
        Defunc.createElement = createElement;
    })(Defunc || (Defunc = {}));
    exports.default = Defunc;
});
define("index", ["require", "exports", "render/index"], function (require, exports, render_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    render_1 = __importDefault(render_1);
    var placeholder = "__jsxPlaceholder" + Date.now();
    var TYPE = {
        element: 'element',
        value: 'value',
        props: 'props'
    };
    function jsx(splits) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        var root = parseElement(splits.raw.join(placeholder), values);
        return root;
    }
    var createDefuncElement = function (node) {
        if (node.type === TYPE.value) {
            return node.value;
        }
        return render_1.default.createElement.apply(render_1.default, [node.tag,
            node.props.props].concat(node.children.map(createDefuncElement)));
    };
    function parseElement(str, values) {
        var match;
        var length;
        var node = {
            type: TYPE.element,
            tag: placeholder,
            props: parseProps('', []),
            children: [],
            length: 0,
            name: '',
            value: null
        };
        match = str.match(/<(\w+)/);
        if (!match) {
            str = str.split('<')[0];
            return parseValues(str, values);
        }
        node.name = match[1];
        node.tag = node.name === placeholder ? values.shift() : node.name;
        length = match.index + match[0].length;
        str = str.slice(length);
        node.length += length;
        match = str.match(/>/);
        if (!match)
            return node;
        node.props = parseProps(str.slice(0, match.index), values);
        length = node.props.length;
        str = str.slice(length);
        node.length += length;
        match = str.match(/^ *\/ *>/);
        if (match && match.index) {
            node.length += match.index + match[0].length;
            return node;
        }
        match = str.match(/>/);
        if (!match)
            return node;
        length = match.index + 1;
        str = str.slice(length);
        node.length += length;
        var children = [];
        var parseNextChildren = function () {
            var empty = [];
            children = empty.concat(parseElement(str, values));
        };
        parseNextChildren();
        while (children.length) {
            children.forEach(function (child) {
                length = child.length;
                str = str.slice(length);
                node.length += length;
                if ((child.type !== TYPE.value || child.value) && node.children) {
                    node.children.push(child);
                }
            });
            parseNextChildren();
        }
        match = str.match(new RegExp("</" + node.name + ">"));
        if (!match)
            return node;
        node.length += match.index + match[0].length;
        if (node.name === placeholder) {
            var value = values.shift();
            if (value !== node.tag)
                return node;
        }
        return node;
    }
    function parseProps(str, values) {
        var match = str.match(/ *\w+="(?:.*[^\\]")?/) ||
            str.match(new RegExp(" *\\w+=" + placeholder)) ||
            str.match(/ *\w+/);
        var length;
        var node = {
            type: TYPE.props,
            length: 0,
            props: {},
        };
        var matchNextProp = function () {
            match =
                str.match(/ *\w+="(?:.*[^\\]")?/) ||
                    str.match(new RegExp(" *\\w+=" + placeholder)) ||
                    str.match(/ *\w+/);
        };
        if (!match)
            return node;
        while (match) {
            var propStr = match[0];
            var _a = propStr.split('='), key = _a[0], value = _a.slice(1);
            node.length += propStr.length;
            key = key.trim();
            var strValue = value.join('=');
            strValue = strValue ? strValue.slice(1, -1) : true;
            node.props[key] = value;
            str = str.slice(0, match.index) + str.slice(match.index + propStr.length);
            matchNextProp();
        }
        return node;
    }
    function parseValues(str, values) {
        var nodes = [];
        str.split(placeholder).forEach(function (split, index, splits) {
            var value;
            var length;
            value = split;
            length = split.length;
            str = str.slice(length);
            if (length) {
                nodes.push({
                    type: TYPE.value,
                    length: length,
                    value: value
                });
            }
            if (index === splits.length - 1)
                return;
            value = values.pop();
            length = placeholder.length;
            if (typeof value === 'string') {
                value = value.trim();
            }
            nodes.push({
                type: TYPE.value,
                length: length,
                value: value
            });
        });
        return nodes;
    }
    function TestComponent() {
        TestComponent.pub = {
            state1: 'test'
        };
        return jsx(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <Container inline onClick={handleClick}>\n      <Text>Hello {pub.state1}</Text>\n    </Container>"], ["\n    <Container inline onClick={handleClick}>\n      <Text>Hello {pub.state1}</Text>\n    </Container>"])));
    }
    exports.default = TestComponent;
    var templateObject_1;
});
