# Testing various Chrome Devtools Protocol (CDP) Libraries

* CDP library - interacting with requests & responses to drive the browser.
* Canonical one is Puppeteer; managed by Google to demo CDP. 
  * Some extensions to this (ex: puppeteer-interceptor)
* Playwright; managed by Microsoft; led by the old Puppeteer TL

## Install - executables (node/npm)

Requires node to be installed.

Installing with apt (installing node will provide npm):

- https://github.com/nodesource/distributions/blob/master/README.md

**Note**: Packages installed with snap do not work inside a network namespace:

- https://forum.snapcraft.io/t/cannot-run-snaps-apps-inside-a-custom-netns-or-a-tmux-session/17501

### Conventions

* Using the 'core' version of libraries (which don't include a browser), and instead using a separate browser. Puppeteer scripts expect the browser to be available as 'chromium'; Playwright scripts expect the full path (/usr/bin/chromium).
* Most scripts expect a proxy; the relevant line can be commented out/changed.

## Setup

> npm install puppeteer-core

### deprecated, but still included (possibly including relevant dependencies)

> npm install playwright-core
> npm install puppeteer-interceptor

### dev deps

> npm install --save-dev mocha
> npm install --save-dev typescript
> npm install --save-dev ts-node

### one time setup, if the tsconfig isn't present

> npx tsc --init

## Running - Examples

### Running (launch arguments expect the proxy to be running)

> node 0_puppeteer_example.js

### Running typescript (launch arguments expect the proxy to be running)

> npx ts_node 1_playwright_intercept.ts

### Running with mocha (expects the package.json to have the scripts.test attribute)

> npm test 0_puppeteer_another_example.js
