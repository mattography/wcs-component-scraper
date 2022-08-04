const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main() {
    let rawdata = fs.readFileSync('./appsPillarsURLs.json');
    let sites = JSON.parse(rawdata);
    try {
      const browser = await puppeteer.launch({headless: true});
      const [page] = await browser.pages();
  
  
      const autoScroll = async (page) => {
        await page.evaluate(async () => {
          await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
      
              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
        });
      }
      
      const urls = [...new Set(sites)];
      const allData = [];
  
      let count = 0;
      for (const url of urls) {
        count++
        let remainingTime = ((urls.length - count) * 5 / 60).toFixed(2);
        // console.log("scraping page " + count + " of " + urls.length + " (" + remainingTime + " mins remaining): " + url);
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setExtraHTTPHeaders({
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
        });
        await page.goto(url + '?wscallouts');
        console.log("scraping page " + count + " of " + urls.length + " (" + remainingTime + " mins remaining): " + url);
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({
          width: 1200,
          height: 800
        });
        //If URL is redirected
        if(page.url() !== url){
          let redirectedUrl = page.url() + '?wscallouts';
          await page.goto(redirectedUrl, {timeout: 0});
          await autoScroll(page);
    
          const ids = await page.evaluate(() => {
            return [...document.querySelectorAll('.ws-compid')].map(component => component.classList ? {id: component.innerText, type: component.classList[3]} : null);
          });
          allData.push({url, ids});
          let data = JSON.stringify(allData);
          fs.writeFileSync('appsPillarsIds3.json', data);
          await page.close();
        } else {
          //URL is direct
          await autoScroll(page);
    
          const ids = await page.evaluate(() => {
            // return [...document.querySelectorAll('.a11y-unknown, .a11y-ready')].map(component => component.innerText);
            return [...document.querySelectorAll('.ws-compid')].map(component => component.classList ? {id: component.innerText, type: component.classList[3]} : null);
          });
          allData.push({url, ids});
          let data = JSON.stringify(allData);
          fs.writeFileSync('appsPillarsIds3.json', data);
          await page.close();
        }
      }

      await browser.close();
    } catch (err) {
      console.error(err);
    }
  })();