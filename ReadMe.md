# DOM Renderer

**Template engine** based on **HTML 5** & **ECMAScript 6**

[![NPM Dependency](https://david-dm.org/EasyWebApp/DOM-Renderer.svg)](https://david-dm.org/EasyWebApp/DOM-Renderer)
[![Build Status](https://travis-ci.com/EasyWebApp/DOM-Renderer.svg?branch=master)](https://travis-ci.com/EasyWebApp/DOM-Renderer)
[![](https://data.jsdelivr.com/v1/package/npm/dom-renderer/badge?style=rounded)](https://www.jsdelivr.com/package/npm/dom-renderer)

[![NPM](https://nodei.co/npm/dom-renderer.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/dom-renderer/)

## Data binding

[`index.json`](https://github.com/EasyWebApp/DOM-Renderer/blob/master/test/source/index.json)

```JSON
{
    "name":     "TechQuery",
    "profile":  {
        "URL":    "https://tech-query.me/",
        "title":  "Web/JavaScript full-stack engineer"
    },
    "job":      [
        { "title": "freeCodeCamp" },
        { "title": "MVP" },
        { "title": "KaiYuanShe" }
    ]
}
```

[`index.html`](https://github.com/EasyWebApp/DOM-Renderer/blob/master/test/source/index.html)

```HTML
<template>
    <h1 hidden="${! view.name}">
        Hello, ${view.name} !
    </h1>

    <ul data-view="profile">
        <template>
            <li title="${scope.name}">
                ${view.URL}
            </li>
            <li>${view.title}</li>
        </template>
    </ul>

    <ol data-view="job">
        <template>
            <li>${view.title}</li>
        </template>
    </ol>
</template>
```

`index.js`

```JavaScript
import View from 'dom-renderer';

import template from './index.html';
import data from './index.json';

const view = new View( template );

view.render( data ).then(() => console.log(view + ''));
```

**Console output** (formatted)

```HTML
<h1>TechQuery</h1>

<ul data-view="profile">
    <template>
        <li title="${scope.name}">
            ${view.URL}
        </li>
        <li>${view.title}</li>
    </template>
    <li title="TechQuery">https://tech-query.me/</li>
    <li>Web/JavaScript full-stack engineer</li>
</ul>

<ol data-view="job">
    <template>
        <li>${view.title}</li>
    </template>
    <li>freeCodeCamp</li>
    <li>MVP</li>
    <li>KaiYuanShe</li>
</ol>
```

## Installation

### Web browser

```HTML
<script src="https://cdn.jsdelivr.net/npm/@babel/polyfill@7.2.5/dist/polyfill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dom-renderer"></script>
```

### Node.JS

```Shell
npm install dom-renderer @babel/polyfill jsdom
```

```JavaScript
import '@babel/ployfill';
import 'dom-renderer/dist/polyfill';
import View from 'dom-renderer';
```

## Babel configuration

```Shell
npm install -D \
    @babel/cli \
    @babel/core \
    @babel/preset-env \
    babel-plugin-inline-import
```

`.babelrc`

```JSON
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": [
        [
            "babel-plugin-inline-import",
            {
                "extensions": [
                    ".html",
                    ".css",
                    ".json"
                ]
            }
        ]
    ]
}
```

## Advanced usage

Follow [the example above](#data-binding)

### Updating

```JavaScript
data.profile = null;  // Remove a Sub view

data.job.unshift({    // Reuse all Sub views of the list,
    title:  'FYClub'  // then add a new Sub view at end
});

view.render( data );
```

### Getter

```JavaScript
console.log( view.name );     // 'TechQuery'

console.log( view.profile );  // View {}

console.log( view.job );      // [View {}, View {}, View {}]
```

### Setter

```JavaScript
import { nextTick } from 'dom-renderer';

document.body.append(... view.topNodes);

view.name = 'tech-query';

nextTick().then(() => {

    console.log( document.querySelector('h1').textContent );  // 'tech-query'
});
```

## Typical cases

https://www.npmjs.com/browse/depended/dom-renderer
