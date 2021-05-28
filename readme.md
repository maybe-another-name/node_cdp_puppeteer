# Testing with node

Requires node to be installed (ex: with the 'classic' snap)

## Install - executables (node/npm)
Packages installed with snap do not work inside a network namespace:
* https://forum.snapcraft.io/t/cannot-run-snaps-apps-inside-a-custom-netns-or-a-tmux-session/17501

Installing with apt (installing node will provide npm):
* https://github.com/nodesource/distributions/blob/master/README.md

## Setup
npm install puppeteer-core
npm install mocha

## Running - Examples

### Running (launch arguments expect the proxy to be running)
> node 0_puppeteer_example.js

### Running with mocha (expects the package.json to have the scripts.test attribute)
>npm test 0_puppeteer_another_example.js