const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main() {
    let rawdata = fs.readFileSync('./CSV/redwoodURLs-12-14-2022.json');
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
  
      function currentDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yy = today.getFullYear();
        let fullDate = mm + '-' + dd + '-' + yy;
        return fullDate;
      }

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
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({
          width: 1200,
          height: 800
        });
        //If URL is redirected
        let blacklistedComponents = ["F11", "F13", "F16", "F20", "F21", "F22", "U10", "U24", "U26", "U28", "U30"];
        if(page.url() !== url){
          let redirectedUrl = page.url() + '?wscallouts';
          console.log("scraping page " + count + " of " + urls.length + " (" + remainingTime + " mins remaining): " + url);
          await page.goto(redirectedUrl, {timeout: 0});
          await autoScroll(page);
          const ids = await page.evaluate((blacklistedComponents) => {
            return [...document.querySelectorAll('.ws-compid')].map(component => !blacklistedComponents.some(blacklistedComponents => component.innerText.startsWith(blacklistedComponents)) ? {id: component.innerText, type: Object.entries(component.classList).pop()[1]} : null).filter(comp => comp !== null);
          }, blacklistedComponents);
          const pageUpdated = ids.every(el => el.type === "a11y-true")
          allData.push({url, ids, pageUpdated});
          let data = JSON.stringify(allData);
          fs.writeFileSync(`./CSV/componentIds-no-blacklisted-${currentDate()}.json`, data);
          await page.close();
        } else {
          //URL is direct
          console.log("scraping page " + count + " of " + urls.length + " (" + remainingTime + " mins remaining): " + url);
          await page.goto(url, {timeout: 0});
          await autoScroll(page);
          const ids = await page.evaluate((blacklistedComponents) => {
            return [...document.querySelectorAll('.ws-compid')].map(component => !blacklistedComponents.some(blacklistedComponents => component.innerText.startsWith(blacklistedComponents)) ? {id: component.innerText, type: Object.entries(component.classList).pop()[1]} : null).filter(comp => comp !== null);
          }, blacklistedComponents);
          const pageUpdated = ids.every(el => el.type === "a11y-true")
          allData.push({url, ids, pageUpdated});
          let data = JSON.stringify(allData);
          fs.writeFileSync(`./CSV/componentIds-no-blacklisted-${currentDate()}.json`, data);
          await page.close();
        }
      }

      await browser.close();
    } catch (err) {
      console.error(err);
    }
  })();