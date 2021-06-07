import puppeteer, {
  Browser,
  CDPSession,
  ElementHandle,
  Frame,
} from "puppeteer-core";
import Protocol from "devtools-protocol";

import fs from "fs";

import * as site_data from "./sites/site_data";

const relevantSite: string = site_data.site_2;
const relevantUrl: string = "https://" + relevantSite;

/**
 * A few outputs (all written to the directory):
 *  1) a screen shot (site.png), taken after waiting for a css selector indicating page load
 *  2) a screen shot (nested_elemeng.png), taken after waiting for an xpath, and clicking it
 *  3) an html file (innter.html), taken after waiting for a css selector, and evaluating the innerHTML
 */
async function run_it() {
  let page = await setupSessionAndInterceptor();
  console.log("Going to site");
  await page.goto(relevantUrl);

  console.log("Awaiting for selector");
  await page.waitForSelector(site_data.selector);

  console.log("Awaiting screenshot");
  await page.screenshot({ path: "site.png" });

  console.log("Awaiting for xpath");
  let elementHandle: ElementHandle | null = await page.waitForXPath(
    site_data.xpath_to_item
  );

  console.log("Awaiting for nested selector");
  let nestedElementHandle: ElementHandle[] | undefined =
    await elementHandle?.$$(site_data.nested_selector);

  if (nestedElementHandle) {
    console.log("Awaiting for nested click");
    await nestedElementHandle[0].click();
  }

  console.log("Awaiting screenshot");
  await page.screenshot({ path: "nested_element.png" });

  console.log("Awaiting associated selector");
  let associatedElementHandle: ElementHandle | null =
    await page.waitForSelector(site_data.associated_selector);
  let innerHtml: string | null = null;
  if (associatedElementHandle) {
    console.log("Awaiting inner html");
    innerHtml = await associatedElementHandle.evaluate(
      (element) => element.innerHTML
    );
  }
  if (innerHtml) {
    fs.writeFileSync("inner.html", innerHtml);
    console.log("wrote content to file");
  }
}

const browser_options = {
  headless: false,
  executablePath: "chromium",
  userDataDir: "local_chrome_data",
  args: ["--proxy-server=http://127.0.0.1:8080"],
  ignoreDefaultArgs: ["--disable-extensions"],
};

class CdpSessionHolder {
  cdpSession: CDPSession;
  constructor(client: CDPSession) {
    this.cdpSession = client;
  }
  // arrow function so 'this' keyword has expected scope
  fetchInterceptor = async (event: Protocol.Fetch.RequestPausedEvent) => {
    let requestUrl: string = event.request.url;
    if (!requestUrl.match(site_data.site_regex)) {
      console.debug(`failing request to url: ${requestUrl}`);

      let failFetchRequest: Protocol.Fetch.FailRequestRequest = {
        requestId: event.requestId,
        errorReason: "BlockedByClient",
      };

      await this.cdpSession.send("Fetch.failRequest", failFetchRequest);
    } else {
      let continueFetchRequest: Protocol.Fetch.ContinueRequestRequest = {
        requestId: event.requestId,
      };

      console.debug(`continuing request to url: ${requestUrl}`);
      await this.cdpSession.send("Fetch.continueRequest", continueFetchRequest);
    }
  };
}

async function setupSessionAndInterceptor() {
  console.log("launching browser");
  const browser: Browser = await puppeteer.launch(browser_options);
  const [page] = await browser.pages();

  const cdpSession: CDPSession = await page.target().createCDPSession();

  await cdpSession.send("Fetch.enable", {
    patterns: [
      {
        urlPattern: "*",
        requestStage: "Request",
      },
    ],
  });

  let cdpSessionHolder: CdpSessionHolder = new CdpSessionHolder(cdpSession);

  cdpSessionHolder.cdpSession.on(
    "Fetch.requestPaused",
    cdpSessionHolder.fetchInterceptor
  );

  return page;
}

const DEBUG_MODE_ON = false;
if (!DEBUG_MODE_ON) {
  console = console || {};
  console.debug = function () {};
}

(async () => {
  await run_it();
})();
