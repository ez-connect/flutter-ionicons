const fs = require('fs');
const path = require('path');
const outlineStroke = require('svg-outline-stroke');

const inputDir = 'node_modules/ionicons/dist/svg';
const outputDir = 'svg';

// Ingore, and fix some by Inkscape (Path > Stroke to Path)
// accessibility-outline, at-outline, text-outline
const ignoreList = [
  'alarm', // but not alarm-sharp
  'at',
  'bag',
  'bicycle',
  'body-outline',
  'bowling-ball',
  'clipboard',
  'disc',
  'happy',
  'id-card',
  'key',
  'pint',
  'pizza',
  'push',
  'reader',
  'sad',
  'speedometer',
  'stopwatch',
  'terminal',
  'text',
  'time',
  'today',
  'trash-bin',
  'watch',
];

// TODO: Should ignore ellipsis-vertical-circle, ellipsis-vertical-circle-sharp
function shouldOutline(name) {
  if (name.includes('-circle')) return false;

  for (const e of ignoreList) {
    if (name.includes(e)) {
      return false;
    }
  }

  return true;
}

async function fixSVG() {
  const names = fs.readdirSync(inputDir);
  for (const name of names) {
    const input = `${inputDir}/${name}`;
    const output = `${outputDir}/${name}`;
    const hasOutline = name.includes('-outline');
    if (hasOutline || shouldOutline(name)) {
      console.log(name, ': outline -> stroke');
      let data = fs.readFileSync(input);
      data = await outlineStroke(data);
      fs.writeFileSync(output, data);
    } else {
      console.log(name, ': copy');
      fs.copyFileSync(input, output);
    }
  }
}

fixSVG();
