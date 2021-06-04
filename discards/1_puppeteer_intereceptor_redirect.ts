import puppeteer, { Browser } from "puppeteer-core";

import { intercept, patterns } from "puppeteer-interceptor";
import { Interceptor } from "puppeteer-interceptor";


// discard reasons: 
// * doesn't work 
// (perhaps a user error; either way - it didn't succeed in making it easier than just CDP)

// attempting interception using the 'puppeteer-interceptor'
// example taken from readme + test: 
// https://github.com/jsoverson/puppeteer-interceptor/blob/master/test/index.test.ts
// doesn't work
(async function () {
  const browser_options = {
    headless: false,
    executablePath: "chromium",
    userDataDir: "local_chrome_data",
    args: ["--proxy-server=http://127.0.0.1:8080"],
    ignoreDefaultArgs: ["--disable-extensions"],
  };

  console.log("launching browser");

  const browser: Browser = await puppeteer.launch(browser_options);
  const [page] = await browser.pages();

  intercept(page, patterns.Script("*"), {
    onInterception: (event: Interceptor.OnInterceptionEvent, { abort }: Interceptor.ControlCallbacks) => {
      console.log(`${event.request.url} intercepted.`);
      abort('BlockedByClient');
    },
    onResponseReceived: (event: Interceptor.OnResponseReceivedEvent) => {
      console.log(`${event.request.url} intercepted, going to modify`);
      event.response.body += `\n;console.log("This script was modified inline");`;
      return event.response;
    },
  });

  await page.goto(`https://stackoverflow.com`);
})();
