import puppeteer, { Browser } from "puppeteer-core";

// interacting with the 'Fetch domain' of the Chrome Devtools Protocol (CDP)
// https://github.com/puppeteer/puppeteer/issues/1191#issuecomment-639171807
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

  const client = await page.target().createCDPSession();

  await client.send("Fetch.enable", {
    patterns: [
      {
        urlPattern: "*",
        requestStage: "Request",
      },
    ],
  });

  client.on("Fetch.requestPaused", async (event: any) => {
    let headers = event.responseHeaders || [];
    let contentType = "";
    for (let elements of headers) {
      if (elements.name === "Content-Type") {
        contentType = elements.value;
      }
    }
    let obj: any = { requestId: event.requestId };
    obj["errorReason"] = "BlockedByClient";
    await client.send("Fetch.failRequest", obj);
  });

  await page.goto(`https://stackoverflow.com`);
})();
