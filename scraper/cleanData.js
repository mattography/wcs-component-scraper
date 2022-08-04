const fs = require('fs');

let rawdata = fs.readFileSync('./combinedPageIds.json');
let sites = JSON.parse(rawdata);

const grouped = {};
for (const obj of sites) {
  for (const idObj of obj.ids) {
    if (!grouped[idObj.id]) {
      grouped[idObj.id] = {
        id: idObj.id,
        type: idObj.type,
        urls: []
      }
    }
    grouped[idObj.id].urls.push(obj.url)
  }
}

fs.writeFileSync('cleanedDedupedPageIds.json', JSON.stringify(grouped));


