const { exec } = require('child_process');

const subprocesses = [];

const killSubs = once(() => {
  subprocesses.forEach(p => !p.killed && process.kill(p.pid, 'SIGINT'));
  process.kill(process.pid, 'SIGUSR2');
});

const cleanupOnExit = once(() => {
  process.on('exit', killSubs);
  process.on('SIGINT', killSubs);
  process.on('SIGUSR1', killSubs); // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR2', killSubs);
  process.on('uncaughtException', killSubs);
});

exports.execute = function(cmd, silent) {
  silent = silent || process.env.SILENT;
  return new Promise((resolve, reject) => {
    if (!silent) console.log(cmd);
    const thread = exec(cmd, (err, out) => {
      if (err) reject(err);
      else resolve(out);
    });
    cleanupOnExit();
    subprocesses.push(thread);
    if (!silent) thread.stdout.pipe(process.stdout);
    thread.stderr.pipe(process.stderr);
    thread.on('SIGTERM', e => reject(e));
  });
};

//execute commands in series
exports.executeInSeries = function(cmds, failOnErr, silent) {
  return cmds.reduce(
    (prev, cmd) =>
      prev.then(results =>
        exports
          .execute(cmd, silent)
          .catch(err => (failOnErr ? Promise.reject(err) : (results[0] -= 1))) //subtract success number
          .then(() => results)
      ),
    Promise.resolve([cmds.length, cmds.length])
  );
};

/* eslint-disable no-invalid-this */
function once(func) {
  function _f(...args) {
    if (!_f.isCalled) {
      _f.isCalled = true;
      _f.res = func.apply(this, args);
    }
    return _f.res;
  }

  _f.prototype = func.prototype;
  _f.isCalled = false;

  return _f;
}
