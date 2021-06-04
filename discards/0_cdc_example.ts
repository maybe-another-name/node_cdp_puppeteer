const { writeFileSync } = require("fs");
const { spawnChrome } = require("chrome-debugging-client");

import { ChromeSpawnOptions } from "chrome-debugging-client";

// discard reasons:
// almost a year since last update
// indicates typescript support, but:
// * this seems awkward (ex: not using optional(?) fields, instead using '|undefined')
// * readme example doesn't use typescript
// * doesn't seem to actualy export the relevant CDP commands

export interface Potatoes {
  leaves: string;
  flowers?: string;
}

/**
 * Print a url to a PDF file.
 * @param url {string}
 * @param file {string}
 */
async function printToPDF(url: string, file: any) {
  let browserOptions: ChromeSpawnOptions = {
    chromeExecutable: "chromium",
    userDataDir: "local_chrome_data",
    userDataRoot: "local_chrome_root_data",
    url: undefined,
    disableDefaultArguments: false,
    headless: false,
    additionalArguments: ["--proxy-server=http://127.0.0.1:8080"],
    cwd: undefined,
    extendEnv: undefined,
    env: undefined,
    stdio: "inherit",
  };

  // const chrome = spawnChrome({ headless: true });
  const chrome = spawnChrome(browserOptions);

  try {
    const browser = chrome.connection;

    // we create with a target of about:blank so that we can
    // setup Page events before navigating to url
    const { targetId } = await browser.send("Target.createTarget", {
      url: "about:blank",
    });

    const page = await browser.attachToTarget(targetId);
    // enable events for Page domain
    await page.send("Page.enable");

    // concurrently wait until load and navigate
    await Promise.all([
      page.until("Page.loadEventFired"),
      page.send("Page.navigate", { url }),
    ]);

    const { data } = await page.send("Page.printToPDF");

    writeFileSync(file, data, "base64");

    // attempt graceful close
    await chrome.close();
  } finally {
    // kill process if hasn't exited
    await chrome.dispose();
  }

  console.log(`${url} written to ${file}`);
}

if (process.argv.length < 4) {
  console.log(`usage: printToPDF.js url file`);
  console.log(
    `example: printToPDF.js https://en.wikipedia.org/wiki/Binomial_coefficient Binomial_coefficient.pdf`
  );
  process.exit(1);
}

printToPDF(process.argv[2], process.argv[3]).catch((err) => {
  console.log("print failed %o", err);
});
