const CustomerService = {

  getAllCustomers(){
    const customerRepository = new SheetORM(CONFIG.CUSTOMERS.SHEET_ID, CONFIG.CUSTOMERS.SHEET_NAME, CONFIG.CUSTOMERS.DEFAULT_EXCLUDES)
    const includedHeaders = [
      'id',
      'email',
      'firstName',
      'lastName',
      'gender',
      'status',
      'emailVerified',
      'emailVerifiedAt',
      'createdAt',
      'updatedAt'

    ]
    const customers = customerRepository.find(includedHeaders)
    const headers = customers.getHeaders().filter(header=>{
      return includedHeaders.includes(header)
    }).map(header=>{
      return {title: UtilityService.camelCaseToTitleCase(header), key: header }
    })

    headers.push({ title: "", align: "start", key: "actions" })

    const data = customers.all()

    return {headers, data};
  },

  getAllCustomerRequests(){
    const customerRequestsRepository = new SheetORM(CONFIG.CUSTOMER_REQUESTS.SHEET_ID, CONFIG.CUSTOMER_REQUESTS.SHEET_NAME, CONFIG.CUSTOMER_REQUESTS.DEFAULT_EXCLUDES)
    const includedHeaders = [
      'id',
      'customerName',
      'customerContact',
      'customerEmail',
      'assignedTo',
      'cost',
      'requestType',
      'stage',
      'deliveryDate',
      'priority',
      'createdDate',
      'updatedDate',
      'description'

    ]
    const customerRequests = customerRequestsRepository.find(includedHeaders)
    const headers = customerRequests.getHeaders().filter(header=>{
      return includedHeaders.includes(header)
    }).map(header=>{
      return {title: UtilityService.camelCaseToTitleCase(header), key: header }
    })
    headers.push({ title: "", align: "start", key: "actions" })
    const data = customerRequests.all()
    return {headers, data};
  },

  getCustomerRequestById(id){
    const customerRequestsRepository = new SheetORM(CONFIG.CUSTOMER_REQUESTS.SHEET_ID, CONFIG.CUSTOMER_REQUESTS.SHEET_NAME, CONFIG.CUSTOMER_REQUESTS.DEFAULT_EXCLUDES)
    const includedHeaders = [
      'id',
      'customerName',
      'customerContact',
      'customerEmail',
      'assignedTo',
      'cost',
      'requestType',
      'stage',
      'deliveryDate',
      'priority',
      'createdDate',
      'updatedDate',
      'description'
    ]
    const data = customerRequestsRepository.findById(id, includedHeaders)
    return {data}
  },

  getCustomerRequestSummary(){
     const customerRequestsRepository = new SheetORM(CONFIG.CUSTOMER_REQUESTS.SHEET_ID, CONFIG.CUSTOMER_REQUESTS.SHEET_NAME, CONFIG.CUSTOMER_REQUESTS.DEFAULT_EXCLUDES)
     const includedHeaders = [
      'id',
      'customerName',
      'customerContact',
      'customerEmail',
      'assignedTo',
      'cost',
      'requestType',
      'stage',
      'deliveryDate',
      'priority',
      'createdDate',
      'updatedDate',
      'description'
    ]

    const customerRequests = customerRequestsRepository.find(includedHeaders)
    const totalRequests = customerRequests.all().length
    const pendingReview = customerRequests.where(cr => cr.stage === 'Pending Review').all().length
    const purchased = customerRequests.where(cr => cr.stage === 'Purchased').all().length
    const awaitingDelivery = customerRequests.where(cr => cr.stage === 'Awaiting Delivery').all().length
    const rented = customerRequests.where(cr => cr.stage === 'Rented').all().length
    const underConstruction = customerRequests.where(cr => cr.stage === 'Under Construction').all().length

    return {
      totalRequests,
      pendingReview,
      purchased,
      awaitingDelivery,
      rented,
      underConstruction
    }

  },

  updateCustomerRequest(id, data){
    const customerRequestsRepository = new SheetORM(CONFIG.CUSTOMER_REQUESTS.SHEET_ID, CONFIG.CUSTOMER_REQUESTS.SHEET_NAME, CONFIG.CUSTOMER_REQUESTS.DEFAULT_EXCLUDES)

    customerRequestsRepository.updateById(id, data);
  }
 
}

function test788(){
												
  const res = CustomerService.updateCustomerRequest(13, {customerName: 'James Parker', requestType: 'Rental', cost: 7000, updatedDate: new Date().toISOString()})
  console.log(res)
}