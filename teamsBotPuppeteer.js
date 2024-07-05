// const puppeteer = require("puppeteer");
// const URL = require('url').URL;
// const fs = require('fs');
// const ffmpeg = require('fluent-ffmpeg');
// function delay(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// function startRecording(outputPath) {
//   return ffmpeg()
//       .input('default') // This should be your virtual audio capture device
//       .inputFormat('alsa') // Change according to your platform, 'alsa' for Linux, 'dshow' for Windows, etc.
//       .audioCodec('pcm_s16le')
//       .audioFrequency(44100)
//       .audioChannels(2)
//       .on('start', function(commandLine) {
//           console.log('Spawned Ffmpeg with command: ' + commandLine);
//       })
//       .on('error', function(err) {
//           console.log('An error occurred: ' + err.message);
//       })
//       .on('end', function() {
//           console.log('Recording finished!');
//       })
//       .save(outputPath);
// }

// function stopRecording(recorder) {
//   recorder.kill();
// }

// (async()=>{
//     let browser;// calling browser
//     let meetingUrl = 'https://teams.live.com/meet/9522752915127?p=25djisL3e2gQozmjkF' //req.body.meetingUrl;
//     let adviserId =' '// req.body.adviserId;
//     let groupId =  ' ';
//     let adviserEmail = '';
//     let selfReportedFirmName = '';
//     let adviserPhone = '';
//     let adviserName = '';
//     let adviserData = {};
//     let finishTime;
//     let fileName = groupId && groupId !== ' ' ? groupId + '_' + new Date().getTime() + '.wav' : "test_"+new Date().getTime() +".wav"
//     let uploadToS3;
//     try {
//       console.log('start',new Date());
//       if(meetingUrl && adviserId  && groupId){
//         // sails.sockets.join(adviserId);
//         // if(groupId !== ' '){
//         //   // get group data
//         //   let groupData = await GroupLevelAccount.findOne({
//         //     id: groupId,
//         //     isDeleted: false,
//         //   });

//         //   // group data is not present then return bad request
//         //   if (!groupData) {
//         //     return res.badRequest({
//         //       status: 400,
//         //       data: {},
//         //       message: 'Group Data Not Found',
//         //     });
//         //   }
//         // }
//         // adviserData = await Advisers.findOne({id:adviserId});
//         // if(adviserData){
//         //   adviserEmail = adviserData.email;
//         //   selfReportedFirmName = adviserData.selfReportedFirmName?adviserData.selfReportedFirmName :'';
//         //   adviserPhone = adviserData.mobileNumber;
//         //   adviserName = adviserData.firstName + ' ' + adviserData.lastName;
//           let botName = 'PlannerPal';
//           const url = new URL(meetingUrl);
//           let recordingTime = 0;
//           console.log(groupId,'newMessage','PlannerPal joining Teams call now');
//           browser = await puppeteer.launch({
//             defaultViewport: {
//               width: 1180,
//               height: 950,
//             },
//             headless:false,
//             args: [
//               "--no-sandbox",
//             //   "--headless=new",
//               // "--disable-gpu",
//               "--disable-dev-shm-usage",
//               '--use-fake-ui-for-media-stream'
//             ],
//             ignoreHTTPSErrors: true,
//             // executablePath: "/usr/bin/chromium",
//             // executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
//           });
//           const context = browser.defaultBrowserContext();
//           context.clearPermissionOverrides();
//           context.overridePermissions(url.origin, ['microphone']);
//           const page = await context.newPage();
//         //   await page.setExtraHTTPHeaders({ apikey: global.secretValueJson.ZENSCRAPE_PROXY });
//           await page.goto(url.href);
//           if(meetingUrl.includes('teams.microsoft.com')){
//             // await page.evaluate(()=>{
//             //   document.querySelectorAll('[data-tid="joinOnWeb"]')[0].click();
//             // });
//             // await delay(2500);
//             // await delay(3500);
//             await page.waitForSelector('#dialog-header-2').catch((err) => {
//               console.log(err.message);
//             });
//             if(await page.$('#dialog-header-2')){
//               await browser.close({ force: true });
//               // return res.ok({
//               //   status:201,
//               //   data:{},
//               //   message:"We couldn't find a meeting matching this ID and passcode."
//               // });
//               throw new Error("We couldn't find a meeting matching this ID and passcode.");
//             }
//             await page.waitForSelector('.fui-Input__input');
//             await page.type('.fui-Input__input','PlannerPal');
//             await page.evaluate(() => {
//               document.querySelectorAll('.ui-checkbox__indicator')[1].click();
//               document.querySelector('#prejoin-join-button').click();
//             });

