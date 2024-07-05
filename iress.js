let puppeteer = require('puppeteer');
const axios = require('axios');

function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
(async()=>{
    let browser = await puppeteer.launch({
        headless:false
    });
    let page = await browser.newPage();
    await page.goto('https://thirdpartyintegrations.xplan.iress.co.uk/oauth2/auth?response_type=code&client_id=hcMqlbLI7W7jeLEpKaW5&redirect_uri=https://www.plannerpal.co.uk/sign-in-iress');
    await page.type('#userid','A.PlannerPal');
    await page.type('#passwd','TooLate01!');
    await page.click('#btn_login');
    await page.waitForSelector('#duplicate_login_message');
    if(page.$('#duplicate_login_message')){
        await page.type('#passwd','TooLate01!');
        await page.click('#btn_login');
    }
    await page.waitForSelector('#btn_yes');
    await page.click('#btn_yes');
    await delay(4000);
    let code = await page.evaluate(() => {
        return document.baseURI.split('code=')[1]?.split('&scope')[0]
    });
    await browser.close()
    if(code){
        let config ={
            method: 'get',
            url: 'http://localhost:1339/getTokenForIress?code='+code+'&adviserId=65d5f71dec047c4dafe681f6',
            headers: { 
              'X-Auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob29tb25AcGxhbm5lcnBhbC5jby51ayIsInJvbGUiOiJhZG1pbiIsInNlY3JldCI6ImRvd25zaXplYWJsZXNlY3JldGtleSJ9.pKxt9gzdzhsvrxEsF5dwzE2r2fvKZYX6tRFbt7BY9tAo', 
            }
          };
          let startToken = new Date();
          let resultData = await axios.request(config);
          let tokenTime = new Date() - startToken
          console.log(resultData.data);
          if(resultData.data.data.access_token){
            let clientConfig = {
                method: 'get',
                maxBodyLength: Infinity,
                url:`https://api.iressopen.co.uk/client`,
                headers: {
                    'Xplan_Site': 'thirdpartyintegrations.xplan.iress.co.uk',
                    'Oauth2_app_key': 'hcMqlbLI7W7jeLEpKaW5',
                    'oAut2_Secret': 'klFxgkKdtaCrkpPVwplaRWUzNcB1cncWf6JyaXF1',
                    'x-api-version': '3.0',
                    'x-forwarded-host': 'thirdpartyintegrations.xplan.iress.co.uk',
                    'x-xplan-app-id': 'hcMqlbLI7W7jeLEpKaW5',
                    Authorization: "Bearer " + resultData.data.data.access_token,
                },
            };
            let startClient = new Date();
            const clientResponsed = await axios.request(clientConfig);
            let clientTime = new Date() - startClient;
            let configCreate =  {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://advisercopilotbackend.onrender.com/createApiPerfomances',
                headers: { 
                  'X-Auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob29tb25AcGxhbm5lcnBhbC5jby51ayIsInJvbGUiOiJhZG1pbiIsInNlY3JldCI6ImRvd25zaXplYWJsZXNlY3JldGtleSJ9.pKxt9gzdzhsvrxEsF5dwzE2r2fvKZYX6tRFbt7BY9tAo', 
                },
                data:{
                    "crmSystem":"iress",
                    "apiPerformance": {
                        "getToken": tokenTime,
                        "clients": clientTime
                    }
                }
              };
            let createResult = await axios.request(configCreate);       
          }else{
            console.log('token not found')
          }
    }else{
        console.log('code not found');
    }
})()