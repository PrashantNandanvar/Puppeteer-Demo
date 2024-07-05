let puppeteer = require('puppeteer');
const axios = require('axios') 

function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

(async() =>{
    let browser = await puppeteer.launch({headless:false});
    let page = await browser.newPage()
    await page.goto('https://api.plannrcrm.com/oauth/authorize?response_type=code&client_id=9ae105e6-6412-4140-b4a0-1694a0d7de32&redirect_uri=https://www.plannerpal.co.uk/plannr-callback&scope=*')
    await page.type('#email','shoomon@plannerpal.co.uk');
    await page.type('#password','HarryKaneIsFab123');
    await page.evaluate(() => {
        if(document.querySelector('.rounded-md>button')){
            document.querySelector('.rounded-md>button').click();
            return true
        }
        return false
    });
    await delay(2000);
    await page.waitForSelector('.space-x-3').catch(err =>{
        console.log(err);
    })
    await page.evaluate(()=>{
        if(document.querySelector('button>.space-x-3')){
            document.querySelector('button>.space-x-3').click()
        }
    })
    await delay(4000);
    let code = await page.evaluate(() => {
        return document.baseURI.split('code=')[1]?.split('&scope')[0]
    });
    console.log(code);
    await browser.close()
    if(code){
        let config ={
            method: 'get',
            url: 'http://localhost:1339/getTokenForPlannrCrm?code='+code,
            headers: { 
              'X-Auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob29tb25AcGxhbm5lcnBhbC5jby51ayIsInJvbGUiOiJhZG1pbiIsInNlY3JldCI6ImRvd25zaXplYWJsZXNlY3JldGtleSJ9.pKxt9gzdzhsvrxEsF5dwzE2r2fvKZYX6tRFbt7BY9tAo', 
            }
          };
          let startToken = new Date();
          let resultData = await axios.request(config);
          let tokenTime = new Date() - startToken
          console.log(resultData.data);
          if(resultData.data.data.access_token){
              const accountConfig = {
                method: "get",
                url: `https://api.plannrcrm.com/api/v1/account`,
                headers: {
                    Authorization: "Bearer " + resultData.data.data.access_token,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-PLANNR-ACCOUNT-UUID": resultData.data.data.uuid,
                },
            };
            // Fetch account information
            let startAccount = new Date();
            const accountResponse = await axios.request(accountConfig); 
            let accountTime = new Date() - startAccount
            console.log(accountResponse.data.data.length);
            const clientConfig = {
                method: "get",
                url: `https://api.plannrcrm.com/api/v1/client`,
                headers: {
                    Authorization: "Bearer " + resultData.data.data.access_token,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-PLANNR-ACCOUNT-UUID": resultData.data.data.uuid,
                },
            };
            let startClient = new Date();
            const clientResponse = await axios.request(clientConfig);
            let clientTime = new Date() - startClient;
            console.log(clientResponse.data.data.length);
            let configCreate =  {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://advisercopilotbackend.onrender.com/createApiPerfomances',
                headers: { 
                  'X-Auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob29tb25AcGxhbm5lcnBhbC5jby51ayIsInJvbGUiOiJhZG1pbiIsInNlY3JldCI6ImRvd25zaXplYWJsZXNlY3JldGtleSJ9.pKxt9gzdzhsvrxEsF5dwzE2r2fvKZYX6tRFbt7BY9tAo', 
                },
                data:{
                    "crmSystem":"plannr",
                    "apiPerformance": {
                        "getToken": tokenTime,
                        "adviser": accountTime,
                        "clients": clientTime
                    }
                }
              };
              let createResult = await axios.request(configCreate);
              console.log(createResult,'final result');
          }

    }else{
        console.log('code not found');
    }
})()