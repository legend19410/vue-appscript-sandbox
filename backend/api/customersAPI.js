

function CONTROLLER_GET_ALL_CUSTOMERS(params){
  return applyMiddlewares(
    function (params){
      const customers = CustomerService.getAllCustomers()
      return JSON.stringify({
          statusCode: 200,
          data: customers
      });
    },
    'CONTROLLER_GET_ALL_CUSTOMERS',
    [authMiddleware, logMiddleware, responseWrapperMiddleware]
  )(params);
}


function CONTROLLER_GET_ALL_CUSTOMER_REQUESTS(params){
  return applyMiddlewares(
    function (params){
      const customerRequests = CustomerService.getAllCustomerRequests()
      const customerRequestsSummary = CustomerService.getCustomerRequestSummary()
      customerRequests['summary'] = customerRequestsSummary
      return JSON.stringify({
        statusCode: 200,
        data: customerRequests
      });
    },
    'CONTROLLER_GET_ALL_CUSTOMER_REQUESTS',
    [authMiddleware, logMiddleware, responseWrapperMiddleware]
  )(params);
}

function CONTROLLER_GET_DROPDOWN_OPTIONS(params){
  return applyMiddlewares(
    function (params){
      const dropDownData = UtilityService.getDropdownOptions();
      return JSON.stringify({
        statusCode: 200,
        data: dropDownData
      });
    },
    'CONTROLLER_GET_DROPDOWN_OPTIONS',
    [authMiddleware, logMiddleware, responseWrapperMiddleware]
  )(params);
}

function CONTROLLER_UPDATE_CUSTOMER_REQUESTS(params){
  return applyMiddlewares(
    function (params){
      // server side validation
      const customerRequestId = params.body.customerRequestId
      const customerRequestData = params.body.customerRequestData

      const response = CustomerService.updateCustomerRequest(customerRequestId, customerRequestData)

      return JSON.stringify({
        statusCode: 200,
        data: null,
        message: response
      });
    },
    'CONTROLLER_UPDATE_CUSTOMER_REQUESTS',
    [authMiddleware, logMiddleware, responseWrapperMiddleware]
  )(params);
}



function test882882h(){
  // ✅ Valid request

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmFuY2lzbWlsdG9uMTk0MTBAZ21haWwuY29tIiwibmFtZSI6Ik1pbHRvbiBGcmFuY2lzIiwicm9sZXMiOlsidmlld2VyIiwic3RhbmRhcmQiLCJhZG1pbiJdLCJpYXQiOjE3NTcwMjQzMzgsImV4cCI6MTc1NzAyNzkzOH0.NJPduiofaAWtPKUkw6SR3G_39JxB_spU6yIekB5N59o'

console.log(CONTROLLER_GET_ALL_CUSTOMERS(JSON.stringify({ token})));



}