//             const stream = await getStream(page, { audio: true,bitsPerSecond:256000});
//             let key = `${groupId}_audioFile/${fileName}`;
//             // const s3Client = new aws.S3({accessKeyId: global.secretValueJson.AWS_ACCESS_KEY,secretAccessKey: global.secretValueJson.AWS_SECRET_KEY,region: global.secretValueJson.AWS_REGION});
//             // uploadToS3 = s3Client.upload({
//             //   Bucket: global.secretValueJson.AWS_BUCKET,
//             //   Key:key,
//             //   Body: stream,
//             //   ContentType:'audio/wav'
//             // }).promise();;
//             // res.ok({
//             //   status:200,
//             //   data:{},
//             //   message:'Meet Recording'
//             // });
//             const promiseRes = await new Promise((resolve, reject) => {
//               let closing = false; // Variable to track whether closure process has started
//               const intervalId = setInterval(async () => {
//                 let text = await page.evaluate(() => {
//                   if(document.querySelector('h2')){
//                     return document.querySelector('h2').textContent;
//                   }
//                   return '';
//                 });
//                 if(text === "We've let people in the meeting know you're waiting." ||text === "When the meeting starts, we'll let people know you're waiting."){
//                   console.log(groupId,'newMessage','PlannerPal waiting to join Teams call');
//                 }else{
//                   console.log(groupId,'newMessage','PlannerPal recording Teams call');
//                 }
//                 let check = await page.evaluate(() => {
//                   if(document.querySelector('#prejoin-join-button')){
//                     return false
//                   }
//                   if(!document.querySelector('#roster-button>span>span')){
//                     return true;
//                   }
//                   if(document.querySelector('[data-tid="anon-meeting-end-screen-rejoin-button"]')){
//                     return true;
//                   }
//                   return false;
//                 });
//                 recordingTime +=10;
//                 if (check && !closing) {
//                   closing = true; // Set closing to true to prevent multiple attempts
//                   // file.close();
//                   clearInterval(intervalId);
//                   var date = new Date();
//                   var finalDate = date.toISOString().split('T')[1].split('.')[0].split(':');
//                   finishTime = finalDate[0] + ':' + finalDate[1];
//                   console.log(groupId,'newMessage','Meeting ended.  Preparing transcription');
//                   stream.end();
//                 //   await uploadToS3;
//                   resolve(closing);
//                 }
//               }, 10000);
//             });
//             // console.log(promiseRes);
//           }else{
//             await page.evaluate(()=>{
//               document.querySelectorAll('[data-tid="joinOnWeb"]')[0].click();
//             });
//             // await page.waitForSelector('.continue');
//             // await page.evaluate(() => {
//             //   document.querySelectorAll('.continue>button')[0].click();
//             // });
//             const frameHandle = await page.waitForSelector('iframe');
//             const iframeContent = await frameHandle.contentFrame();
//             await iframeContent.waitForSelector('.fui-Input__input');
//             await iframeContent.type('.fui-Input__input',botName);
//             await iframeContent.click('#prejoin-join-button');
//             await delay(1500);
//             let retryText = await iframeContent.evaluate(() => {
//               if(document.querySelector('#calling-retry-screen-description')){
//                 return document.querySelector('#calling-retry-screen-description').textContent;
//               }
//             });
//             if(retryText === "We couldn't find a meeting matching this ID and passcode."){
//               await browser.close({ force: true });
//               // return res.ok({
//               //   status:201,
//               //   data:{},
//               //   message:retryText
//               // });
//               throw new Error(retryText);
//             }
//             // const stream = await getStream(page, { audio: true,bitsPerSecond:256000, codec: 'wav'});
//             // let key = `${groupId}_audioFile/${fileName}`;
//             // const s3Client = new aws.S3({accessKeyId: global.secretValueJson.AWS_ACCESS_KEY,secretAccessKey: global.secretValueJson.AWS_SECRET_KEY,region: global.secretValueJson.AWS_REGION});
//             // uploadToS3 = s3Client.upload({
//             //   Bucket: global.secretValueJson.AWS_BUCKET,
//             //   Key:key,
//             //   Body: stream,
//             //   ContentType:'audio/wav'
//             // }).promise();;
//             // res.ok({
//             //   status:200,
//             //   data:{},
//             //   message:'Meet Recording'
//             // });
//             // let recorder = startRecording(fileName);
//             await page.evaluate(() => {
//               navigator.mediaDevices.getUserMedia({ audio: true, video: false }) // Requesting audio only
//               .then(stream => {
//                   const mediaRecorder = new MediaRecorder(stream);
//                   let chunks = [];

