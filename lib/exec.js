const {exec} = require('child_process');

exports.execute = function(cmd, verbose) {
  verbose = verbose || process.env.VERBOSE;
  return new Promise((resolve, reject) =>
    exec(cmd, (error, stdout, stderr) => {
      console.log(cmd)
      if(error) return console.log(stderr) || reject(error);
      console.log(stdout);
      return resolve(stdout);
    })
  );
};

//execute commands in series
exports.executeInSeries = function(cmds, failOnErr) {
  return cmds.reduce(
    (prev, cmd) => prev.then(results => execute(cmd)
      .catch((err) => failOnErr ? Promise.reject(err) : results[0]-=1) //subtract success number
      .then(() => results)
    ),
    Promise.resolve([cmds.length, cmds.length])
  );
};
