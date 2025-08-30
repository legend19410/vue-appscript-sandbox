const getUsers = function(params) {

  const user = Repository.getUsers()
  console.log(user)
  return JSON.stringify({
    statusCode: 200,
    data: user
  });
};

const login = function (paramsJson){
  const params = JSON.parse(paramsJson);
  const response = AuthService.login(params.body.email, params.body.password);

  if (response.success) {
    return JSON.stringify({
      statusCode: 200,
      data: response
    });
  } else {
    return JSON.stringify({
      statusCode: 401,
      message: response.message
    });
  }
}

function CONTROLLER_GET_NAV_DROPDOWN_OPTIONS(params) {
  return withAuthMiddleware(function (params) {
    const navData = UtilityService.getNavDropdownOptions();
    return JSON.stringify({
      statusCode: 200,
      data: navData
    });
  }, CONTROLLER_GET_NAV_DROPDOWN_OPTIONS.name)(params);
}

function CONTROLLER_GET_ALL_CUSTOMERS (params){
  return withAuthMiddleware(function (params) {
    const customers = CustomerService.getAllCustomers()
    return JSON.stringify({
        statusCode: 200,
        data: customers
    });
  }, CONTROLLER_GET_ALL_CUSTOMERS.name)(params);

}

function CONTROLLER_GET_ALL_CUSTOMER_REQUESTS(params) {

  return withAuthMiddleware(function (params) {
    const customerRequests = CustomerService.getAllCustomerRequests()
    const customerRequestsSummary = CustomerService.getCustomerRequestSummary()
    customerRequests['summary'] = customerRequestsSummary
    return JSON.stringify({
      statusCode: 200,
      data: customerRequests
    });
  }, CONTROLLER_GET_ALL_CUSTOMER_REQUESTS.name)(params);
}


function CONTROLLER_GET_CUSTOMER_REQUESTS_BY_ID (params){
  return withAuthMiddleware(function (params) {
    Logger.log({message: 'Customer request sent', data: params })
    //validate id
    const customerRequestId = params.body.customerRequestId

    const customerRequest = CustomerService.getCustomerRequestById(customerRequestId)
    return JSON.stringify({
        statusCode: 200,
        data: customerRequest.data
      });
  }, CONTROLLER_GET_CUSTOMER_REQUESTS_BY_ID.name)(params);
  
}


const getData = function(){
  const dataRepo = new SheetORM(CONFIG.USERS.SHEET_ID, 'Data',['history','_row','deliveryDate','createdDate'])
  const allData = dataRepo.find().all()
  console.log(allData)
  return allData
}

const getUsersssssss = withAuthMiddleware(function(params) {

  const user = UserService.getAllUsers()
  return JSON.stringify({
    statusCode: 200,
    data: user
  });
});



const getUserProfile = withAuthMiddleware(function(params) {

  const user = UserService.findUserByEmail(params.body.email)
  return JSON.stringify({
    statusCode: 200,
    data: user
  });
});



function oootests(){
  const out = AuthService.login('francismilton19410@gmail.com','password1' )
  //const out = AuthService.refreshAccessToken('milton@gmail.com','jt3VQXDbc8cg1p4VntzesYnic07Ejzv8DZKlnf8axJlBfW6CmvgJsjjXB4FelLYG' )

  console.log(out)
}

function test8399(){
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmFuY2lzbWlsdG9uMTk0MTBAZ21haWwuY29tIiwibmFtZSI6Ik1pbHRvbiBGcmFuY2lzIiwicm9sZXMiOlsidmlld2VyICIsInN0YW5kYXJkICIsImFkbWluICJdLCJpYXQiOjE3NTY1NTc1MTIsImV4cCI6MTc1NjU2MTExMn0.PF0F4ocvC6I0geoZYd14px-SK-SCxMGHGR6DNgip_5E'
  const res = CONTROLLER_GET_ALL_CUSTOMER_REQUESTS(JSON.stringify({token}))
  console.log(res)
}