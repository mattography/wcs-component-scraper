export function saveToCSV(rows) {
    const keys = Object.keys(rows[0]);
    const commaSeparatedString = [keys.join(","),rows.map(row => keys.map(key => `"${[row[key]].flat().join()}"`).join(",")).join("\n")].join("\n");
    const csvBlob = new Blob([commaSeparatedString])
    const a2 = document.getElementById("download-link");   
    a2.href = URL.createObjectURL(csvBlob)
}