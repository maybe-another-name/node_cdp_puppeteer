const puppeteer = require("puppeteer-core");

(async () => {
  const browser_options = {
    headless: false,
    executablePath: "chromium",
    userDataDir: "local_chrome_data",
    args: ["--proxy-server=http://127.0.0.1:8080"],
    ignoreDefaultArgs: ["--disable-extensions"],
  };

  const browser = await puppeteer.launch((options = browser_options));

  const page = await browser.newPage();
  await page.goto("https://example.com");
  await page.screenshot({ path: "example.png" });

  // await browser.close();
})();
