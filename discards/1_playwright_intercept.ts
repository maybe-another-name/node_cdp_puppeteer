import { BrowserType, Page, Request, Route } from "playwright-core";

import { chromium } from "playwright-core";

// discard reasons:
// * as with other playwright: no support for redirect (https://github.com/microsoft/playwright/issues/3993)
// does support CDP access, but not reason to use this over puppeteer + cdp

function route_for_resource_type(resource_type: string, route: Route): boolean {
  let request = route.request();
  if (request.resourceType() === resource_type) {
    console.log(`aborting ${resource_type} request to ${request.url()}`);
    route.abort();
    return true;
  }
  return false;
}

async function setupRouting(page: Page): Promise<void> {
  // file extensions are separate routes (additional suffixes would interfere)
  await page.route("**/*.{png,jpg,jpeg}", (route) => {
    let request = route.request();
    console.log(`aborting request to  ${request.url()}`);
    route.abort();
  });
  await page.route("**/*.{js}", (route) => {
    let request = route.request();
    console.log(`aborting to ${request.url()}`);
    route.abort();
  });

  // Abort based on the request type
  await page.route("**/*", (route) => {
    let request = route.request();

    // test based on content-types
    if (route_for_resource_type("image", route)) {
      return;
    }
    if (route_for_resource_type("script", route)) {
      return;
    }

    // default accept
    console.log(`default proceed to host ${request.url()}`);
    route.continue();
  });
}

(async () => {
  const browser_options = {
    headless: false,
    executablePath: "/usr/bin/chromium",
    userDataDir: "local_chrome_data",
    args: ["--proxy-server=http://127.0.0.1:8080"],
    ignoreDefaultArgs: ["--disable-extensions"],
  };

  console.log("launching browser");
  const browser = await chromium.launchPersistentContext(
    browser_options.userDataDir,
    browser_options
  );

  console.log("browser new page");
  const page: Page = await browser.newPage();

  setupRouting(page);

  console.log("navigating browser");
  await page.goto("https://techoverflow.net/");
  await page.screenshot({ path: "example.png" });

  // await browser.close();
})();
