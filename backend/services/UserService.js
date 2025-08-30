const UserService = {

  _generateId(){
    const idCountRepo = new SheetORM(CONFIG.DATABASE_SETTINGS.SHEET_ID, CONFIG.DATABASE_SETTINGS.TABLE_CONFIG_SHEET_NAME)
    const usersTableConfig = idCountRepo.where(table => table.tableName === 'Users').first()
    const lastUserId = usersTableConfig.idCount
    const newId = lastUserId + 1
    idCountRepo.updateById(usersTableConfig.id, {idCount: newId})
    return newId
  },

  getAllUsers(){
    const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME, CONFIG.USERS.DEFAULT_EXCLUDES)
    const user = userRepository.find().all()
    return user;
  },

  findUserByEmail(email) {
    const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME, CONFIG.USERS.DEFAULT_EXCLUDES)
    const user = userRepository.where(user => user.email === email.trim()).first()
    return user;
  },

  findUserByUserId(userId) {
   const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME, CONFIG.USERS.DEFAULT_EXCLUDES)
    const user = userRepository.findById(userId)
    return user;
  },

  registerUser(userObj){
    
    const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME, CONFIG.USERS.DEFAULT_EXCLUDES)

    const salt = AuthService.generateSalt();
    const hashedPassword = AuthService.hashPassword(userObj.password, salt);
    const newUserId = this._generateId()
    userObj['id'] = newUserId
    userObj['passwordHash'] = hashedPassword
    userObj['passwordSalt'] = salt
    userObj['updatedAt'] = new Date()
    userObj['createdAt'] = new Date()

    userRepository.insert(userObj)

    //get user with limited fields
    const userReponse = userRepository.findById(newUserId,[
        'id',
        'firstName',
        'lastName',
        'gender',
        'role',
        'status'
    ])

    return userReponse
  },

}

function test883888(){
 // const out = UserService.findUserByEmail('milton@gmail.com')
  const out = UserService._generateId()

  //const out = UserService.findRowByUserId(1)

  console.log(out)
}

function test9288(){
  const out = UserService.registerUser(
    {
      email: 'francis@gmail.com',
      firstName: 'Milton',
      lastName: 'Francis',
      roles: "['standard','admin']",
      password: 'password1',
      status: 'active',
      gender: 'male'
  })
  console.log(out)
}