const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main() {
    let rawdata = fs.readFileSync('./idsToScreenshot.json');
    let sites = JSON.parse(rawdata);

    try {
      const browser = await puppeteer.launch({headless: true});
      const [page] = await browser.pages();
      
      const urls = Object.values(sites).map(item => item);
      let count = 0;
      for(const url of urls){
          count++
          let remainingTime = ((urls.length - count) * 5 / 60).toFixed(2);
          const page = await browser.newPage();
          await page.setExtraHTTPHeaders({
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
          });
          console.log(count + " of " + urls.length + ": capturing id " + url.id + " from " + url.link + "(" + remainingTime + " mins remaining)");
          await page.setViewport({
            width: 1368,
            height: 768
          });
          await page.goto(`${url.link}`);
          await page.setDefaultNavigationTimeout(0);
          await page.$$eval('.ochat_slideout, .cb27, .u30, .ct12', els => els.map(el => el.remove()));
          await page.waitForSelector(`.${url.id.toLowerCase()}`).then(() => console.log('scraped', url.id.toLowerCase()));        
          const component = await page.$(`.${url.id.toLowerCase()}`);     
          const bounding_box = await component.boundingBox(); 
          await page.evaluate((url) => {
            const element = document.querySelector(`.${url.id.toLowerCase()}`);
            if(element){
              element.scrollIntoView();
            }
          }, url);
          await page.waitForTimeout(5000); 
          await component.screenshot({
            path: `./component-screenshots-1368/${url.id.toLowerCase()}.png`,
            clip: {
              x: bounding_box.x,
              y: bounding_box.y,
              width: Math.min(bounding_box.width, page.viewport().width),
              height: Math.min(bounding_box.height, page.viewport().height),
            }
            });
          await page.close();                 
      }
    await browser.close();
    } catch (err) {
      console.error(err);
    }

})();