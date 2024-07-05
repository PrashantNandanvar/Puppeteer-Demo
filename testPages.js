const { launch, getStream } = require("puppeteer-stream");
const URL = require('url').URL;
let browserInstance;
async function launchInstance() {
  if (!browserInstance) {
    browserInstance = await launch({
        defaultViewport: {
          width: 1180,
          height: 950,
        },
        headless:false,
        args: [
          "--no-sandbox",
          // "--headless=new",
          // "--disable-gpu",
          "--disable-dev-shm-usage",
        ],
        ignoreHTTPSErrors: true,
        // executablePath: "/usr/bin/chromium",
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      });
  }
  const pages = await browserInstance.pages(); 
  if(pages.length >= 5){
    browserInstance = await launch({
      defaultViewport: {
        width: 1180,
        height: 950,
      },
      headless:false,
      args: [
        "--no-sandbox",
        // "--headless=new",
        // "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
      ignoreHTTPSErrors: true,
      // executablePath: "/usr/bin/chromium",
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
  }
  console.log(pages.length)
  return browserInstance;
}
async function recordMSTeams(){
    let browser = await launchInstance();
    const url = new URL('https://teams.live.com/meet/9583711676197?p=oyfAsmI0hsit5k3m');
    // const context = browser.defaultBrowserContext();
    // context.clearPermissionOverrides();
    // context.overridePermissions(url.origin, ['microphone']);
    // const page = await context.newPage();
    // // await page.setExtraHTTPHeaders({ apikey: process.env.ZENSCRAPE_PROXY });
    // await page.goto(url.href);
}

recordMSTeams()