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
  type = detectType(type);
  const cmd = config.start[type];
  if (cmd) {
    return getPort().then(
      port => (typeof cmd === 'function' ? cmd(port) : cmd)
    );
  }

  app = detectApp(app);
  const dirName = getDirName(type, app);
  return Promise.resolve(dirName && config.start._dir(dirName));
}

function detectApp(app) {
  if (app) return app;
  return config.apps[getCurrentDir()];
}

function detectType(type) {
  if (type) return type;
  if (getCurrentDir().indexOf('webfront') > -1) return 'webfront';
  return 'nodemon';
}

function getCurrentDir() {
  return path.basename(process.cwd());
}

function getPort(dir) {
  const strippedDir = (dir || getCurrentDir()).replace(
    /(service|-|kudos)/g,
    ''
  );
  const ports =
    config.ports[strippedDir] ||
    config.ports.any + Math.floor(Math.random() * 9);

  return Promise.all(
    ports.map(port =>
      detect(port)
        .then(free => free !== port && fkill(':' + port))
        .then(() => port)
    )
  ).then(([port]) => port);
}

function getDirName(type, app) {
  return config.dirs[type] || config.dirs[type + '-' + app];
}

function ensureCorrectPath() {
  process.env.PATH +=
    path.delimiter + path.resolve(__dirname, '../node_modules/.bin/');
}
