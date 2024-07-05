const puppeteer = require('puppeteer');
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

(async () => {
  puppeteerExtra.use(StealthPlugin());
  let browser = await puppeteer.launch({headless:false});
  let page = await browser.newPage({
    defaultViewport: {
        width: 1480,
        height: 1120,
      },
  });
  await page.setExtraHTTPHeaders({ apikey: '8675a010-d178-11ee-a406-e7bbfb11c991' });
  await page.goto('https://www.linkedin.com/checkpoint/lg/login?trk=homepage-basic_sign-in-submit')  
  await page.type('#username','priyabhogayata8@gmail.com');
  await page.type('#password','Priya@9586');
  await page.click('.from__button--floating');
})();
// function delay(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }
// (async() => {
//   let browser = await puppeteer.launch({
//     headless:false
//   });
//   let page = await browser.newPage();
//   await page.goto('https://in.linkedin.com/in/priya-bhogayata-961299228?trk=people-guest_people_search-card');
//   await delay(4000);
//   console.log('called after delay');
//   await page.evaluate(() => {
//     if(document.querySelector('#public_profile_contextual-sign-in>div>section>button.modal__dismiss')){
//       document.querySelector('#public_profile_contextual-sign-in>div>section>button.modal__dismiss').click()
//     }
//   })
// })();
