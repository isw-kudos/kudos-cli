const {exec} = require('child_process');

const subprocesses = [];
exports.execute = function(cmd, silent) {
  silent = silent || process.env.SILENT;
  return new Promise((resolve, reject) => {
    if(!silent) console.log(cmd);
    let stdout, error;
    const thread = exec(cmd, (err, out) => {
      if(err) reject(err);
      else resolve(out);
    });
    subprocesses.push(thread);
    if(!silent) thread.stdout.pipe(process.stdout);
    thread.stderr.pipe(process.stderr);
    thread.on('SIGTERM', e => reject(e));
  });
};

//execute commands in series
exports.executeInSeries = function(cmds, failOnErr, silent) {
  return cmds.reduce(
    (prev, cmd) => prev.then(results => exports.execute(cmd, silent)
      .catch((err) => failOnErr ? Promise.reject(err) : results[0]-=1) //subtract success number
      .then(() => results)
    ),
    Promise.resolve([cmds.length, cmds.length])
  );
};

exports.killAllprocesses = function() {
  subprocesses.forEach(p => !p.killed &&  p.kill('SIGINT'));
}
