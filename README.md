[![NPM](https://nodei.co/npm/simple-md2html.png)](https://nodei.co/npm/simple-md2html/)

# Simple Markdown to HTML converter. No BS.

**Very simple** markdown to HTML converter. You can convert it to PDF with any decent browser afterwards.

It uses [marked](https://github.com/chjj/marked) + [pygmentize](https://github.com/rvagg/node-pygmentize-bundled) to convert it to html, default options.

## What does this library do then?

It **embeds all images and style** (precompiled from pygmentize) so you have **one html file self-contained.**

## Why do you use pygmentize? 

Because any other sucks, even if you have install python for it. Believe me.

## Requirements

Install python 2.X or 3.X to use [pygmentize](https://github.com/rvagg/node-pygmentize-bundled).

## Example Usage

### NodeJS module

```javascript
const md2html = require('simple-md2html');
md2html(filepath, style, (err, html) => {
  // err will be null if everything is ok
  // html contains the converted markdown document
});
```

### CLI

Install globally with `npm install -g simple-md2html` to use the CLI.

`md2html <filepath> [-s <style>]` will create in the current working directory
a html file with the same name of the specified markdown document.

## Precompiled Styles

[Pygmentize](https://github.com/rvagg/node-pygmentize-bundled) uses [pygments](http://pygments.org/download/)(v2.0) python package to give color to your code. This module
has precompiled versions of the styles that come included by default:

```
'default',
'emacs',
'friendly',
'colorful',
'autumn',
'murphy',
'manni',
'monokai',
'perldoc',
'pastie',
'borland',
'trac',
'native',
'fruity',
'bw',
'vim',
'vs',
'tango',
'rrt',
'xcode',
'igor',
'paraiso-light',
'paraiso-dark'
```
