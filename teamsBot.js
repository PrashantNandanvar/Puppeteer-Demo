const puppeteer = require("puppeteer-stream");
const URL = require('url').URL;
const fs = require('fs');
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
(async() => {
  try {
    let meetingUrl = 'https://teams.live.com/meet/9528495970892?p=kfwqWMCff9zGePwN'
    let fileName = 'testFile.wav'
    let recordingTime = 1
    const url = new URL(meetingUrl);
    const browser = await puppeteer.launch({
        defaultViewport: {
          width: 1180,
          height: 950,
        },
        headless:false,
        args: [
          "--no-sandbox",
        //   "--headless=new",
        //   "--disable-gpu",
          "--disable-dev-shm-usage",
        ],
        ignoreHTTPSErrors: true,
        // executablePath: "/usr/bin/chromium",
        executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
      });
      const context = browser.defaultBrowserContext();
      context.clearPermissionOverrides();
      context.overridePermissions(url.origin, ['microphone']);
      const page = await context.newPage();
      await page.goto(url.href);
      if(meetingUrl.includes('teams.microsoft.com')){
        // await page.evaluate(()=>{
        //   document.querySelectorAll('[data-tid="joinOnWeb"]')[0].click();
        // });
        // await delay(2500);
        // await delay(3500);
        await page.waitForSelector('#dialog-header-2').catch((err) => {
          console.log(err);
        });
        if(await page.$('#dialog-header-2')){
          await browser.close({ force: true });
          // return res.ok({
          //   status:201,
          //   data:{},
          //   message:"We couldn't find a meeting matching this ID and passcode."
          // });
          throw new Error("We couldn't find a meeting matching this ID and passcode.");
        }
        await page.waitForSelector('.fui-Input__input');
        await page.type('.fui-Input__input','PlannerPal');
        await page.evaluate(() => {
          document.querySelectorAll('.ui-checkbox__indicator')[1].click();
          document.querySelector('#prejoin-join-button').click();
        });
        
        const stream = await puppeteer.getStream(page, { audio: true,bitsPerSecond:256000});
        const file = fs.createWriteStream(fileName);
        stream.pipe(file);

        const promiseRes = await new Promise((resolve, reject) => {
          let closing = false; // Variable to track whether closure process has started
          const intervalId = setInterval(async () => {
            let text = await page.evaluate(() => {
              if(document.querySelector('h2')){
                return document.querySelector('h2').textContent;
              }
              return '';
            });
            if(text === "We've let people in the meeting know you're waiting." ||text === "When the meeting starts, we'll let people know you're waiting."){
            //   console.log('newMessage','PlannerPal waiting to join Teams call');
            }else{
            //   console.log('newMessage','PlannerPal recording Teams call');
            }
            let check = await page.evaluate(() => {
              if(!document.querySelector('#roster-button>div>span')){
                return true;
              }
              if(document.querySelector('[data-tid="anon-meeting-end-screen-rejoin-button"]')){
                return true;
              }
              return false;
            });
            recordingTime +=10;
            if (check && !closing) {
              closing = true; // Set closing to true to prevent multiple attempts
              stream.destroy();
              file.close();
              clearInterval(intervalId);
              var date = new Date();
              var finalDate = date.toISOString().split('T')[1].split('.')[0].split(':');
              finishTime = finalDate[0] + ':' + finalDate[1];
            //   console.log('newMessage','Meeting ended.  Preparing transcription');
              resolve(closing);
            }
          }, 10000);
        });
        console.log(promiseRes);
      }else{
        await page.evaluate(()=>{
          document.querySelectorAll('[data-tid="joinOnWeb"]')[0].click();
        });
        // await page.waitForSelector('.continue');
        // await page.evaluate(() => {
        //   document.querySelectorAll('.continue>button')[0].click();
        // });
        const frameHandle = await page.waitForSelector('iframe');
        const iframeContent = await frameHandle.contentFrame();
        await iframeContent.waitForSelector('.fui-Input__input');
        await iframeContent.type('.fui-Input__input','testingBot');
        await iframeContent.click('#prejoin-join-button');
        await delay(1500);
        let retryText = await iframeContent.evaluate(() => {
          if(document.querySelector('#calling-retry-screen-description')){
            return document.querySelector('#calling-retry-screen-description').textContent;
          }
        });
        if(retryText === "We couldn't find a meeting matching this ID and passcode."){
          await browser.close({ force: true });
          // return res.ok({
          //   status:201,
          //   data:{},
          //   message:retryText
          // });
          throw new Error(retryText);
        }
        let stream = await puppeteer.getStream(page, { audio: true,bitsPerSecond:256000});
        let stream1 = await puppeteer.getStream(page, { audio: true,bitsPerSecond:256000});
        let fileNames ='chunk_' + new Date().getTime() + '.wav';
        const file1 = fs.createWriteStream(fileName);
        const file = fs.createWriteStream(fileNames);
        stream1.pipe(file1);
        stream.pipe(file);
        // res.ok({
        //   status:200,
        //   data:{},
        //   message:'Meet Recording'
        // });
        const promiseRes = await new Promise(async(resolve, reject) => {
          let text = await iframeContent.evaluate(()=> {
            if(document.querySelector('h2')){
              return document.querySelector('h2').textContent;
            }
            return '';
          });
          if(text === 'We’ve let the organiser know that you’re waiting.'){
            console.log('newMessage','PlannerPal waiting to join Teams call');
          }else{
            console.log('newMessage','PlannerPal recording Teams call');
          }
          let closing = false; // Variable to track whether closure process has started
          const intervalId = setInterval(async () => {
            if(await iframeContent.$('#hangup-button')){
              console.log('newMessage','PlannerPal recording Teams call');
            }
            recordingTime +=10;
             console.log('else: '  , recordingTime % 10 === 0);
              if(recordingTime % 10 === 0){
                const endSecond = recordingTime + 1;
                // console.log('folderName: ', folderName);
                stream.destroy();
                file.close();
                fileNames ='chunk_' + new Date().getTime() + '.wav'; // Specify folder in file path
                stream = await puppeteer.getStream(page, { audio: true,bitsPerSecond:256000});
                file = fs.createWriteStream(fileNames);
                stream.pipe(file);
                file.on('close', async () => {
                  console.log("File closed, now checking existence...");
                  console.log("exist", fs.existsSync(fileNames));
                  console.log('fileNames: ', fileNames);
                  if (fs.existsSync(fileNames)) {
                      // await sails.helpers.uploadAudioS3('', fileNames);
                      console.log("File uploaded successfully.");
                  } else {
                      console.log("File doesn't exist!");
                  }
                });
                //helper call
                let mimeType = 'audio/wav';
                // let path = __dirname +'/' + folderName+'/' + fileNames;
                console.log('recording start');
                console.log('recording stop');
                
              }
            if (!await iframeContent.$('#prejoin-join-button') && (!await iframeContent.$('#hangup-button') || !await iframeContent.$('#roster-button>span>span')) && !closing) {
              closing = true; // Set closing to true to prevent multiple attempts
              file.close();
              file1.close();
              stream.destroy();
              stream1.destroy();
              clearInterval(intervalId);
              var date = new Date();
              var finalDate = date.toISOString().split('T')[1].split('.')[0].split(':');
              finishTime = finalDate[0] + ':' + finalDate[1];
              console.log('newMessage','Meeting ended.  Preparing transcription');
              resolve(closing);
            }
          }, 10000);
        });
        console.log('promiseR',promiseRes);
      }
      browser.disconnect();
    
  } catch (error) {
    console.log('this',error)
  }
})();