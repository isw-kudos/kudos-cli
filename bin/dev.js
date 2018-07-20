const {execute} = require('../lib/exec');
const detect = require('detect-port');
const path = require('path');

const config = require('../config');

module.exports = (params) => {
  let [type = '', app] = params;
  
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
  const dirName = path.basename(process.cwd());
  return config.apps[dirName];
}

function getPort() {
  const port = 9220;
  return new Promise((resolve, reject) => {
    detect(port, (err, _port) => err ? reject(err) : resolve(_port));
  });
}

function getDirName(type, app) {
  return config.dirs[type] || config.dirs[type+'-'+app];
}
