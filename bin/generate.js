const fs = require('fs');

const kInputFile = 'data.json';
const kOutputFile = '../lib/ionicons.dart';
const kStartCode = 0xe900;

///
/// Use https://icomoon.io to generate font from svg files that in 
/// Ionicons repo: https://github.com/ionic-team/ionicons
///
/// data.json can be found in /src/data.json
///
function parse() {
  const data = fs.readFileSync(kInputFile, { encoding: 'utf8' });
  const json = JSON.parse(data);

  console.log(kStartCode);
  const names = json.icons.map((v) => v.name.replace(/-/g, '_'));
  return names;
}

function generate() {
  const buf = [];
  buf.push('/// Generated');
  buf.push("import 'package:flutter/material.dart';\n");

  buf.push('class IoniconsData extends IconData {');
  buf.push("  const IoniconsData(int code): super(code, fontFamily: 'Ionicons');");
  buf.push('}\n');

  buf.push('class Ionicons {');

  const names = parse();
  let code = kStartCode;
  for (const name of names) {
    buf.push(`  static const IconData ${name} = IoniconsData(${code});`);
    code = code + 1;
  }

  buf.push('}\n');

  // Write
  fs.writeFileSync(kOutputFile, buf.join('\n'));
}

generate();
