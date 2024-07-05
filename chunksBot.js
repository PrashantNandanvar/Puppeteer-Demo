const { launch, getStream } = require("puppeteer-stream");
const URL = require("url").URL;
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const path = require('path');
const { Writable } = require("stream");
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// async function splitAudioIntoChunks(inputFilePath, outputDir, baseFileName, chunkDuration) {
//     return new Promise((resolve, reject) => {
//       ffmpeg(inputFilePath)
//         .outputOptions('-f segment', `-segment_time ${chunkDuration}`, '-c copy')
//         .output(path.join(outputDir, `${baseFileName}_%03d.wav`))
//         .on('end', () => {
//           console.log('Audio split into chunks successfully.');
//           fs.unlinkSync(inputFilePath); // Delete the original file
//           resolve();
//         })
//         .on('error', (err) => {
//           console.error('Error splitting audio:', err);
//           reject(err);
//         })
//         .run();
//     });
//   }


(async () => {
  let browser; // calling browser
  let meetingUrl = "https://teams.live.com/meet/9541089088906?p=avtlIitT6c7N0o7kte";
  let adviserId = " "; //req.body.adviserId;
  let groupId = " ";
  let adviserEmail = "";
  let selfReportedFirmName = "";
  let adviserPhone = "";
  let adviserName = "";
  let adviserData = {};
  let finishTime;
  let remainingBuffer = Buffer.alloc(0);
  let fileName =
    groupId && groupId !== " "
      ? groupId + "_" + new Date().getTime() + ".wav"
      : "test_" + new Date().getTime();
  let uploadToS3;
  try {
    console.log("start", new Date());
    if (meetingUrl && adviserId && groupId) {
      let botName = "PlannerPal";
      const url = new URL(meetingUrl);
      let recordingTime = 0;
      console.log(groupId, "newMessage", "PlannerPal joining Teams call now");
      browser = await launch({
        defaultViewport: {
          width: 1180,
          height: 950,
        },
        headless: false,
        args: [
          "--no-sandbox",
        //   "--headless=new",
          // "--disable-gpu",
          "--disable-dev-shm-usage",
        ],
        ignoreHTTPSErrors: true,
        // executablePath: "/usr/bin/chromium",
        executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      });
      const context = browser.defaultBrowserContext();
      context.clearPermissionOverrides();
      context.overridePermissions(url.origin, ["microphone"]);
      const page = await context.newPage();
      await page.goto(url.href);
      await page.evaluate(()=>{
        document.querySelectorAll('[data-tid="joinOnWeb"]')[0].click();
      });
      const frameHandle = await page.waitForSelector("iframe");
      const iframeContent = await frameHandle.contentFrame();
      await iframeContent.waitForSelector(".fui-Input__input");
      await iframeContent.type(".fui-Input__input", botName);
      await iframeContent.click("#prejoin-join-button");
      await delay(1500);
      let retryText = await iframeContent.evaluate(() => {
        if (document.querySelector("#calling-retry-screen-description")) {
          return document.querySelector("#calling-retry-screen-description")
            .textContent;
        }
      });
      if (
        retryText ===
        "We couldn't find a meeting matching this ID and passcode."
      ) {
        await browser.close({ force: true });
        throw new Error(retryText);
      }
      const stream = await getStream(page, {
        audio: true,
        bitsPerSecond: 256000,
        codec: "wav",
        mimeType: "audio/webm;codecs=pcm",
        frameSize:60000
      });
      stream.on('data', (chunks)=> {
        fileName =
            groupId && groupId !== " "
            ? groupId + "_" + new Date().getTime() + ".wav"
            : "test_" + new Date().getTime() + ".wav";
        let bufferData = Buffer.from(chunks);
        console.log(bufferData);
        fs.writeFileSync(fileName,bufferData,(err) => {
            if (err) {
                console.error('Error writing the audio buffer to file:', err);
            }
        });
      });
      const promiseRes = await new Promise(async (resolve, reject) => {
        let text = await iframeContent.evaluate(() => {
          if (document.querySelector("h2")) {
            return document.querySelector("h2").textContent;
          }
          return "";
        });
        if (text === "We’ve let the organiser know that you’re waiting.") {
          console.log(
            groupId,
            "newMessage",
            "PlannerPal waiting to join Teams call"
          );
        } else {
          console.log(groupId, "newMessage", "PlannerPal recording Teams call");
        }
        let closing = false; // Variable to track whether closure process has started
        const intervalId = setInterval(async () => {
          if (await iframeContent.$("#hangup-button")) {
            console.log(
              groupId,
              "newMessage",
              "PlannerPal recording Teams call"
            );
          }
          recordingTime += 10;
          if (
            !(await iframeContent.$("#prejoin-join-button")) &&
            (!(await iframeContent.$("#hangup-button")) ||
              !(await iframeContent.$("#roster-button>span>span"))) &&
            !closing
          ) {
            closing = true; // Set closing to true to prevent multiple attempts
            stream.end();
            clearInterval(intervalId);
            var date = new Date();
            var finalDate = date
              .toISOString()
              .split("T")[1]
              .split(".")[0]
              .split(":");
            finishTime = finalDate[0] + ":" + finalDate[1];
            console.log(
              groupId,
              "newMessage",
              "Meeting ended.  Preparing transcription"
            );
            resolve(closing);
          }
        }, 10000);
      });

      browser.disconnect();
      console.log("disconnected");
      let data = {
        adviserId: adviserId,
        recordingTime: recordingTime,
        groupId: groupId,
        fileName: fileName,
        adviserData: adviserData,
        finishTime: finishTime,
        meetingUrl: meetingUrl,
        // token: req.headers["x-auth"],
        meetType: "Teams call",
        errorRecording: "false",
      };

      console.log(groupId, "resultData");
      await browser.close({ force: true });
      // console.log('closed',new Date());
    } else {
    console.log("Please Add All Required Fields");
    }
  } catch (error) {
    let obj = {
      meetingUrl,
      adviserId,
      message: error.message,
      adviserName,
      adviserEmail,
      adviserPhone,
      selfReportedFirmName,
      meetType: "Teams call",
      retryMessage: "",
    };
    console.log(groupId, "errorMessage", error.message);
    let check = false;
    return "";
  } finally {
    // Close the browser if it's open to ensure resources are properly released
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
})();
