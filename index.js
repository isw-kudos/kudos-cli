#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execute } = require('./lib/exec');
const config = require('./config');
const [, , ...args] = process.argv;
const [cmd, ...params] = args;

const pkg = require('./package.json');
const updateNotifier = require('update-notifier');

updateNotifier({ pkg, updateCheckInterval: 0 }).notify();

return init();

function init() {
  const simple = config.simple[cmd];
  if (simple) return execute(simple).catch(() => null);
  return require(getCmdPath(cmd))(params);
}

function getCmdPath(cmd) {
  let cmdPath = path.resolve(__dirname, `./bin/${cmd}.js`);
  if (!fs.existsSync(cmdPath)) {
    console.log(`Invalid command '${cmd}'`);
    cmdPath = path.resolve(__dirname, `./bin/help.js`);
  }
  return cmdPath;
}