//                   mediaRecorder.ondataavailable = e => {
//                       chunks.push(e.data);
//                       if (mediaRecorder.state === 'recording') {
//                           // Create a blob from the chunks
//                           let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
//                           chunks = []; // Reset chunks array for the next dataavailable event

//                           let audioURL = URL.createObjectURL(blob);
//                           console.log('Audio URL:', audioURL);
//                           // Here you could post the blob to a server or save it locally
//                       }
//                   };

//                   mediaRecorder.start(60000); // Start recording, and generate data every 60000ms (1 minute)

//                   // Optionally stop recording after a certain time
//                   setTimeout(() => {
//                       mediaRecorder.stop();
//                   }, 300000); // e.g., stop after 5 minutes
//               })
//               .catch(error => console.error('Error accessing media devices:', error));
//             })

//             const promiseRes = await new Promise(async(resolve, reject) => {
//               fileName = groupId && groupId !== ' ' ? groupId + '_' + new Date().getTime() + '.wav' : "test_"+new Date().getTime() +".wav"
//               let text = await iframeContent.evaluate(()=> {
//                 if(document.querySelector('h2')){
//                   return document.querySelector('h2').textContent;
//                 }
//                 return '';
//               });
//               if(text === 'We’ve let the organiser know that you’re waiting.'){
//                 console.log(groupId,'newMessage','PlannerPal waiting to join Teams call');
//               }else{
//                 console.log(groupId,'newMessage','PlannerPal recording Teams call');
//               }
//               let closing = false; // Variable to track whether closure process has started
//               const intervalId = setInterval(async () => {
//                 if(await iframeContent.$('#hangup-button')){
//                   console.log(groupId,'newMessage','PlannerPal recording Teams call');
//                 }

//                 recordingTime +=10;
//                 if (!await iframeContent.$('#prejoin-join-button') && (!await iframeContent.$('#hangup-button') || !await iframeContent.$('#roster-button>span>span')) && !closing) {
//                   closing = true; // Set closing to true to prevent multiple attempts
//                 //   stream.end();
//                 //   await uploadToS3;
//                   clearInterval(intervalId);
//                   var date = new Date();
//                   var finalDate = date.toISOString().split('T')[1].split('.')[0].split(':');
//                   finishTime = finalDate[0] + ':' + finalDate[1];
//                   console.log(groupId,'newMessage','Meeting ended.  Preparing transcription');
//                   resolve(closing);
//                 }
//                 // stopRecording(recorder);
//                 // recorder = startRecording(fileName);
//               }, 10000);
//             });
//             // console.log(promiseR);
//           }
//           browser.disconnect();
//           console.log('disconnected');
//           let data = {
//               adviserId :adviserId,
//               recordingTime : recordingTime,
//               groupId :groupId,
//               fileName :fileName,
//               adviserData : adviserData,
//               finishTime: finishTime,
//               meetingUrl :meetingUrl,
//               ////token: req.headers['x-auth'],
//               meetType:'Teams call',
//               errorRecording : 'false'
//           }
//         //   const recording = await sails.helpers.recordMsTeams({
//         //       data
//         //   });

