#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const config = require('./config');
const [,, ...args] = process.argv;
const [cmd, ...params] = args;

const simple = config.simple[cmd];
if(simple)
  return require('./lib/exec').execute(simple).catch(() => {});

const cmdPath = path.resolve(__dirname, `./bin/${cmd}.js`);
if (fs.existsSync(cmdPath)) {
  return require(cmdPath)(params);
}

console.log(`Invalid command '${cmd}'`);
