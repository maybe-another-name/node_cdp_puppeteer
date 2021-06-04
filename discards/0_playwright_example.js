const { chromium } = require("playwright-core");

// discard reasons: 
// * as with other playwright: no support for redirect (https://github.com/microsoft/playwright/issues/3993)
// does support CDP access, but not reason to use this over puppeteer + cdp

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
    (userDataDir = browser_options.userDataDir),
    (options = browser_options)
  );

  console.log("browser new page");
  const page = await browser.newPage();
  console.log("navigating browser");
  await page.goto("https://example.com");
  await page.screenshot({ path: "example.png" });

  // await browser.close();
})();
