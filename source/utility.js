const HTML_page = /<!?(DocType|html|head|body|meta|title|base)[\s\S]*?>/,
    parser = new DOMParser();

/**
 * @param {String} markup - HTML/XML source code
 *
 * @return {Document|DocumentFragment}
 */
export function parseDOM(markup) {
    return HTML_page.test(markup)
        ? parser.parseFromString(markup, 'text/html')
        : Object.assign(document.createElement('template'), {
            innerHTML: markup
        }).content;
}

/**
 * @param {Node}                          root
 * @param {function(node: Node): Number} [filter] - https://developer.mozilla.org/en-US/docs/Web/API/NodeFilter/acceptNode
 *
 * @yield {Node}
 */
export function* walkDOM(root, filter) {
    var iterator = document.createNodeIterator(root, NodeFilter.SHOW_ALL, {
            acceptNode:
                filter instanceof Function
                    ? filter
                    : () => NodeFilter.FILTER_ACCEPT
        }),
        node;

    while ((node = iterator.nextNode())) yield node;
}

/**
 * @param {Node}                          root
 * @param {RegExp}                        expression
 * @param {String}                        subView          - CSS selector
 * @param {Object}                        parser
 * @param {function(attr: Attr): void}    parser.attribute
 * @param {function(text: Text): void}    parser.text
 * @param {function(node: Element): void} parser.view
 */
export function scanTemplate(
    root,
    expression,
    subView,
    { attribute, text, view }
) {
    const iterator = walkDOM(root, node =>
        node.matches instanceof Function && node.matches(subView)
            ? (view(node), NodeFilter.FILTER_REJECT)
            : NodeFilter.FILTER_ACCEPT
    );

    Array.from(iterator, node => {
        switch (node.nodeType) {
            case 1:
                Array.from(
                    node.attributes,
                    attr => expression.test(attr.value) && attribute(attr)
                );
                break;
            case 3:
                if (expression.test(node.nodeValue)) text(node);
        }
    });
}