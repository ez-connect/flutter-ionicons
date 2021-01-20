const fs = require('fs');

const kInputFile = 'data.scss';
const kOutputFile = '../lib/ionicons.dart';
const kRegexSCSS = /\$icon-(.*): \"\\(.*)";/;

///
/// Ionicons v5.3.0 - https://github.com/ionic-team/ionicons/releases/tag/v5.3.0
///
/// Outline issues fixed by using `svg-outline-stroke` then upload to IcoMoon
///

/// Generate from SASS of IcoMoon
const buf = [];
buf.push('/// Generate from SASS of IcoMoon');
buf.push("import 'package:flutter/material.dart';\n");

buf.push('/// Uses to generate IconData for Ionicons');
buf.push('class IoniconsData extends IconData {');
buf.push('  const IoniconsData(int code)');
buf.push('      : super(');
buf.push('          code,');
buf.push("          fontFamily: 'Ionicons',");
buf.push("          fontPackage: 'ionicons',");
buf.push('        );');
buf.push('}\n');

buf.push('/// Ionicons data, see https://ionicons.com/ for more info');
buf.push('class Ionicons {');

/// Parse
const data = fs.readFileSync(kInputFile, { encoding: 'utf8' });
const lines = data.split('\n');
let counter = 0;
for (const line of lines) {
  const matches = line.match(kRegexSCSS);
  if (matches && matches.length === 3) {
    let name = matches[1];
    buf.push(`  /// ${name}`);
    name = name.replace(/-/g, '_');
    const code = `0x${matches[2]}`;
    buf.push(`  static const IconData ${name} = IoniconsData(${code});\n`);
    counter++;
  }
}

buf.push('}\n');

// Write
fs.writeFileSync(kOutputFile, buf.join('\n'));
console.log('Total:', counter);
