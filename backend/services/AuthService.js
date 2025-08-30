const AuthService = {


/**Login*/
login(email, password){
  const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME)
  const user = userRepository.where(user => user.email.toLowerCase() === email?.toLowerCase()).first()
  if(typeof user !== 'undefined'){
    // get user roles
    const userRolesRepository = new SheetORM(CONFIG.USER_ROLES.SHEET_ID, CONFIG.USER_ROLES.SHEET_NAME)
    const userRoles = userRolesRepository.where(userRole => userRole.userId === user.id).all()
    const userRoleArray = userRoles.map(role=> role.roleName.trim())
    //get hash but convert user into obj before return later
    const salt = user.passwordSalt
    const passwordHash = user.passwordHash
    const isAuthUser = this.verifyPassword(password, salt, passwordHash)

    if(isAuthUser){
      const firstName = user.firstName
      const lastName = user.lastName
      const fullName = `${firstName} ${lastName}`

      const token = this.generateJWT(email, fullName, userRoleArray, CONFIG.AUTH.JWT_EXP_TIME_IN_SECONDS)
      const refreshToken = this.generateRefreshToken()

      //store refresh token
      const now = new Date();
      const newExpiry = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 1); // 1 days from now
      userRepository.updateById(user.id, {refreshToken: refreshToken, refreshTokenExpiredAt: newExpiry.toISOString()})

      //get user with limited fields
      const userReponse = userRepository.findById(user.id,[
        'id',
        'firstName',
        'lastName',
        'email',
        'gender',
        'role',
        'status'
      ])

      return {
        accessToken: token,
        refreshToken: refreshToken,
        message: 'tokens successfully retreived',
        success: true,
        user: userReponse
      }
    }else{
      return{
        success: false,
        message: 'Unauthorized',
        user: null
      }
    }
 }else{
  return{
        success: false,
        message: 'Unauthorized',
        user: null
  }
}
},

/**hashPassword*/

 hashPassword(password, salt) {
  const text = salt + password; // Combine salt with password
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text);
  const hash = digest.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  return hash;
},

/**generateSalt*/

generateSalt(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
},

/**verifyPassword*/

 verifyPassword(inputPassword, storedSalt, storedHash) {
  const inputHash = this.hashPassword(inputPassword, storedSalt);
  return inputHash === storedHash;
},

/**generateJWT*/

 generateJWT(email, name, roles, expirationTimeInSeconds) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const payload = {
    sub: email,            // subject
    name: name,             
    roles: roles,             // custom claim array
    iat: Math.floor(Date.now() / 1000), // issued at
    exp: Math.floor(Date.now() / 1000) + expirationTimeInSeconds 
  };

  const secret = CONFIG.AUTH.JWT_SECRET; // 🔐 keep this secure!

  // Encode header and payload
  const encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header)).replace(/=+$/, '');
  const encodedPayload = Utilities.base64EncodeWebSafe(JSON.stringify(payload)).replace(/=+$/, '');

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signatureBytes = Utilities.computeHmacSha256Signature(signatureInput, secret);
  const encodedSignature = Utilities.base64EncodeWebSafe(signatureBytes).replace(/=+$/, '');

  const jwt = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  
  return jwt;
},

/**verifyJWT*/

verifyJWT(token) {
  const secret = CONFIG.AUTH.JWT_SECRET; // must match the secret used to sign it

  const parts = token.split(".");
  if (parts.length !== 3) {
    Logger.log("Invalid JWT format");
    return {
      success: false,
      message: "Invalid JWT format"
    }
  }

  const [encodedHeader, encodedPayload, receivedSignature] = parts;

  // Recalculate the signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const computedSignatureBytes = Utilities.computeHmacSha256Signature(signatureInput, secret);
  const computedSignature = Utilities.base64EncodeWebSafe(computedSignatureBytes).replace(/=+$/, '');

  // Compare signatures
  if (computedSignature !== receivedSignature) {
    Logger.log("Invalid signature");
    return {
      success: false,
      message: "Invalid signature"
    }
  }

  // Decode payload and check expiration
  const payloadJson = Utilities.newBlob(Utilities.base64DecodeWebSafe(encodedPayload)).getDataAsString();
  const payload = JSON.parse(payloadJson);

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    Logger.log("Token has expired");
    return {
      success: false,
      message: "Token has expired"
    }
  }

  // Token is valid
  Logger.log("Token verified. Payload: %s", JSON.stringify(payload));
  return {
    success: true,
    message: "token verified successfully"
  };
},

decodeJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    Logger.log("Invalid JWT format");
    return {
      success: false,
      message: "Invalid JWT format"
    };
  }

  const [encodedHeader, encodedPayload] = parts;

  try {
    // Decode header
    const headerJson = Utilities.newBlob(
      Utilities.base64DecodeWebSafe(encodedHeader)
    ).getDataAsString();
    const header = JSON.parse(headerJson);

    // Decode payload
    const payloadJson = Utilities.newBlob(
      Utilities.base64DecodeWebSafe(encodedPayload)
    ).getDataAsString();
    const payload = JSON.parse(payloadJson);

    return {
      success: true,
      header,
      payload
    };
  } catch (err) {
    Logger.log("Error decoding JWT: %s", err);
    return {
      success: false,
      message: "Error decoding JWT"
    };
  }
},

generateRefreshToken() {
  const tokenLength = 64; // adjust for security
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let refreshToken = "";
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    refreshToken += charset.charAt(randomIndex);
  }

  Logger.log("Refresh Token: " + refreshToken);
  return refreshToken;
},

 isValidRefreshToken(userEmail, token) {
  const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME)
  const now = new Date();

  //find user
  const validUser = userRepository.where(u => u.email?.toLowerCase() === userEmail?.toLowerCase()).first()
  console.log(validUser)
  const expiry = new Date(validUser.refreshTokenExpiredAt);
  if(typeof validUser !== 'undefined' && expiry > now && validUser.refreshToken === token){
    return true
  }
  return false;
},

 refreshAccessToken(userEmail, refreshToken) {
  if (this.isValidRefreshToken(userEmail, refreshToken)) {
    const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME)
    const validUser = userRepository.where(u => u.email?.toLowerCase() === userEmail?.toLowerCase()).first()
    const firstName = validUser.firstName
    const lastName = validUser.lastName
    const fullName = `${firstName} ${lastName}`

    // get user roles
    const userRolesRepository = new SheetORM(CONFIG.USER_ROLES.SHEET_ID, CONFIG.USER_ROLES.SHEET_NAME)
    const userRoles = userRolesRepository.where(userRole => userRole.userId === validUser.id).all()
    const userRoleArray = userRoles.map(role=> role.roleName)

    const accessToken = this.generateJWT(userEmail, fullName, userRoleArray, CONFIG.AUTH.JWT_EXP_TIME_IN_SECONDS); // You would pass user info into the payload
    return {
      accessToken: accessToken,
      success: true
    }
  } else {
    throw new Error("Invalid refresh token");
  }
},

getEndpointPermissions(endpoint){

  //check if endpoint permissions are cached. If not get from sheet then cache
  const cache = CacheService.getScriptCache();
  var endpointPerm = []

  const endpointPermissionCache = cache.get("endpoint_permissions");

  if(endpointPermissionCache){
     endpointPerm = JSON.parse(endpointPermissionCache);
     endpointPerm = endpointPerm.filter(ep => ep.endpointName?.trim() === endpoint)
     return endpointPerm
  }

  const endpointPermissionsRepository = new SheetORM(CONFIG.ENDPOINT_PERMISSIONS.SHEET_ID, CONFIG.ENDPOINT_PERMISSIONS.SHEET_NAME)
  const allEndpointPermission = endpointPermissionsRepository.find().all()
  cache.put("endpoint_permissions", JSON.stringify(allEndpointPermission), CONFIG.CACHE.PERMISSIONS_TTL); // 6 hour
  endpointPerm = endpointPermissionsRepository.where(ep => ep.endpointName?.trim() === endpoint).all()
  return endpointPerm
},

getRolePermissions(roleList){

  const cache = CacheService.getScriptCache();
  var rolePerm = []

  const rolePermissionCache = cache.get("role_permissions");

  if(rolePermissionCache){
    rolePerm = JSON.parse(rolePermissionCache);
    rolePerm = rolePerm.filter(rp => roleList.includes(rp.roleName?.trim()))
    return rolePerm
  }

  const rolePermissionsRepository = new SheetORM(CONFIG.ROLE_PERMISSIONS.SHEET_ID, CONFIG.ROLE_PERMISSIONS.SHEET_NAME)
  const allRolePermissions = rolePermissionsRepository.find().all()
  cache.put("role_permissions", JSON.stringify(allRolePermissions), CONFIG.CACHE.PERMISSIONS_TTL); // 6 hour
  rolePerm = rolePermissionsRepository.where(rp => roleList.includes(rp.roleName?.trim())).all()
  return rolePerm
},

