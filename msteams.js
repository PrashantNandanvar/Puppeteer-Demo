const puppeteerStream = require("puppeteer-stream");
const puppeteer = require('puppeteer');
const fs = require('fs');
const URL = require('url').URL;
function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
(async() => {
    console.log('start',new Date());
    // const url = new URL(`https://teams.microsoft.com/l/meetup-join/19%3ameeting_YTIzMjg5MWEtMWU2ZC00YzA3LTllN2UtNTk1NjJiYzQ1NTU2%40thread.v2/0?context=%7b%22Tid%22%3a%229ebd71-44a0-4546-bc51-1226420ee068%22%2c%22Oid%22%3a%228da8c3a3-e3c9-4915-9d81-ff0ecf915017%22%7d`);
    const url = new URL(`https://teams.live.com/meet/9597315100837?p=iaYptLkgLwSy2n6g`);
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 1180,
			height: 940,
		},
        headless:false,
        args: [
            "--no-sandbox",
          //   "--headless=new",
            // "--disable-gpu",
            "--disable-dev-shm-usage",
          ],
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        // executablePath: "/Users/ztlab57/Desktop/backup/chromium/lib/chromium/chrome-mac/Chromium.app/Contents/MacOS/Chromium",
    });
    const context = browser.defaultBrowserContext();
    context.clearPermissionOverrides();
    context.overridePermissions(url.origin, ['microphone']);
  
    const page = await context.newPage();
    await page.goto(url.href);
    await page.evaluate(()=>{
        document.querySelectorAll('[data-tid="joinOnWeb"]')[0].click()
    });
    // await delay(3500);
    // await page.waitForSelector('#dialog-header-2').catch((err) => {
    //     console.log(err);
    // });
    // console.log(await page.$('#dialog-header-2'));
    // await page.waitForSelector('.fui-Input__input');
    // await page.type('.fui-Input__input','PlannerPal');
    // await page.evaluate(() => {
    //     document.querySelectorAll('.ui-checkbox__indicator')[1].click();
    //     document.querySelector('#prejoin-join-button').click();
    // })
    // const frameHandle = await page.waitForSelector('iframe');
    // const iframeContent = await frameHandle.contentFrame();
    // await iframeContent.waitForSelector('.fui-Input__input')
    // await page.type('[data-tid="prejoin-display-name-input"]','PlannerPal');
    // await page.evaluate(() => {
    //     document.querySelector('[data-tid="prejoin-display-name-input"]').value = 'PlannerPal'
    // })
    // await iframeContent.click('#prejoin-join-button');
    // const frameHandle1 = await page.waitForSelector('iframe');
    // const iframeContent1 = await frameHandle1.contentFrame();
    // await iframeContent1.evaluate(() => {
    //     console.log(document.querySelector('#microphone-button'));
    // })
    // await iframeContent1.click('#microphone-button')
    
    // const stream = await puppeteer.getStream(page, { audio: true});
	// console.log("recording",new Date());
    // const file = fs.createWriteStream(__dirname + "/test.wav");
	// stream.pipe(file);
    // stream.on('end',()=>{
    //     console.log('meeting closed');
    //     stream.destroy();
    //     file.close();
    // });
})();
