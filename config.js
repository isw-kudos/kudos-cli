const SERVICE = type => `kudos-${type}-service`;
const WEB = type => `kudos-${type}-webfront`;

const START = 'kudos dev';
const UPDEPS = 'kudos updeps';
const WEBSTART = 'npm run start';

module.exports = {
  simple: {
    pull: 'kudos pckglck && git submodule foreach git pull origin master && git pull origin master',
    npm: 'git submodule foreach npm i && npm i',
    pckglck: 'git submodule foreach git checkout package-lock.json && git checkout package-lock.json',
    pullr: 'kudos pull && kudos npm',
  },
  apps: {
    'kudos-boards-core': 'boards',
    'kudos-innovation-core': 'ideas',
  },
  dirs: {
    user: SERVICE('user'),
    licence: SERVICE('licence'),
    notification: SERVICE('notification'),
    provider: SERVICE('provider'),
    'app-boards': SERVICE('boards'),
    'app-ideas': SERVICE('innovation-idea'),
    'web-boards': WEB('boards'),
    'web-ideas': WEB('innovation'),
  },
  start: {
    nodemon: port => `node_modules/.bin/nodemon -w src --exec node_modules/.bin/babel-node --inspect=${port} src`,
    shared: () => `node_modules/.bin/concurrently -p name -n USER,PROV,NOTF,LIC -c white.bgGreen,white.bgMagenta,black.bgCyan,black.bgWhite --kill-others "${START} user" "${START} provider" "${START} notification" "${START} licence"`,
    all: () => `node_modules/.bin/concurrently -p name -n CORE,APP,WEB,USER,PROV,NOTF,LIC -c white.bgRed,white.bgBlue,white.bgYellow,white.bgGreen,white.bgMagenta,black.bgCyan,black.bgWhite --kill-others "${START}" "${START} app" "${START} web" "${START} user" "${START} provider" "${START} notification" "${START} licence"`,
    dir: (dirName, web) => `cd ${dirName} && ${web ? WEBSTART : START}`,
  },
  START,
  UPDEPS,
};
