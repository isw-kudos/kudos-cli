const { execute } = require('../lib/exec');
const path = require('path');

const config = require('../config');
const fkill = require('fkill');
const detect = require('detect-port');

module.exports = params => {
  const [type = '', app] = params;
  ensureCorrectPath();
  return getCommand(type, app).then(
    cmd =>
      cmd
        ? execute(cmd).catch(() => null)
        : console.log(`Invalid start params '${params}'`)
  );
};

function getCommand(type, app) {
  type = type || 'nodemon';

  const cmd = config.start[type];
  if (cmd) {
    if (typeof cmd === 'function') return getPort().then(cmd);
    return Promise.resolve(cmd);
  }

  app = detectApp(app);
  const dirName = getDirName(type, app);
  const isWeb = type === 'web';
  return Promise.resolve(dirName && config.start._dir(dirName, isWeb));
}

function detectApp(app) {
  if (app) return app;
  return config.apps[getCurrentDir()];
}

function getCurrentDir() {
  return path.basename(process.cwd());
}

function getPort() {
  const strippedDir = getCurrentDir().replace(
    /(service|-|webfront|kudos)/g,
    ''
  );
  const port =
    config.ports[strippedDir] ||
    config.ports.any + Math.floor(Math.random() * 9);
  return detect(port)
    .then(_port => (_port !== port ? fkill(':' + port) : Promise.resolve()))
    .then(() => port);
}

function getDirName(type, app) {
  return config.dirs[type] || config.dirs[type + '-' + app];
}

function ensureCorrectPath() {
  process.env.PATH +=
    path.delimiter + path.resolve(__dirname, '../node_modules/.bin/');
}
