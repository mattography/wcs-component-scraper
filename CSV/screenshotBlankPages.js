const puppeteer = require('puppeteer');
const fs = require('fs');
const dir = "./blankPageScreenshots";

(async function main() {
  //Create /blankPageScreenshots folder if it doesn't exist
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
    let rawdata = fs.readFileSync('./blankPages.json');
    let sites = JSON.parse(rawdata);

    try {
      const browser = await puppeteer.launch({headless: true});
      let count = 0;
      for(let url of sites){
          count++
          const page = await browser.newPage();
          await page.setExtraHTTPHeaders({
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'
          });
          console.log(`capturing page: ${count} of ${sites.length}: ${url}`);
          await page.setViewport({
            width: 1368,
            height: 768
          });
          await page.goto(`${url}`, {waitUntil: 'networkidle0'});
          await page.screenshot({
            path: `./blankPageScreenShots/${url.split("www.oracle.com")[1].replaceAll("/","-")}.png`
          });
          await page.close();                 
      }
    await browser.close();
    } catch (err) {
      console.error(err);
    }
})();