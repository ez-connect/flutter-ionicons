// Generate Dart source from CSS
// https://www.npmjs.com/package/svgtofont

import { readFileSync, writeFileSync } from "node:fs";

interface Options {
  input: string | null;
  output: string | null;
}

// Matches both `:before` and `::before` (svgtofont output varies by version).
const kRegexSCSS = /\.Ionicons\-([^:]*):+before.*"\\(.*)\";/g;

function parseArgs(argv: string[]): Options {
  const options: Options = { input: null, output: null };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inlineValue] = argv[i].split("=");
    const value = inlineValue ?? argv[++i];
    if (flag === "--input") options.input = value;
    else if (flag === "--output") options.output = value;
  }
  return options;
}

function main(): void {
  const { input, output } = parseArgs(Bun.argv.slice(2));
  if (!input || !output) {
    console.log(
      "Usage: bun bin/css-to-dart.ts --input <icons.css> --output <ionicons.dart>",
    );
    process.exit(1);
  }

  // Data
  let source = "import 'package:flutter/widgets.dart';\n\n";
  source += "/// Use with the Icon class to show specific icons.\n";
  source += "class Ionicons {\n";

  // Parse
  console.log("Parsing:", input);
  const data = readFileSync(input, { encoding: "utf8" });
  const mapping: Record<string, string> = {};
  const iconEntries: string[] = [];
  let counter = 0;
  const matches = data.matchAll(kRegexSCSS);

  for (const match of matches) {
    if (match.length !== 3) {
      throw new Error("Invalid match");
    }
    let name = match[1];
    const code = match[2];

    source += `  /// ${name}\n`; // origin name
    mapping[name] = `0x${code}`;

    // Dart lint (constant_identifier_names) requires lowerCamelCase constants.
    name = name
      .toLowerCase()
      .split("-")
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
      )
      .join("");
    source += `  static const IconData ${name} = IconData(0x${code}, fontFamily: 'Ionicons', fontPackage: 'ionicons');\n\n`;
    iconEntries.push(`    '${match[1]}': Ionicons.${name},`);

    counter++;
  }

  source += "}\n";

  // Mapping
  source += "\n";
  source += "const ioniconsMapping = ";
  source += JSON.stringify(mapping, null, 2);
  source += ";\n";

  source += "\n";
  source += "const ioniconsIcons = <String, IconData>{\n";
  source += iconEntries.join("\n");
  source += "\n};\n";

  writeFileSync(output, source);

  console.log("Write source to:", output);
  console.log("Total:", counter);
}

main();
