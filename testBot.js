const { launch, getStream } = require("puppeteer-stream")
const puppeteer = require('puppeteer');
const fs = require('fs');
const URL = require('url').URL;
const WebSocket = require('ws');
function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
(async() => {
    // let fileName = "test_"+new Date().getTime() +".wav"
    console.log('start',new Date());
    // const url = new URL(`https://teams.microsoft.com/l/meetup-join/19%3ameeting_MjU1NjMwM2MtYTNlOC00OTAyLThiOGEtOTFiOGYxNTUyZTJj%40thread.v2/0?context=%7b%22Tid%22%3a%22fc80481a-272b-4fdb-b635-a3f6b0887a51%22%2c%22Oid%22%3a%22e77ca4-2d21-4551-8d44-fb1a10d0cf57%22%7d`);
    const url = new URL(`https://teams.live.com/meet/9541713749776?p=9Bw04oSc0e7OsQ0O`);
    const browser = await launch({
        defaultViewport: {
            width: 1180,
			height: 940,
		},
        headless:false,
        args: [
            "--no-sandbox",
            // "--headless=new",
            "--disable-dev-shm-usage",
          ],
        // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        executablePath: "/Users/ztlab57/Downloads/Chromium.app/Contents/MacOS/Chromium",
    });
    const context = browser.defaultBrowserContext();
    context.clearPermissionOverrides();
    context.overridePermissions(url.origin, ['microphone']);
    
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({ apikey: '6ddeff60-f60c-11ed-9528-497698e17db2' });
    // console.log('object');
    await page.goto(url.href);
    await page.evaluate(()=>{
        document.querySelectorAll('[data-tid="joinOnWeb"]')[0].click()
    });
    // const frameHandle = await page.waitForSelector('iframe');
    // const iframeContent = await frameHandle.contentFrame();
    // await iframeContent.waitForSelector('.fui-Input__input');
    // await iframeContent.type('.fui-Input__input','Planner Pal');
    // socket.on('open', () => {
    //   console.log('Connected to WebSocket server');
    // //   socket.broadcast('joiningMeet','User Is On Joining Screen');
    //   socket.send('Waiting To Join');
    // });
    // await iframeContent.click('#prejoin-join-button');
    // await delay(1500);
    // let retryText = await iframeContent.evaluate(() => {
    //   if(document.querySelector('#calling-retry-screen-description')){
    //     return document.querySelector('#calling-retry-screen-description').textContent;
    //   }
    // });
    // console.log(await page.$('#dialog-header-2'));
    // await page.waitForSelector('#dialog-header-2').catch((err) => {
    //   console.log(err);
    // });
    // if(await page.$('#dialog-header-2')){
    //   await browser.close({ force: true });
    //   // return res.ok({
    //   //   status:201,
    //   //   data:{},
    //   //   message:"We couldn't find a meeting matching this ID and passcode."
    //   // });
    //   throw new Error("We couldn't find a meeting matching this ID and passcode.");
    // }
    // await page.waitForSelector('.fui-Input__input');
    // await page.type('.fui-Input__input','PlannerPal');
    // await page.evaluate(() => {
    //   document.querySelectorAll('.ui-checkbox__indicator')[1].click();
    //   document.querySelector('#prejoin-join-button').click();
    // });
    // console.log('this is called',page);
    // const stream = puppeteerStream.getStream(page, { audio: true});
    // console.log('this is called 2');
    // const file = fs.createWriteStream(fileName);
    // console.log('this is called 3');
    // stream.pipe(file);
    // console.log('this is called 4');
    // let recordingTime = 0;
    // const promiseRes = await new Promise((resolve, reject) => {
    //   let closing = false; // Variable to track whether closure process has started
    //   const intervalId = setInterval(async () => {
    //     console.log(await iframeContent.$('#roster-button>div>span'));
    //     if ((!await iframeContent.$('#hangup-button') || !await iframeContent.$('#roster-button>div>span')) && !closing) {
    //       closing = true; // Set closing to true to prevent multiple attempts
    //       // stream.destroy();
    //       // file.close();
    //       clearInterval(intervalId);
    //       resolve(closing);
    //       var date = new Date();
    //       var finalDate = date.toISOString().split('T')[1].split('.')[0].split(':');
    //       finishTime = finalDate[0] + ':' + finalDate[1];
    //     }
    //     recordingTime +=30;
    //   }, 30000);
    // });
    // console.log(promiseRes,'this');
    // browser.disconnect();
    // console.log('closing browser');
    // await browser.close({ force: true });
    // console.log('closed',new Date());
})();
