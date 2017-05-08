#!/usr/bin/env node

const minimist = require('minimist');
const jetpack = require('fs-jetpack');
const md2html = require('.');

const defaultStyle = 'colorful';

const argv = minimist(process.argv, { alias: { s: 'style' }, default: { s: defaultStyle } });

if (argv.s === true) argv.s = defaultStyle;

const file = argv._[2];

const filename = jetpack.inspect(file).name;

const destfile = `${filename.substr(0, filename.lastIndexOf('.')) || filename}.html`;

md2html(file, argv.s, (err, html) => {
  if (err) {
    console.log(err);
    return;
  }
  jetpack.write(destfile, html, { atomic: true });
  console.log(`${destfile} created!`);
});
