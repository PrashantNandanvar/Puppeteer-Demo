const puppeteer = require('puppeteer');
const { getStream } = require('puppeteer-stream');
const fs = require('fs');


function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
(async () => {
	const browser = await puppeteer.launch({
		headless: false, // audio cannot be captured in headless mode
		// args: ['--use-fake-ui-for-media-stream'],
        // // executablePath: "/Users/ztlab57/Desktop/backup/chromium/lib/chromium/chrome-mac/Chromium.app/Contents/MacOS/Chromium",
	});
	const page = await browser.newPage();
	await page.goto(
		'https://www.google.com/search?hl=en&uule=w+CAIQICIaQXVzdGluLFRleGFzLFVuaXRlZCBTdGF0ZXM&q=nodejs+developer+jobs&gl=us&ibp=htl;jobs&sa=X&ved=2ahUKEwj3n5G0sIeEAxWmnokEHcpVA_EQudcGKAF6BAhIECQ#fpstate=tldetail&htivrt=jobs&htidocid=BgYAAzjswaQ8eS0WAAAAAA%3D%3D'
	); // Navigate to the page with audio content
	await page.evaluate(() => {
		document.querySelectorAll('[data-tid="joinOnWeb"]')[0].click();
	});
	const frameHandle = await page.waitForSelector('iframe');
	const iframeContent = await frameHandle.contentFrame();
	await iframeContent.waitForSelector('.fui-Input__input');
	await iframeContent.type('.fui-Input__input', 'Planner Pal');
	await iframeContent.click('#prejoin-join-button');
	await delay(1500);
	// Start capturing the audio
	const stream = await getStream(page, { audio: true, video: false });
	const file = fs.createWriteStream(fileName);
	stream.on('data', (chunk) => {
		// Process audio chunks here
		console.log(`Received ${chunk.length} bytes of data.`);
	});
	stream.on('end', () => {
		console.log('Stream ended.');
		browser.close();
	});
})();
