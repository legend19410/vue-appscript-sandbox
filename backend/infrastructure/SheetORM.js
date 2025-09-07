class SheetORM {
  constructor(sheetId, sheetName, excludedFields = []) {
    this.excludedFields = excludedFields;
    this._sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    var rawHeaders = this._sheet.getRange(2, 1, 1, this._sheet.getLastColumn()).getValues()[0];
    this._types = this._sheet.getRange(1, 1, 1, this._sheet.getLastColumn()).getValues()[0];
    this._headers = this._toCamelCaseArray(rawHeaders)
    this._resultArray = []
  }

  _toCamelCaseArray(arr) {
    return arr.map(str => {
      return str
        .trim()
        .toLowerCase()                         // convert all to lowercase
        .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase()); // remove non-alphanum and capitalize next letter
    });
  }


  _getData(includeFields = []) {
    const rows = this._sheet.getRange(3, 1, this._sheet.getLastRow() - 2, this._sheet.getLastColumn()).getValues();

    const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const hasIncludes = includeFields.length > 0;
    const normalizedIncludes = hasIncludes ? includeFields.map(normalize) : [];

    let shouldExclude = false;
    let normalizedExcludes = [];

    if (!hasIncludes && this.excludedFields.length > 0) {
      normalizedExcludes = this.excludedFields.map(normalize);
      shouldExclude = true;
    }

    return rows.reduce((acc, row, index) => {
      const obj = this._headers.reduce((obj, header, i) => {
        const normalizedHeader = normalize(header);

        if (
          (hasIncludes && normalizedIncludes.includes(normalizedHeader)) ||
          (!hasIncludes && (!shouldExclude || !normalizedExcludes.includes(normalizedHeader)))
        ) {
          obj[header] = row[i]; // or transform if needed
        }

        return obj;
      }, { _row: index + 2 });

      // skip record if `id` is empty (null, undefined, or '')
      if (obj['id']) {
        acc.push(obj);
      }

      return acc;
    }, []);

    // return rows.map((row, index) => {
    //   const obj = {};

    //   this._headers.forEach((header, i) => {
    //     const normalizedHeader = normalize(header);

    //     if (
    //       (hasIncludes && normalizedIncludes.includes(normalizedHeader)) ||
    //       (!hasIncludes && (!shouldExclude || !normalizedExcludes.includes(normalizedHeader)))
    //     ) {
    //       obj[header] = row[i] //(this._types[i] === 'List' ? 'listoo' : row[i]);
    //     }
    //   });

    //   obj._row = index + 2;
    //   return obj;
    // });
  }

  getHeaders(){
    return this._headers;
  }

  all(){
    return this._resultArray;
  }

  first(){
    return this._resultArray[0]
  }

  limit(limitNumber){
    return this._resultArray.slice(0, limitNumber)
  }

  find(includeFields = []) {
    this._resultArray =  this._getData(includeFields);
    return this
  }

  findById(id, includeFields = []) {
    let newIncludeFields = includeFields.length === 0 ? [] :  [...includeFields, 'id']
    const data = this._getData(newIncludeFields);
    const result = data.find(row => row.id == id);
     if (typeof result === 'undefined') {
      return {}
    }
    return result
  }

  where(predicateFn, includeFields = []) {
    this._resultArray = this._getData(includeFields).filter(predicateFn);
    return this
  }

  insert(data) {
    const row = this._headers.map(header => data[header] ?? '');
    this._sheet.appendRow(row);
  }

  updateById(id, newData) {
    const data = this._getData();
    const row = data.find(row => row.id == id);
    if (!row) throw new Error('Record not found');

    const rowIndex = row._row + 1;
    const updatedRow = this._headers.map((header) =>
      newData[header] !== undefined ? newData[header] : row[header]
    );

    this._sheet.getRange(rowIndex, 1, 1, this._headers.length).setValues([updatedRow]);
    return `Record ${id} item updated successfully.`
  }

  deleteById(id) {
    const data = this._getData();
    const row = data.find(row => row.id == id);
    if (!row) throw new Error('Record not found');

    this._sheet.deleteRow(row._row);
  }
}

function test8899(){
  const userR = new SheetORM(CONFIG.USERS.SHEET_ID, "CustomerRequests", ['passwordhash', 'passwordsalt'])
  //const res = userR.find(['id', 'email']).limit(1)
  //const res = userR.where(u => u.id >= 3 && u.role === 'standarD').all();

  //const res = userR.findById(2, [])
  const res = userR.getHeaders()

  
  console.log(res)
}

function tttest(){
      //console.log(this.findById(1))
      // Insert
  //users.insert({ id: 1, name: 'Alice', age: 25 });

  // Find all
 // const all = users.findAll();
  //Logger.log(all);

  // Find by ID
  //const user = users.findById(1);
  //Logger.log(user);

  // Where
  //const res = this.where(u => u.il >= 3);
  //console.log(res);

  // Update
  updateById(30, { Role: 'standard', Status: 'active'});

  // Delete
  //users.deleteById(1);
  }