//           console.log(groupId,'resultData',recording)
//           if(fs.existsSync(fileName)){
//             fs.unlinkSync(fileName);
//           }
//           await browser.close({ force: true });
//           // console.log('closed',new Date());
//         // }else{
//         //     console.log('Adviser Data Not Found');
//         // //   return res.badRequest({
//         // //     status:400,
//         // //     data:{},
//         // //     message:'Adviser Data Not Found'
//         // //   });
//         // }

//       }else{
//         console.log('Please Add All Required Fields');
//         // return res.badRequest({
//         //   status:400,
//         //   data:{},
//         //   message:'Please Add All Required Fields'
//         // });
//       }
//     } catch (error) {
//       // if(fs.existsSync(fileName)){
//       //   fs.unlinkSync(fileName);
//       // }
//       // await uploadToS3.done();
//       let obj = {meetingUrl,adviserId,message:error.message,adviserName,adviserEmail,adviserPhone,selfReportedFirmName,meetType:'Teams call',retryMessage:''};
//       console.log(groupId, 'errorMessage', error.message);
//       let check = false;
//     //   if(groupId && groupId !== ' '){
//     //     var date = new Date();
//     //     var finalDate = date.toISOString().split('T')[1].split('.')[0].split(':');
//     //     finishTime = finalDate[0] + ':' + finalDate[1];
//     //     // console.log('calling here inside error');
//     //     let data = {
//     //       adviserId :adviserId,
//     //       recordingTime : 1,
//     //       groupId :groupId,
//     //       fileName :fileName,
//     //       adviserData : adviserData,
//     //       finishTime: finishTime,
//     //       meetingUrl :meetingUrl,
//     //       ////token: req.headers['x-auth'],
//     //       meetType:'Teams call',
//     //       errorRecording : 'true'
//     //     }
//     //     let retryLimit = 2; // max retry allowed
//     //     let retryCount = 0; // number of retries
//     //     while (retryCount <= retryLimit) {
//     //       try {
//     //         // const recording = await sails.helpers.recordMsTeams({
//     //         //     data
//     //         // });
//     //         break;
//     //       } catch (error) {
//     //         await delay(2000);
//     //         //console.log("delay");
//     //         retryCount++;
//     //         if (retryCount > retryLimit) {
//     //           //console.log("Reached maximum retries, continuing to next iteration");
//     //           check = true;
//     //           break;
//     //         }
//     //       }
//     //     }
//     //     // console.log('data',data);
//     //     // console.log(recording)
//     //     // if(check && groupId && groupId !== ' '){
//     //     //   obj.retryMessage = 'Recording Uploaded to S3'
//     //     //   const rootDirectory = path.resolve(__dirname, '../../');
//     //     //   let dir = rootDirectory + '/' + fileName
//     //     // //   await sails.helpers.uploadImage(
//     //     // //     dir,
//     //     // //     fileName,
//     //     // //     `${groupId}_audioFile`,
//     //     // //     'audio/mpeg'
//     //     // //   )
//     //     // //   await GroupLevelAccount.updateOne({id:groupId},{disconnectedAt: new Date().getTime(), isReconnected:false});
//     //     // }
//     //   }
//       console.log(error.message,'this error');
//     //   await CloudWatchService.logToCloudWatch('plannerpal-backend', 'test1', { error:error.message });
//     //   await MeetingLog.create({
//     //     adviserId,
//     //     meetingUrl,
//     //     groupId,
//     //     message:error.message || error,
//     //     successfulMeeting: false,
//     //     transcriptLength: 0,
//     //     meetType:'Teams call'
//     //   })
//     //   await sails.helpers.sendErrorMail({input:obj});
//       // return res.badRequest({
//       //   status:400,
//       //   data:{},
//       //   message:error.message
//       // });
//       return '';
//     } finally {
//         // Close the browser if it's open to ensure resources are properly released
//         if (browser) {
//             await browser.close();
//             console.log('Browser closed');
//         }
//     }
// })();

