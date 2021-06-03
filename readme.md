# Testing with node

Requires node to be installed (ex: with the 'classic' snap)

## Install - executables (node/npm)
Packages installed with snap do not work inside a network namespace:
* https://forum.snapcraft.io/t/cannot-run-snaps-apps-inside-a-custom-netns-or-a-tmux-session/17501

Installing with apt (installing node will provide npm):
* https://github.com/nodesource/distributions/blob/master/README.md

## Setup
npm install puppeteer-core
npm install playwright-core

### deprecated, but still included
npm install puppeteer-interceptor

### dev deps
npm install --save-dev mocha
npm install --save-dev typescript
npm install --save-dev ts-node
# npx tsc --init

## Running - Examples

### Running (launch arguments expect the proxy to be running)
> node 0_puppeteer_example.js

### Running typescript (launch arguments expect the proxy to be running)
> npx ts_node 1_playwright_intercept.ts

### Running with mocha (expects the package.json to have the scripts.test attribute)
> npm test 0_puppeteer_another_example.js