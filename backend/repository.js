const Repository = {
// sheetId
SHEET_ID: '1UDAF_YXRi93pYaKzOuIr7pmTbVVnkfoKzQ7Z8kgYC5s',

// get users details 
 getUsers() {
  const userSheet = SpreadsheetApp.openById(this.SHEET_ID).getSheetByName(CONFIG.USERS.SHEET_NAME);
  let users = {};
  userSheet
    .getDataRange()
    .getValues()
    .forEach((value, index) => {
        let key = value[1].toString().trim().toLowerCase();
        users[key] = {
          email: key,
          role: value[2].toString().trim(),
          name: value[3].toString().trim(),
          status: value[4].toString().trim(),
          jobRoles: value[5].toString().trim().split(","),
         // token: getToken(key),
        };
    });
 // console.log(users) 
  return users
}
}

function test92399(){
  const output = Repository.getUsers()
  console.log(output)
}


