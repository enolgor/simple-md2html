const marked = require('marked');
const pygmentize = require('pygmentize-bundled');
const waterfall = require('run-waterfall');
const jetpack = require('fs-jetpack');
const tmp = require('tmp');
const request = require('request');

marked.setOptions({
  highlight: (code, _lang, cb) => pygmentize({ lang: _lang, format: 'html' }, code, (err, result) => cb(err, result.toString())),
});

const download = (url, filename) => (cb) => {
  request({ uri: url, encoding: null }, (err, resp, body) => {
    jetpack.write(filename, body, { atomic: true });
    cb(err);
  });
};


const init = (file, _style) => (cb) => {
  if (jetpack.exists(file) !== 'file') {
    cb('No file specified or file doesn\'t exist');
    return;
  }
  const data = {};
  data.style = _style;
  data.filedir = jetpack.cwd(file).cwd('..');
  data.filename = jetpack.inspect(file).name;
  data.stylesDir = jetpack.cwd(__dirname, 'styles');
  cb(null, data);
};

const readFile = (data, cb) =>
  data.filedir.readAsync(data.filename, 'utf8')
  .then(content => cb(null, data, content))
  .catch(err => cb(err));

const mdToHtml = (data, content, cb) => marked(content, (err, html) => cb(err, data, html));

const downloadImages = (data, html, cb) => {
  const images = [];
  html = html.replace(/src="(http.+\.(png|jpe?g|gif)(?:\?[^"]*)?)"/g, (match, url, type) => {
    const tmpfile = `${tmp.tmpNameSync()}.${type}`;
    images.push(download(url, tmpfile));
    return `src="${tmpfile}"`;
  });
  waterfall(images, (err) => {
    cb(err, data, html);
  });
};

const embedImages = (data, html, cb) => {
  html = html.replace(/src="(.+)\.(png|jpe?g|gif)(?:\?[^"]*)?"/g, (match, imageFile, type) =>
    `src="data:image/${type === 'jpg' ? 'jpeg' : type};base64,${data.filedir.read(`${imageFile}.${type}`, 'buffer').toString('base64')}"`);
  cb(null, data, html);
};

const embedStyle = (data, html, cb) => {
  data.stylesDir.readAsync(`${data.style}.css`, 'utf8')
  .then(style => cb(null, data, `<style>${style}</style>\n${html}`))
  .catch(err => cb(err));
};

const wrap = (data, html, cb) => cb(null, data, `<html>\n<head>\n<meta charset="UTF-8">\n</head>\n<body>\n${html}\n</body>\n</html>`);

module.exports = (file, style, cb) => {
  waterfall([
    init(file, style),
    readFile,
    mdToHtml,
    downloadImages,
    embedImages,
    embedStyle,
    wrap,
  ], (err, data, html) => cb(err, html));
};
