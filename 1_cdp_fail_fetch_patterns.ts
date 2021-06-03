import puppeteer, { Browser, CDPSession } from "puppeteer-core";
import Protocol from "devtools-protocol";

async function run_it() {
  let page = await setupSessionAndInterceptor();
  await page.goto(`https://stackoverflow.com`);
}

const acceptableSiteRegex: RegExp = /.*stackoverflow.com.*/i;

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
    let fetchParam: any = { requestId: event.requestId };
    if (!requestUrl.match(acceptableSiteRegex)) {
      fetchParam["errorReason"] = "BlockedByClient";
      console.log(`failing request to url: ${requestUrl}`);
      await this.cdpSession.send("Fetch.failRequest", fetchParam);
    } else {
      console.log(`continuing request to url: ${requestUrl}`);
      await this.cdpSession.send("Fetch.continueRequest", fetchParam);
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

(async () => {
  run_it();
})();
