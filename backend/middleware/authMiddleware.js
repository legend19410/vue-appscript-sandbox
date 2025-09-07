// Authentication middleware
function authMiddleware(params, next) {

  Logger.log("Attempting to Authenticate and Authorize request for endpoint: "+ params.endpoint)

  const tokenValidationResponse = AuthService.verifyJWT(params.token);

  if(tokenValidationResponse.success){
  
    const decodedToken = AuthService.decodeJWT(params.token)
    Logger.log("Decoded Token: "+ JSON.stringify(decodedToken))

    const endpointPermissions = AuthService.getEndpointPermissions(params.endpoint)
    const rolePermissions = AuthService.getRolePermissions(decodedToken.payload.roles)

    //compare endpoint perms and user role perms
    const isAuthorized = AuthService.canOnResource(endpointPermissions, rolePermissions)

    if(!isAuthorized){
      Logger.log("User "+decodedToken.payload.sub+ " not unauthorized to access resource.")
      return JSON.stringify({
        statusCode: 403,
        data: null
      })
    }

  }

  if(!tokenValidationResponse.success){
    Logger.log("User failed authentication.")
    return JSON.stringify({
      statusCode: 401,
      data: tokenValidationResponse
    })
  }

  Logger.log("Authentication and Authorization sucecssfull")

  return next(params); // pass to next
}
