const puppeteer = require('puppeteer');
const fs = require('fs')

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.oracle.com/sitemap.html');
    
    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let elements = [...document.querySelectorAll('.u02menu-l1 ul li a')].map(page => page.href); // Select all links

        for (var element of elements){ // Loop through each url
            if(element.includes("https://www.oracle.com/")){
                data.push(element + '?wscallouts'); // Push the url onto our array
            }
        }

        return [...new Set(data)]; // Return our data array and removes duplicates
    });
    
    browser.close();
    let data = JSON.stringify(result);
    fs.writeFileSync('sites.json', data);
    return result; // Return the data
};

scrape().then((value) => {
    console.log(value); // Success!
});