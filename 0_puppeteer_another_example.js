// Source = https://blog.scottlogic.com/2020/01/13/selenium-vs-puppeteer.html
// modifications to make it work, add some logs, and to use desired chromium launch settings
const puppeteer = require("puppeteer-core");
const assert = require("assert");
const { doesNotMatch } = require("assert");

let browser;
let page;

describe("search feature", () => {
  before(async () => {
    const browser_options = {
      headless: false,
      executablePath: "chromium",
      userDataDir: "local_chrome_data",
      args: ["--proxy-server=http://127.0.0.1:8080"],
      ignoreDefaultArgs: ["--disable-extensions"],
    };

    browser = await puppeteer.launch((options = browser_options));
    page = await browser.newPage();
  });

  console.log("before test")
  it("searching for a valid keyword shows 10 results", async function() {
    await page.goto("https://developers.google.com/web", {
      waitUntil: "networkidle0",
    });

    // Type a keyword into the search box and press enter
    console.log("starting search")
    await page.type(".devsite-search-field", "something");
    page.keyboard.press("Enter");

    // Wait for the results page to load and display the results
    let resultsSelector = ".gsc-results .gsc-thumbnail-inside a.gs-title";
    await page.waitForSelector(resultsSelector);

    // Check if 10 results are shown
    let results = await page.evaluate(
      (resultsSelector) =>
        Array.from(document.querySelectorAll(resultsSelector)),
      resultsSelector
    );
    assert.strictEqual(
      results.length,
      10,
      "results page did not show 10 results"
    );
    console.log("end of test")
  }).timeout(12_000);
  console.log("outside test")

  after(async () => {
    await browser.close();
    console.log("after test")
  });
});
