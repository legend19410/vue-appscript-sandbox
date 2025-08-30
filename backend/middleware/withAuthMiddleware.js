function withAuthMiddleware(handler, endpoint) {

  return function(paramsJson) {
    Logger.log("Attempting to Authenticate and Authorize request for endpoint: "+ endpoint)

    const params = JSON.parse(paramsJson);
    const tokenValidationResponse = AuthService.verifyJWT(params.token);

    if(tokenValidationResponse.success){
    
      const decodedToken = AuthService.decodeJWT(params.token)
      Logger.log("Decoded Token: "+ JSON.stringify(decodedToken))

      const endpointPermissions = AuthService.getEndpointPermissions(endpoint)
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
    return handler(params);
  };
}


// resource-level policy:
// function canOnResource(authContext, permission, resources) {
//   if (!can(ctx, perm)) return false;
//   // Example ownership rule:
//   if (resource.tenantId && ctx.tenantId && resource.tenantId !== ctx.tenantId) return false;
//   return true;
// }

// const Permission = `${string}.${"read"|"create"|"update"|"delete"}`;

// interface AuthContext {
//   userId: string;
//   roles: string[];
//   permissions: Permission[]; // resolved from roles
//   tenantId?: string;
// }

// function can(ctx: AuthContext, perm: Permission) {
//   return ctx.permissions.includes(perm);
// }

// // resource-level policy:
// function canOnResource(ctx: AuthContext, perm: Permission, resource: { ownerId?: string, tenantId?: string }) {
//   if (!can(ctx, perm)) return false;
//   // Example ownership rule:
//   if (resource.tenantId && ctx.tenantId && resource.tenantId !== ctx.tenantId) return false;
//   return true;
// }



// function withAuth(handler) {
//   return function(paramsJson) {
//     try {
//       const params = JSON.parse(paramsJson || "{}");
//       const token = params.token || "";
//       const claims = AuthService.verifyJWT(token); // { sub, roles, tid }

//       if (!claims) {
//         return JSON.stringify({ statusCode: 401, message: "Unauthorized" });
//       }

//       // Resolve permissions from roles (cache this!)
//       const permissions = RoleService.resolvePermissions(claims.roles); 
//       const ctx = { userId: claims.sub, roles: claims.roles, permissions, tenantId: claims.tid };

//       // Pass ctx + params into handler
//       const result = handler({ ctx, body: params.body, query: params.query });
//       return JSON.stringify({ statusCode: 200, data: result });
//     } catch (e) {
//       return JSON.stringify({ statusCode: 500, message: e.message });
//     }
//   };
// }

