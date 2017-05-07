#!/usr/bin/env node

const minimist = require('minimist');
const marked = require('marked');
const pygmentize = require('pygmentize-bundled');
const waterfall = require('run-waterfall');
const jetpack = require('fs-jetpack');

marked.setOptions({
  highlight: (code, _lang, cb) => pygmentize({ lang: _lang, format: 'html' }, code, (err, result) => cb(err, result.toString())),
});

const defaultStyle = 'colorful';

const argv = minimist(process.argv, { alias: { s: 'style' }, default: { s: defaultStyle } });

if (argv.s === true) argv.s = defaultStyle;

const file = argv._[2];

if (jetpack.exists(file) !== 'file') {
  console.error('No file specified or file doesn\'t exist');
  process.exit(-1);
}

const filedir = jetpack.cwd(file).cwd('..');
const filename = jetpack.inspect(file).name;
const destfile = filename.substr(0, filename.lastIndexOf('.')) || filename;
const stylesDir = jetpack.cwd(__dirname, 'styles');

const readFile = cb =>
  filedir.readAsync(filename, 'utf8')
  .then(data => cb(null, data))
  .catch(err => cb(err));

const embedImages = (html, cb) => {
  html = html.replace(/src=\"([\w/]+)\.(png|jpe?g|gif)\?.+\"/g, (match, imageFile, type) =>
    `src="data:image/${type === 'jpg' ? 'jpeg' : type};base64,${filedir.read(`${imageFile}.${type}`, 'buffer').toString('base64')}"`);
  cb(null, html);
};

const embedStyle = (html, cb) => {
  stylesDir.readAsync(`${argv.s}.css`, 'utf8')
  .then(style => cb(null, `<style>${style}</style>\n${html}`))
  .catch(err => cb(err));
};

const wrap = (html, cb) => cb(null, `<html>\n<head>\n<meta charset="UTF-8">\n</head>\n<body>\n${html}\n</body>\n</html>`);

const writeFile = (html, cb) => {
  jetpack.writeAsync(`${destfile}.html`, html)
  .then(cb)
  .catch(err => cb(err));
};

waterfall([
  readFile,
  marked,
  embedImages,
  embedStyle,
  wrap,
  writeFile,
], (err) => {
  if (err) throw err;
  console.log(`${destfile}.html created!`);
});
