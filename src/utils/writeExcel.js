import { write, utils } from "xlsx";

const s2ab = (s) => { 
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;    
}

export const createSheet = (jsonData, sheetName) => {
    const workbook = utils.book_new();
    const sheet = utils.json_to_sheet(jsonData);
    utils.book_append_sheet(workbook, sheet, sheetName);
    const binaryXlsx = write(workbook, { bookType: 'xlsx', type: 'binary' });
    return s2ab(binaryXlsx);
}