cacheEndpointPermissions(){
  const cache = CacheService.getScriptCache();

  const endpointPermissionsRepository = new SheetORM(CONFIG.ENDPOINT_PERMISSIONS.SHEET_ID, CONFIG.ENDPOINT_PERMISSIONS.SHEET_NAME)
  const endpointPerm = endpointPermissionsRepository.find().all()

  // Convert to JSON before caching
  cache.put("endpoint_permissions", JSON.stringify(endpointPerm), CONFIG.CACHE.PERMISSIONS_TTL); // 6 hour
},

cacheRolePermissions(){

  const cache = CacheService.getScriptCache();

  const rolePermissionsRepository = new SheetORM(CONFIG.ROLE_PERMISSIONS.SHEET_ID, CONFIG.ROLE_PERMISSIONS.SHEET_NAME)
  const rolePerm = rolePermissionsRepository.find().all()

  // Convert to JSON before caching
  cache.put("role_permissions", JSON.stringify(rolePerm), CONFIG.CACHE.PERMISSIONS_TTL); // 6 hour

},

cachePermissions(){
  cacheEndpointPermissions()
  cacheRolePermissions()
},

canOnResource(endpointPermissions, rolePermissions) {
  // Extract permissionIds from roles into a Set for fast lookup
  const rolePermissionSet = new Set(rolePermissions.map(rp => rp.permissionId));

  // Check each endpoint permission
  return endpointPermissions.every(ep => rolePermissionSet.has(ep.permissionId));
}



}

function test88hhh(){
  //const out = AuthService.login('milton@gmail.com','password' )
  //const out = AuthService.refreshAccessToken('milton@gmail.com','jt3VQXDbc8cg1p4VntzesYnic07Ejzv8DZKlnf8axJlBfW6CmvgJsjjXB4FelLYG' )

  //const res1 = AuthService.getEndpointPermissions('CONTROLLER_GET_NAV_DROPDOWN_OPTIONS')
  //const res = AuthService.getRolePermissions([ 'admin', 'standard'])

  //console.log(res)
  const res = AuthService.cachePermissions()
  console.log(res)

}

function testujhnfj(){
  

  const res = AuthService.decodeJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmFuY2lzbWlsdG9uMTk0MTBAZ21haWwuY29tIiwibmFtZSI6Ik1pbHRvbiBGcmFuY2lzIiwicm9sZXMiOlsidmlld2VyICIsInN0YW5kYXJkICIsImFkbWluICJdLCJpYXQiOjE3NTY1NTc1MTIsImV4cCI6MTc1NjU2MTExMn0.PF0F4ocvC6I0geoZYd14px-SK-SCxMGHGR6DNgip_5E' )

  console.log(res)

}

function test88hh992999h(){
  const token = AuthService.generateJWT('mil@gmail.com', 'some anme',['viewer', 'admin', 'standard'], CONFIG.AUTH.JWT_EXP_TIME_IN_SECONDS)
  console.log(token)
  const out = AuthService.verifyJWT(token)
  console.log(out)


//   const email = 'francismilton19410@gmail.com'
// const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME)
//   const user = userRepository.where(user => user.email.toLowerCase() === email?.toLowerCase()).first()

//   console.log(user)
//   const userRolesRepository = new SheetORM(CONFIG.USER_ROLES.SHEET_ID, CONFIG.USER_ROLES.SHEET_NAME)
//     const userRoles = userRolesRepository.where(userRole => userRole.userId === user.id).all()
//     const userRoleArray = userRoles.map(role=> role.roleName)
//     console.log(userRoles)
//     console.log(userRoleArray)

}

function testttyn(){
  const userRepository = new SheetORM(CONFIG.USERS.SHEET_ID, CONFIG.USERS.SHEET_NAME)
  
  //userRepository.updateById(5, { Role: 'standard', Status: 'activated'})
  userRepository.updateById(5, {refreshToken: 'sameReFToken', refreshTokenExpiredAt: "some date"})

}




