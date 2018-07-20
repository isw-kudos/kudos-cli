#!/usr/bin/env node
const fs = require('fs');
const config = require('./config');

const [,, ...args] = process.argv;
const [cmd, ...params] = args;

const simple = config.simple[cmd];
if(simple)
  return require('./lib/exec').execute(simple).catch(() => {});

const cmdPath = `./bin/${cmd}.js`;
if (fs.existsSync(cmdPath)) {
  return require(cmdPath)(params);
}

console.log(`Invalid command '${cmd}'`);
