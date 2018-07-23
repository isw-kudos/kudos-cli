#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execute, killAllprocesses } = require('./lib/exec');
const config = require('./config');
const [, , ...args] = process.argv;
const [cmd, ...params] = args;

const pkg = require('./package.json');
const updateNotifier = require('update-notifier');
updateNotifier({ pkg }).notify();
return init();

function init() {
  cleanupOnExit();
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

function cleanup() {
  killAllprocesses();
}

function cleanupOnExit() {
  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', cleanup);
  process.on('SIGUSR2', cleanup);
  process.on('uncaughtException', cleanup);
}