const { launch, getStream } = require("puppeteer-stream");
const URL = require("url").URL;
const fs = require("fs");
const path = require("path");
const { Writable } = require("stream");
const aws = require("aws-sdk");
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function uploadToS3(inputs) {
  console.log("calling upload function");
  try {
    const s3 = new aws.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_SECRET_KEY,
      secretAccessKey: process.env.AWS_ACCESS_KEY,
      maxRetries: Number(process.env.MAX_RETRY),
    });
    let filename = inputs.fileName;
    // console.log(filename);
    let ext = filename.split(".");
    console.log(fs.existsSync(filename));
    if (fs.existsSync(filename)) {
      console.log("in condition");
      fs.readFile(inputs.sourceFilePath, (error, fileContent) => {
        // if unable to read file contents, throw exception
        if (error) {
          throw error;
        }
        // upload file to S3
        const fileParams = {
          Bucket: "plannerpal-secure-bucket",
          Key: `${inputs.destinationDir}/${inputs.fileName}`,
          Body: fileContent,
          // ACL: 'public-read',
          // ContentEncoding: '', // required
          ContentType: inputs.mimeType,
          region: "eu-2-west",
        };
        // sails.log("File Params",global.secretValueJson.AWS_NAME);
        try {
          console.log("calling from inside read file");
          s3.upload(fileParams, (err, data) => {
            //handle error
            if (err) {
              return err;
            }
            //success
            if (data) {
              // delete file from local
              console.log(data.Location);
              if (fs.existsSync(inputs.sourceFilePath)) {
                fs.unlink(inputs.sourceFilePath, (err) => {
                  if (err) {
                    throw err;
                  }
                });
              }
              return data;
            }
          });
        } catch (err) {
          console.log(err);
          return err;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  let browser; // calling browser
  let meetingUrl =
    "https://teams.live.com/meet/9571208235866?p=nWTSC1ZKgzXVRsRxIt";
  let adviserId = " "; //req.body.adviserId;
  let groupId = "65b0d6031c7e0bee888c4327";
  let adviserEmail = "";
  let selfReportedFirmName = "";
  let adviserPhone = "";
  let adviserName = "";
  let adviserData = {};
  let finishTime;
  let fileName = "";
  let fileNamePrefix =
    groupId && groupId !== " "
      ? groupId + "_" + new Date().getTime()
      : "test_" + new Date().getTime();
  let currentMinute = 0;
  let writeStream;
  const startNewFile = () => {
    if (writeStream) {
      writeStream.end();
    }
    fileNamePrefix =
      groupId && groupId !== " "
        ? groupId + "_" + new Date().getTime()
        : "test_" + new Date().getTime();
    fileName = `${fileNamePrefix}.wav`;
    writeStream = fs.createWriteStream(fileName);
    currentMinute++;
  };
  startNewFile();
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
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
        ignoreHTTPSErrors: true,
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      });
      const context = browser.defaultBrowserContext();
      context.clearPermissionOverrides();
      context.overridePermissions(url.origin, ["microphone"]);
      const page = await context.newPage();
      await page.goto(url.href);
      await page.evaluate(() => {
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
        frameSize: 2000,
      });
      let startTime = Date.now();
      stream.on("data", async (chunk) => {
        const elapsedTime = Date.now() - startTime;
        const elapsedMinutes = Math.floor(elapsedTime / 2000);
        if (elapsedMinutes > currentMinute) {
          startNewFile();
        }
        writeStream.write(chunk);
        await delay(1000);
        await uploadToS3({
          fileName,
          sourceFilePath: path.join(__dirname + "/" + fileName),
          destinationDir: `${groupId}_audioFile`,
          mimeType: "audio/mpeg",
        });
      });
      stream.on("end", () => {
        if (writeStream) {
          writeStream.end();
        }
        console.log("Stream ended, all chunks handled");
      });
      const promiseRes = await new Promise(async (resolve, reject) => {
        let text = await iframeContent.evaluate(() => {
          if (document.querySelector("h2")) {
            return document.querySelector("h2").textContent;
          }
          return "";
        });
        if (text === "We've let the organiser know that you're waiting.") {
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
        fileName: fileNamePrefix,
        adviserData: adviserData,
        finishTime: finishTime,
        meetingUrl: meetingUrl,
        meetType: "Teams call",
        errorRecording: "false",
      };
      console.log(groupId, "resultData");
      await browser.close({ force: true });
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
