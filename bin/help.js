const config = require('../config');
const path = require('path');
const fs = require('fs');

module.exports = () => {
  const version = require('../package.json').version;
  
  console.log(`
kudos-cli v${version}
Available commands:

${getCommands().join('\n')}
  `);
};

function getCommands() {
  return []
  .concat(Object.keys(config.simple))
  .concat(fs.readdirSync('bin').map(file => path.basename(file, '.js')))
  .sort();
}
