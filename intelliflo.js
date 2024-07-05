const puppeteer = require('puppeteer');
const axios = require('axios') 

function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

(async() => {
    try {
        
        console.log('calling');
        let browser = await puppeteer.launch({
            headless:false
        });
        let page = await browser.newPage();
        await page.goto('https://identity.intelliflo.com/core/connect/authorize?response_type=code&scope=openid myprofile profile client_data client_financial_data firm_data&client_id=app-2379edf-acf-0f88e13c9403480dbaa91dbcaf622f3f&redirect_uri=https://www.plannerpal.co.uk/sign-in-intelliflo');
        await page.type('#username','vihangp@zignuts.com_5b57');
        await page.type('#password','Vihang1234567');
        await page.evaluate(() => {
            if(document.querySelector('.form-group>.btn')){
                document.querySelector('.form-group>.btn').click();
                return true
            }
            return false
        });
        await delay(4000);
        let code = await page.evaluate(() => {
            return document.baseURI.split('code=')[1]?.split('&scope')[0]
        })
        console.log(code);
        await browser.close()
        if(code){
            let config ={
                method: 'get',
                url: 'https://backendprod2.plannerpal.co.uk/getTokenForIntelliflo?code='+code+'&adviserId=6593b9bc8e3d0c14d59fe979',
                headers: { 
                  'X-Auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob29tb25AcGxhbm5lcnBhbC5jby51ayIsInJvbGUiOiJhZG1pbiIsInNlY3JldCI6ImRvd25zaXplYWJsZXNlY3JldGtleSJ9.pKxt9gzdzhsvrxEsF5dwzE2r2fvKZYX6tRFbt7BY9tAo', 
                }
              };
              let startToken = new Date();
              let resultData = await axios.request(config);
              let tokenTime = new Date() - startToken
              console.log(resultData.data.data);
              if(resultData.data.data.access_token){
                let startAdviserCall = new Date()
                let configAdviser = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'https://advisercopilotbackend.onrender.com/getIntellifloAdvisers?adviserId=6593b9bc8e3d0c14d59fe979',
                    headers: { 
                      'X-Auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob29tb25AcGxhbm5lcnBhbC5jby51ayIsInJvbGUiOiJhZG1pbiIsInNlY3JldCI6ImRvd25zaXplYWJsZXNlY3JldGtleSJ9.pKxt9gzdzhsvrxEsF5dwzE2r2fvKZYX6tRFbt7BY9tAo', 
                      'x-auth-intelliflo': resultData.data.data.access_token
                    }
                  };
                  await axios.request(configAdviser);
                  let adviserTime = new Date - startAdviserCall
                  let startClient = new Date();
                  let configClient =  {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'https://advisercopilotbackend.onrender.com/getIntellifloClientsList?count=true&client=true&adviser=true&adviserArray=[138592]',
                    headers: { 
                      'X-Auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob29tb25AcGxhbm5lcnBhbC5jby51ayIsInJvbGUiOiJhZG1pbiIsInNlY3JldCI6ImRvd25zaXplYWJsZXNlY3JldGtleSJ9.pKxt9gzdzhsvrxEsF5dwzE2r2fvKZYX6tRFbt7BY9tAo', 
                      'x-auth-intelliflo':  resultData.data.data.access_token
                    }
                  };
                  await axios.request(configClient);
                  let clientTime = new Date() - startClient;
                  let configCreate =  {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://advisercopilotbackend.onrender.com/createApiPerfomances',
                    headers: { 
                      'X-Auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNob29tb25AcGxhbm5lcnBhbC5jby51ayIsInJvbGUiOiJhZG1pbiIsInNlY3JldCI6ImRvd25zaXplYWJsZXNlY3JldGtleSJ9.pKxt9gzdzhsvrxEsF5dwzE2r2fvKZYX6tRFbt7BY9tAo', 
                    },
                    data:{
                        "crmSystem":"intelliflo",
                        "apiPerformance": {
                            "getToken": tokenTime,
                            "adviser": adviserTime,
                            "clients": clientTime
                        }
                    }
                  };
                  let createResult = await axios.request(configCreate);
                  console.log(createResult,'final result');
              }else{
                console.log('token not found');
              }
        }else{
            console.log('code not found');
        }
    } catch (error) {
     console.log(error);   
    }
})()