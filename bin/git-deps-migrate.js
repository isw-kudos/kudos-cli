const { mapGitDeps, npmInstallCmd, getCommitUpdate } = require('../lib/git');
const { executeInSeries } = require('../lib/exec');
const path = require('path');

module.exports = () => {
  const pkg = require(path.resolve('package.json'));
  return migrateGitDeps(pkg.dependencies).then(
    ([success, total]) =>
      total &&
      (total !== success
        ? console.log(`Error migrating!`)
        : console.log(`
Successfully migrated ${total / 2} packages!
Please commit package.json
Please replace all references to 'kudos-([a-z]+)-service/exports' to 'kudos-$1-service-exports' in your src
  `))
  );
};

function migrateGitDeps(deps) {
  return Promise.all(
    mapGitDeps(deps, (name, url) => {
      if (name.split('-').pop() !== 'service') return Promise.resolve();
      const uninstall = `npm uninstall -s ${name}`;
      const newUrl = url.replace(name, name + '-exports');
      return getCommitUpdate(newUrl).then(newCommit => {
        const install = npmInstallCmd(newUrl, newCommit);
        console.log(`Going to migrate ${name}...`);
        return [install, uninstall];
      });
    })
  ).then(cmds => {
    cmds = cmds.filter(c => !!c);
    cmds = cmds.reduce((acc, val) => acc.concat(val), []); //flatten
    return executeInSeries(cmds, true);
  });
}
