const path = require('path');
const { mapGitDeps, npmInstallCmd, getCommitUpdate } = require('../lib/git');
const { executeInSeries, execute } = require('../lib/exec');
const config = require('../config');

module.exports = params => {
  const [param] = params;
  if (param === 'all')
    return execute(
      `git submodule foreach ${config.UPDEPS} && ${config.UPDEPS}`
    );

  const pkg = require(path.resolve('package.json'));
  return checkForUpdates(pkg.dependencies, pkg.name)
    .then(processUpdates)
    .then(logResults);
};

/**
 * Checks deps for git based repos without the latest commit hashes or no commit hashes
 * @param deps - object with npm dependencies
 * @return - Promise that resolves to an array of deps that need to be updated and latest commit hash - [{name, url, commit}]
 */
function checkForUpdates(deps, name = '') {
  console.log(`Checking for git dependency updates in '${name}'...`);
  return Promise.all(
    mapGitDeps(deps, (name, url, oldCommit) =>
      getCommitUpdate(url, oldCommit)
        .then(commit => commit && { name, url, commit })
        .catch(err =>
          console.error(`Error getting latest commitId for ${name}`, err)
        )
    )
  ).then(updates => {
    updates = updates.filter(u => !!u);
    console.log(`Found ${updates.length} update(s)`);
    return updates;
  });
}

/**
 * Runs npm i in series as per updates
 * @param updates - array of deps that need to be updated and latest commit hash
 * @return Promise that resolves to results array with [success, total]
 */
function processUpdates(updates) {
  return executeInSeries(
    updates.map(({ url, commit }) => npmInstallCmd(url, commit)),
    false,
    true
  );
}

function logResults([success, total]) {
  if (total) {
    const fail = total - success;
    if (fail) console.log(`Failed to update ${fail} pkg(s)`);
    if (success)
      console.log(`Updated ${success} pkg(s)\nPlease commit package.json`);
  } else console.log('All git deps up to date');
  console.log('\n');
}
