const config = require('../config');
const path = require('path');
const fs = require('fs');
const {version, description} = require('../package.json');

module.exports = () => {
  console.log(`
kudos-cli v${version} - ${description}

Usage: kudos <command>
---------------------------
Where <command> is one of:
---------------------------
${getCommands().map(c => getHelpStr(c)).join('\n')}
---------------------------
  `);
};

function getCommands() {
  return []
  .concat(Object.keys(config.simple))
  .concat(fs.readdirSync(path.resolve(__dirname, './')).map(file => path.basename(file, '.js')))
  .sort();
}

function getHelpStr(cmd) {
  let help = config.help[cmd];
  return help ? `${cmd} - ${help}` : cmd;
}
