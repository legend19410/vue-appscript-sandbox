
function CONTROLLER_GET_ALL_USERS(params){
  return applyMiddlewares(
    function (params){
      const users = UserService.getAllUsers()
      return JSON.stringify({
          statusCode: 200,
          data: users
      });
    },
    'CONTROLLER_GET_ALL_USERS',
    [logMiddleware, responseWrapperMiddleware]
  )(params);
}