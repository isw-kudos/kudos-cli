const config = require('../config');
const path = require('path');
const fs = require('fs');
const version = require('../package.json').version;

module.exports = () => {
  console.log(`
kudos-cli v${version}
Available commands:

${getCommands().join('\n')}
  `);
};

function getCommands() {
  return []
  .concat(Object.keys(config.simple))
  .concat(fs.readdirSync(path.resolve(__dirname, './')).map(file => path.basename(file, '.js')))
  .sort();
}
