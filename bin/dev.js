const {execute} = require('../lib/exec');
const path = require('path');

const config = require('../config');

module.exports = (params) => {
  let [type = '', app] = params;
  ensureCorrectPath();
  const cmd = getCommand(type, app);
  return cmd ? execute(cmd).catch(() => {}) : console.log(`Invalid start params '${params}'`)
};

function getCommand(type, app) {
  type = type || 'nodemon';
  
  const cmd = config.start[type];
  if(cmd) return cmd(getPort());
  
  app = detectApp(app);
  const dirName = getDirName(type, app);
  const isWeb = type==='web';
  return dirName && config.start.dir(dirName, isWeb);
}

function detectApp(app) {
  if(app) return app;
  return config.apps[getCurrentDir()];
}

function getCurrentDir() {
  return path.basename(process.cwd());
}

function getPort() {
  const strippedDir = getCurrentDir().replace(/(service|-|webfront|kudos)/g, '');
  const port = config.ports[strippedDir] || config.ports.any;
  return port;
}

function getDirName(type, app) {
  return config.dirs[type] || config.dirs[type+'-'+app];
}

function ensureCorrectPath() {
  process.env.PATH += ':'+ path.resolve(__dirname, '../node_modules/.bin/');
}
