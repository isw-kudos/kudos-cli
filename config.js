const SERVICE = type => `kudos-${type}-service`;
const WEB = type => `kudos-${type}-webfront`;

const START = 'kudos dev';
const UPDEPS = 'kudos updeps';
const WEBSTART = 'npm run start';

module.exports = {
  simple: {
    pull:
      'kudos pkglck && git submodule foreach git pull origin master && git pull origin master',
    npm: 'git submodule foreach npm i && npm i',
    pkglck:
      'git submodule foreach git checkout package-lock.json && git checkout package-lock.json',
    catchup: 'kudos pull && kudos npm',
  },
  help: {
    pull:
      'Pull latest changes for all submodules supressing package-lock conflicts',
    npm: 'Run npm install for each submodule and for current dir',
    pkglck: 'Revert package-lock changes for all submodules and current dir',
    catchup:
      'Pull latest changes for all submodules and run npm install on all submodules.',
    deps: 'Build exports and common repos into deps? TODO',
    dev: `Run current app, all submodules or specific submodule. Supported params: <none>, all, web, app, user, licence, nofitication, provider`,
    updeps:
      'Update git based repos to latest commits. Run with param all to run for all submodules.',
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
    nodemon: port => `nodemon -w src --exec babel-node --inspect=${port} src`,
    shared: `concurrently -p name -n USER,PROV,NOTF,LIC -c white.bgGreen,white.bgMagenta,black.bgCyan,black.bgWhite --kill-others "${START} user" "${START} provider" "${START} notification" "${START} licence" --color always`,
    all: `concurrently -p name -n CORE,APP,WEB,USER,PROV,NOTF,LIC -c white.bgRed,white.bgBlue,white.bgYellow,white.bgGreen,white.bgMagenta,black.bgCyan,black.bgWhite --kill-others "${START}" "${START} app" "${START} web" "${START} user" "${START} provider" "${START} notification" "${START} licence" --color always`,
    _dir: (dirName, web) => `cd ${dirName} && ${web ? WEBSTART : START}`,
  },
  ports: {
    user: 9220,
    licence: 9221,
    notification: 9222,
    provider: 9223,
    boards: 9224,
    innovationidea: 9225,
    boardscore: 9226,
    any: 9227,
  },
  START,
  UPDEPS,
};
