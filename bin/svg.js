const fs = require('fs');
const outlineStroke = require('svg-outline-stroke');

async function fixSVG() {
  const names = fs.readdirSync('svg');
  for (const name of names) {
    const input = `svg/${name}`;
    const output = `svg-out/${name}`;
    console.log(name);
    let data = fs.readFileSync(input);
    data = await outlineStroke(data);
    fs.writeFileSync(output, data);
  }
}

fixSVG();
