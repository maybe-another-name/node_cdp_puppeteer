import * as site_data from "./sites/site_data";

import puppeteer, { HTTPResponse } from "puppeteer-core";

import { Page, Browser, WaitForOptions } from "puppeteer-core";

// attempts to use puppeteer request interception to fail/abort requests
// doesn't fail redirects
async function run_it() {
  const browser_options = {
    headless: false,
    executablePath: "chromium",
    userDataDir: "local_chrome_data",
    args: ["--proxy-server=http://127.0.0.1:8080"],
    ignoreDefaultArgs: ["--disable-extensions"],
  };

  console.log("launching browser");
  const browser: Browser = await puppeteer.launch(browser_options);

  console.log("browser new page");
  const page: Page = await browser.newPage();

  await page.setRequestInterception(true);
  setupInterception(page);

  console.log("navigating browser");

  const page_options: WaitForOptions = {
    waitUntil: "domcontentloaded",
  };

  try {
    await page.goto(site_data.site_2, page_options);
    const selector = ".body-40";
    await page.waitForSelector(selector);
    console.log(`found selector ${selector}`);
    await page.screenshot({ path: "example.png" });
  } catch (error) {
    console.error(error);
  }

  // await browser.close();
}

let lastRedirectResponse: any = null;
const redirectStatuses = [301, 302, 303, 307, 308];

function setupInterception(page: Page): void {
  page.on("request", async (request) => {
    if (
      lastRedirectResponse &&
      lastRedirectResponse.headers.location === request.url
    ) {
      console.log(`continuing redirect page: ${request.url()}`);
      request.continue();
    }

    if (request.url().match(site_data.admitted_pages)) {
      // console.log(`continuing page: ${request.url()}`);
      request.continue();
    } else {
      // console.log(`aborting page: ${request.url()}`);
      request.abort();
    }
  });

  page.on("response", async (response) => {
    if (
      redirectStatuses.includes(response.status()) &&
      response.request().resourceType() === "document"
    ) {
      lastRedirectResponse = response;
      console.log(
        `detected redirect from:\n\t ${response.url()} to \n\t${
          response.headers().location
        }`
      );
    }
  });
}

const DEBUG_MODE_ON = true;
if (!DEBUG_MODE_ON) {
  console = console || {};
  console.debug = function () {};
}

(async () => {
  run_it();
})();
