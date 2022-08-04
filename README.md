WCSComponentSearch.git

The component scraper currently visits all pages across Apps Pillars, Industries, OCI, and Cloud HW and SW and scrapes them for component ID's.

Use React app to display, sort and filter results.

There are two parts to this project:
1. Scrape data from JSON lists of URLS of each group
2. React app under that consumes `json` from an aggregate source and additional sources for each pillar and renders the content filtered and sorted.

*NOTE*: To currently run the project, you must scrape each grouping of URL's (appsPillarsURLs.json, cloudWorldURLs.json, industriesURLs.json, and ociURLs.json) separately. get all ids from each page, clean the data, install the app and render the project. Each function can also be run independently for resolving any issues.

# Step 1
## Component Scraper ##
First, run `npm install` to install all required packages including puppeteer. 

Puppeteer will allow you to scrape the component ID's from each URL.

## Now, start scraping with the following:
Change the file path in `getIds.js` to read the URLs from the first grouping: `let rawdata = fs.readFileSync('./appsPillarsURLs.json');`

Run `node getIds.js` to start the scraping process.

If blocked from oracle.com or a timeout occurs and a lot of URLs have already been scraped, then modify the output file to the pillarname + 1, 2, etc. This will create an 
additional JSON file that will need to be combined at the end for cleaning (converting urls -> id's to id's -> urls).

The above command will loop over the array of sites, grab all component ids with `ws-compid` and save them to `appsPillarsIds.json` or whichever is the current group being scraped. 

### **MUST RUN** To clean the data ###
Now, run `node cleanData.js` to open the associated `.json` and clean the data so that all ID's are now listed with the URL that they appear in.
# Step 2

## Spin up the React app to see the data
Run `yarn` if you haven't already done so from the root.

Copy `cleanedData.json` to the `/public` folder so the React app can read the data.

Now, run `yarn start` to spin up React app.
