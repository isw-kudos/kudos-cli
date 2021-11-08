# kudos-cli

Command line utility for running Kudos microservices

## v2 breaking change

now uses `yarn add` for updeps

## HOW TO DEV
1. Do some reading on NodeJS command line development. Try this: https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e

1. `npm remove kudos-cli` maybe? So it doesn't conflict with our dev version.

1. `npm link` see the reading above. It'll make the `kudos` command reference our dev version.

1. Now when you run `kudos dev all` or similar, it should be running your dev code.

### Releasing an update
1. Update version in package.json 
2. `npm login`
3. `npm publish`
