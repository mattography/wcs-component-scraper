const fs = require('fs');

let rawdata = fs.readFileSync('./componentIds-no-blacklisted-12-12-2022.json');
let sites = JSON.parse(rawdata);
const separator = ','

const useQueue = (type) => {
  return {
    'erp':'erpm',
    'cx':'erpm',
    'hcm':'erpm',
    'applications':'erpm',
    'performance-management':'erpm',
    'industries':'industries',
    'cloud':'technology',
    'database':'technology',
    'autonomous':'technology',
    'systems':'technology',
    'application-development':'technology',
    'support':'corporate',
    'security':'corporate',
    'careers':'corporate',
    'events':'corporate',
    'sustainability':'corporate',
    'news':'corporate',
    'pressroom':'corporate'
  }[type] || 'corporate'
}
const header = ["queue", "folder", "url", "id", "type", "pageUpdated"]
const body = sites.reduce((r, { url, ids, pageUpdated }) => {
  ids.forEach((e, i) => {
    const other = header.slice(3).map(k => e[k]).join(separator).replace(/,*$/, '')
    const updated = pageUpdated;
    r.push([useQueue(url.split("/")[3]), url.split("/")[3], url, other, updated].join(separator))
  })
  return r
}, [])

const result = `${header.join(separator)}\n${body.join('\n')}`

console.log(result)
fs.writeFileSync('./componentIds-no-blacklisted-12-12-2022.csv', result);