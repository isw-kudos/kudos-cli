const { execute } = require('./exec');

exports.mapGitDeps = function(deps, fn) {
  return Object.keys(deps || {})
    .map(name => {
      const version = deps[name];
      const [url, commit] = parseVersion(version);
      return url ? fn(name, url, commit) : null;
    })
    .filter(d => !!d);
};

exports.npmInstallCmd = function(url, commit) {
  commit = commit ? '#' + commit : '';
  return `yarn add git+${url}${commit}`;
};

/**
 * Check if git repo at url has a newer commit than the one passed in
 * @param url
 * @param commit
 * @return Promise that resolves to commitId if there is a newer one or null
 */
exports.getCommitUpdate = function(url, commit) {
  return execute(`git ls-remote ${url} HEAD`, true)
    .then(output => {
      const words = output.split(/\s/);
      if (!words.length)
        return Promise.reject(`git ls-remote output: ${output}`);

      const latestCommit = words[0];
      if (latestCommit !== commit) return latestCommit;
    })
    .catch(() => null);
};

/**
 * Checks if str is a hosted git repo and ensures url is separated from commit hash
 * @param version string of a github repo in package.json
 * @return [url, commit] or [] if not valid version
 */
function parseVersion(version) {
  if (version.startsWith('git+https')) {
    const url = version.substring(4);
    const parts = url.split('#');
    if (0 < parts.length <= 2) return parts;
  }
  return [];
}
