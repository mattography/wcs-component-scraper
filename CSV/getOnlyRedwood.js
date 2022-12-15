const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main() {
      let rawdata = fs.readFileSync('./URLs.json');
      let sites = JSON.stringify(JSON.parse(rawdata));
      let urls = JSON.parse(sites);
      
      const allData = [];
      function currentDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yy = today.getFullYear();
        let fullDate = mm + '-' + dd + '-' + yy;
        return fullDate;
      }
      try {
        const browser = await puppeteer.launch({headless: true});
        let count = 0;
        for(let url of urls){
            count++
            const page = await browser.newPage();
            await page.setExtraHTTPHeaders({
              'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
            });
            console.log(`looking at: ${count} of ${urls.length}: ${url}`);
            await page.setViewport({
              width: 1368,
              height: 768
            });
            await page.goto(`${url}?wscallouts`, {timeout: 0, waitUntil: 'networkidle0'});
            const usesRedwoodCodebase = await page.evaluate(() => {
                return document.querySelector('.ws-cbase a') && document.querySelector('.ws-cbase a').innerText === "REDWOOD CODEBASE";
              });
            usesRedwoodCodebase === true ? allData.push(url) : allData.push(`${url}-ocom`);
            let data = JSON.stringify(allData.filter(el => !el.includes("-ocom")));
            fs.writeFileSync(`./redwoodURLs2-${currentDate()}.json`, data);
            await page.close();                 
        }
      await browser.close();
      } catch (err) {
        console.error(err);
      }
  })();