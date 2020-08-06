const fs = require('fs');

const kInputFile = 'data.json';
const kOutputFile = '../lib/ionicons.dart';

///
/// Use https://raw.githubusercontent.com/oblador/react-native-vector-icons/
///
/// https://raw.githubusercontent.com/oblador/react-native-vector-icons/master/glyphmaps/Ionicons.json
///

/// Generate
const buf = [];
buf.push('/// Generated');
buf.push("import 'package:flutter/material.dart';\n");

buf.push('class IoniconsData extends IconData {');
buf.push('  const IoniconsData(int code)');
buf.push('      : super(');
buf.push('          code,');
buf.push("          fontFamily: 'Ionicons',");
buf.push("          fontPackage: 'ionicons',");
buf.push('        );')
buf.push('}\n');

buf.push('class Ionicons {');

/// Parse
const data = fs.readFileSync(kInputFile, { encoding: 'utf8' });
const json = JSON.parse(data);

for (const [k, v] of Object.entries(json)) {
  if (k.includes('ios-') || k.includes('md-')) {
    continue;
  }
  
  const name = k.replace(/-/g, '_');
  buf.push(`  static const IconData ${name} = IoniconsData(${v});`);
}

buf.push('}\n');

// Write
fs.writeFileSync(kOutputFile, buf.join('\n'));
