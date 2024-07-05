const puppeteer = require('puppeteer');

function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

(async() => {
    const browser = await puppeteer.launch({
        // defaultViewport: {
        //  width: 1320,
        //  height: 1080,
        // },
        headless:false,
        // executablePath:
        //   '/Applications/Chromium.app/Contents/MacOS/Chromium',
    });
    let page = await browser.newPage();
    try {
         // Listen for new target events
        browser.on('targetcreated', async target => {
            if (target.type() === 'page') {
            const newPage = await target.page();
            await newPage.bringToFront();
            }
        });
        await page.goto('https://auth.fefundinfo.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dfefundinfo-advisery-feanalytics-prod%26redirect_uri%3Dhttps%253A%252F%252Fwww.feanalytics.com%252FAuthorise.aspx%26response_type%3Dcode%2520id_token%26scope%3Dopenid%2520profile%2520FEAnalytics%2520analytics-chartsapi-role-read%2520analytics-api-role-read%2520search-api-read%2520nextgen-api-read%2520decumulation-api-role-read%26state%3DOpenIdConnect.AuthenticationProperties%253Dyk8FXbeUDogFkr5EkZgdSiTggn65RRDE57nrAItNK5XxDFcobVU-tyqH5uHIgTsCvl137dnZ5367Iv4VBdqcKI6cTBZnR3R21rUPpXxk8EEEfQR4e35vqMb1j36y2bOadO1Ls1Z6qUwITxLA1HWMdKg0siTAjEksKbApg0rPHmsSZv7bdt5FQJWyT9ntKgQ1uU-geFNdJlWLx4IrEclpMqgcGkOlbS-GMhJXXpMud0o%26response_mode%3Dform_post%26nonce%3D638496332280251760.NzFkNzAwMTYtZDVjNi00MjA3LThiNTktN2E2ZWUxNTNlMzNlODcxYmQ4MTYtODRlMS00OWYyLWJkYmEtMGM2ODc5ZWJmODc4%26x-client-SKU%3DID_NET461%26x-client-ver%3D5.3.0.0')
        await page.type('#username','shoomon@plannerpal.co.uk');
        await page.type('#password','V?DAKamd$c*$m4Q');
        await page.click('#loginSubmit');
        await delay(10000)
        await page.click('#lkInstrTabP')
        // await page.click('#lblPortfolioCreatenew')
        let page2 = await browser.newPage();
        await page2.goto('https://www.feanalytics.com/Portfolio.aspx')
        // await page.select("select#Universe", 'P'); 
        // await page2.evaluate(()=>{
        //     if(document.querySelector('#Universe')){
        //         document.querySelector('#Universe').value = 'P'
        //     }
        // })
        await page2.select('#Universe','P')
        await delay(2000)
        await page2.click('#chkCleanShare');
        await page2.click('#DriverLevel');
        await delay(6000);
        await page2.select('#ListManager','P:AEGU');
        await delay(2000);
        if(await page2.$('#ListFund')){
            await page2.select('#ListFund','P:M1E3;XP:UFI');
            await page2.click('#litFundAdd');
            await page2.select('#ListFund','P:M1D7;XP:SCB');
            await page2.click('#litFundAdd');
            await page2.select('#ListFund','P:SEHEQY;XP:WPR');
            await page2.click('#litFundAdd');
        }
        await delay(3000)
        await page2.type('#amt_FP\\:M1E3','30');
        await page2.type('#amt_FP\\:M1D7','30');
        await page2.type('#amt_FP\\:SEHEQY','40');
        await page2.select('#ListSector','XP:CMG');
        // // await page2.click('#SectorBenchmark');
        // await page2.evaluate(() => {
        //     if(document.querySelector('#ListSector')){
        //         document.querySelector('#ListSector').value = 'XP:CMG'
        //     }
        // })
        await page2.click('#selectlitSectorAdd');
        await page2.click('#ui-id-5');
        await page2.evaluate(() => {
            if(document.querySelector('.icn_save')){
                document.querySelector('.icn_save').click()
            }
        })
        // await page2.click('');
        await page2.type('#DialogSave>.sdRow>.sd-Name.js_validate_name','Test Prashant portfolio1');
        await page2.click('.sd-save')
        const pages = await browser.pages();
        await pages[1].bringToFront();
        await delay(4000);
        await page.click('#lkInstrTabP');
        await delay(5000);
        await page.click('#btnPortfolioSearch');
        await delay(3000);
        await page.type('#PortfolioSearch','Test Prashant portfolio1');
        await page.click('#btnPortfolioSearchGo');
        await delay(5000)
        await page.click('#lnkAddInstrument2');
        await page.click('#lkInstrTabX');
        await delay(2000);
        await page.select('#Universe','C')
        await delay(2000);
        await pages[2].bringToFront();
        await page2.goto('https://www.feanalytics.com/CustomTableBuilder.aspx');
        await delay(2000);
        await page2.select('#PerformancePeriod','12.00;Performance:p12m');
        await page2.click('#rdAnnual');
        await page2.click('#btnAddPerformanceField');
        await page2.select('#PerformancePeriod','36.00;Performance:p36m');
        await page2.click('#rdAnnual');
        await page2.click('#btnAddPerformanceField');
        await page2.select('#PerformancePeriod','60.00;Performance:p60m');
        await page2.click('#rdAnnual');
        await page2.click('#btnAddPerformanceField');
        await page2.select('#FinametricaField','FinametricaAssetBreakdown:Growth');
        await page2.click('#btnAddFinametricaField');
        await page2.select('#FinametricaField','FinametricaAssetBreakdown:Defensive');
        await page2.click('#btnAddFinametricaField');
        await page2.select('#FinametricaField','FinametricaAssetBreakdown:Unclassified');
        await page2.click('#btnAddFinametricaField');
        await page2.select('#QuoteField','Quote:RiskScore');
        await page2.click('#btnAddQuoteField');
        await page2.select('#FactsheetField','Factsheet:OCF');
        await page2.click('#btnAddFactsheetField');
        await page2.select('#FactsheetField','Factsheet:OCFDATE');
        await page2.click('#btnAddFactsheetField');
        await page2.evaluate(() => {
            if(document.querySelector('.ToolBar>a>.icn_save')){
                document.querySelector('.ToolBar>a>.icn_save').click()
            }
        });
        await page2.type('.sd-Name','PN Custom Report1')
        await page2.click('.sd-save')

        await pages[1].bringToFront();
        await page.reload();
        await page.click('#lkReportMenu');
        await page.waitForSelector('select#ListCustomLayout')
        const optionValue = await page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('select#ListCustomLayout option'));
            const option = options.find(opt => opt.textContent === 'PN Custom Report1');
            return option ? option.value : null;
          });
        
          if (optionValue) {
            // Select the option by value
            await page.select('select#ListCustomLayout', optionValue);
            console.log(`Selected option with value: ${optionValue}`);
          } else {
            console.log('Option not found');
          }
        // await page.evaluate((text) => {
        //     const selectElement = document.querySelector('select#ListCustomLayout');
        //     const options = selectElement.options;
        
        //     for (let i = 0; i < options.length; i++) {
        //       if (options[i].text === text) {
        //         selectElement.selectedIndex = i;
        //         selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        //         break;
        //       }
        //     }
        //   }, 'PN Custom Report4');
        const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
        await page.click('#btnRun');
        await delay(2000)
        console.log(pages.length);
        const newPage = await newPagePromise;
        await newPage.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Wait for the new page to load

        // Now you can interact with the new page
        console.log('New window opened');
        await newPage.screenshot({ path: 'new_window.png' }); // Example action: take a screenshot
        const imageSrc = await newPage.evaluate(() => {
           if(document.querySelector('img[alt="Export as XLS"]')){
            document.querySelector('img[alt="Export as XLS"]').click()
           }
          });
        // Optionally, close the new page
        // await newPage.close();
        // await page.select('#ListPortfolio[title=Test Prashant portfolio]',);
        // await page.click('#lkInstrTabX');
        // await page.click('.fe-logout');
    } catch (error) {
        console.log(error);
        const pages = await browser.pages();
        await pages[1].bringToFront();
        await page.waitForSelector('.fe-logout')
        await page.click('.fe-logout');
    }
})();