const {execute} = require('../lib/exec');
const path = require('path');

const config = require('../config');

module.exports = (params) => {
  let [type = '', app] = params;
  ensureCorrectPath();
  return getCommand(type, app)
  .then(cmd => cmd ? execute(cmd) : console.log(`Invalid start params '${params}'`))
  .catch(() => {});
};

function getCommand(type, app) {
  type = type || 'nodemon';
  
  const cmd = config.start[type];
  if(cmd) return getPort().then(cmd);
  
  app = detectApp(app);
  const dirName = getDirName(type, app);
  const isWeb = type==='web';
  return Promise.resolve(dirName && config.start.dir(dirName, isWeb));
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
  return Promise.resolve(port);
}

function getDirName(type, app) {
  return config.dirs[type] || config.dirs[type+'-'+app];
}

function ensureCorrectPath() {
  if(process.env.PATH.indexOf('node_modules')>-1) return;
  process.env.PATH += ':node_modules/.bin/';
}
