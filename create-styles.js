const exec = require('child_process').exec;

const styles = [
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
  'paraiso-dark'];

styles.forEach(style => exec(`python node_modules/pygmentize-bundled/vendor/pygments/build-3.3/pygmentize -f html -S ${style} -a .highlight > styles/${style}.css`, (error) => {
  if (error) console.error(`exec error: ${error}`);
}));
