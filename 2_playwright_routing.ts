import * as site_data from "./sites/site_data";

import { BrowserContext, BrowserType, Page, Request, Route } from "playwright-core";

import { chromium } from "playwright-core";

// attempts to use playwright routing to fail/abort requests
// doesn't fail redirects
async function run_it() {
  const browser_options = {
    headless: false,
    executablePath: "/usr/bin/chromium",
    userDataDir: "local_chrome_data",
    args: ["--proxy-server=http://127.0.0.1:8080"],
    ignoreDefaultArgs: ["--disable-extensions"],
  };

  console.log("launching browser");
  const browserContext: BrowserContext = await chromium.launchPersistentContext(
    browser_options.userDataDir,
    browser_options
  );

  await setupRouting(browserContext);

  console.log("browser new page");
  const page: Page = await browserContext.newPage();

  // setupRouting(page);

  console.log("navigating browser");

  interface PageOptions {
    referer?: string;
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle";
  }

  const page_options: PageOptions = {
    waitUntil: "domcontentloaded",
  };

  try {
    await page.goto(site_data.site_2, page_options);
    const selector= ".body-40"
    await page.waitForSelector(selector);
    console.log(`found selector ${selector}`);
    await page.screenshot({ path: "example.png" });
  } catch (error) {
    console.error(error);
  }

  // await browser.close();
}

async function setupRouting(pageOrBrowserContext: Page|BrowserContext): Promise<void> {
  // file extensions are separate routes (additional suffixes would interfere)
  await pageOrBrowserContext.route("**/*.{png,jpg,jpeg}", (route) => {
    let request = route.request();
    console.debug(`aborting request to ${request.url()}`);
    route.abort();
  });

  // permitted pages
  await pageOrBrowserContext.route(site_data.admitted_pages, (route) => {
    let request = route.request();
    console.debug(`continuing request to ${request.url()}`);
    route.continue();
  });


  // Abort based on the request type
  await pageOrBrowserContext.route("**/*", (route) => {
    let request = route.request();
    console.debug(`default abort to ${request.url()}`);
    route.abort();
  });
}

function route_for_resource_type(resource_type: string, route: Route): boolean {
  let request = route.request();
  if (request.resourceType() === resource_type) {
    console.debug(`aborting ${resource_type} request to ${request.url()}`);
    route.abort();
    return true;
  }
  return false;
}

const DEBUG_MODE_ON = true;
if (!DEBUG_MODE_ON) {
  console = console || {};
  console.debug = function () {};
}

(async () => {
  run_it();
})();
