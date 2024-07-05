// const puppeteer = require("puppeteer");
const puppeteer = require("puppeteer-stream");
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteerExtra.use(StealthPlugin());
// const puppeteer = require('puppeteer');
const fs = require('fs');
function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

(async() => {
  console.log('start', new Date());
    let finishTime;
    let fileName = "test_"+new Date().getTime() +".wav"
    let browser = await puppeteer.launch({
        defaultViewport: {
          width: 1180,
          height: 950,
        },
        headless:false,
        args: [
          "--no-sandbox",
        //   "--headless=new",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          '--use-fake-device-for-media-stream', // Simulates the user selecting media devices
        ],
        ignoreHTTPSErrors: true,
        // executablePath: "/usr/bin/chromium",
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      });
    let page = await browser.newPage();
    await page.goto('https://us04web.zoom.us/j/75166354739?pwd=NU1dQTsJHY2RKuFDXJEmhbNCSFR8F1.1');
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        // Block certain types of requests (e.g., those ending with .pdf)
        if (request.url().endsWith('.pkg')) {
            request.abort();
        } else {
            request.continue();
        }
    });
    await delay(2000);
    await page.waitForSelector('.mbTuDeF1');
    await page.evaluate(()=>{
        document.querySelector('.mbTuDeF1').click();
    });
    await page.waitForSelector('.rm-presentation>span>a');
    await page.evaluate(() => {
        document.querySelector('.rm-presentation>span>a').click();
    });
    await page.waitForNavigation();
    const frameHandle = await page.waitForSelector('iframe');
    const iframeContent = await frameHandle.contentFrame();
    if(await iframeContent.$('#inputname')){
        await iframeContent.type('#inputname','PlannerPal');
        const frameHandle1 = await iframeContent.waitForSelector('.recaptcha>div>div>div>iframe');
        const iframeContent1 = await frameHandle1.contentFrame();
        // await iframeContent1.wa()
        await iframeContent1.click('.recaptcha-checkbox-border');
    }
    let check = await iframeContent.$('.error-message');
    if(check){
        console.log('closing');
        await browser.close({ force: true });
        return ''
    }
    await iframeContent.waitForSelector('#input-for-name')
    await iframeContent.type('#input-for-name','PlannerPal')
    await iframeContent.click('.preview-join-button');
    // const stream = await puppeteer.getStream(page, { audio: true});
    // const file = fs.createWriteStream(fileName);
    // stream.pipe(file);
    // let recordingTime = 0;
    // const promiseRes = await new Promise((resolve) => {
    //     let closing = false; // Variable to track whether closure process has started
    //     const intervalId = setInterval(async () => {
    //       if (await iframeContent.$('.zm-modal.zm-modal-legacy') && !closing) {
    //         closing = true; // Set closing to true to prevent multiple attempts
    //         stream.destroy();
    //         file.close();
    //         clearInterval(intervalId);
    //         resolve(closing);
    //         var date = new Date();
    //         var finalDate = date.toISOString().split('T')[1].split('.')[0].split(':');
    //         finishTime = finalDate[0] + ':' + finalDate[1];
    //       }
    //       recordingTime +=30;
    //     }, 30000);
    // });
    // browser.disconnect();
    // fs.unlinkSync(fileName);
    // await browser.close({ force: true });
    console.log('closed',new Date());
})();