import puppeteer, { Browser } from "puppeteer-core";

// https://stackoverflow.com/questions/48986851/puppeteer-get-request-redirects

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
  const [page] = await browser.pages();
  const redirects: any = [];

  const client = await page.target().createCDPSession();
  await client.send("Network.enable");

  //https://chromedevtools.github.io/devtools-protocol/tot/Network/#event-requestWillBeSent
  client.on("Network.requestWillBeSent", (requestToBeSent) => {
    try {
      if (requestToBeSent.type !== "Document") {
        return;
      }
      if (requestToBeSent.request.headers.hasOwnProperty("Referer")) {
        redirects.push(requestToBeSent.documentURL);
        console.log(`Redirection to ${requestToBeSent.documentURL}`);
      }
    } catch (error) {
      console.error(error);
    }
  });

  await page.goto("https://www.ford.com");
  // await page.waitForNavigation();

  console.log(redirects);
}

(async () => {
  run_it();
})();
