const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main() {
    let rawdata = fs.readFileSync('./cleanedPageIds.json');
    let sites = JSON.parse(rawdata);
    const urls = Object.values(sites).map(item => item);
    const componentDetails = []
    for(url of urls){
      componentDetails.push({'id': url.id, 'link': `${url.urls.shift().split("?wscallouts")[0]}`})
    }
    let data = JSON.stringify(componentDetails);
    fs.writeFileSync('idsToScreenshot.json', data);
})();