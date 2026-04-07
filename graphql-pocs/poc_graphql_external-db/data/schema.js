import { buildSchema } from "graphql";

const schema = buildSchema(`

input CustomerInput{
    id: ID
    name: String
    type: String
    status: String    
    region: String
}

type Subscription {
    somethingChanged: Result
}
type Result {
    id: String
}

type ContactStatus{
    contact_status_id: ID
    contact_status_enum: String
    short_desc: String    
    description: String      
}

type Contact{
    contact_id: ID
    contact_type_id: Int
    first_name: String
    middle_initial: String
    last_name: String
    email: String
    address_id: Int
    phone_id_1: Int
    phone_id_2: Int
    phone_id_3: Int
    personal_identifier: String
    personal_identifier_type_id: Int    
    inserted_by: String
    updated_by: String
    version: Int
    name_title_id: Int
    name_suffix_id: Int
    contact_status_id: Int
    customer_id: String
    job_title: String
    agency_field1: String
    agency_field2: String
    agency_field3: String
}

"""
This is Customer definition
"""
type Customer {
    """  Uniquely identify the Customer
    """
    id: ID

    """
     Name of the Customer
     """
    name: String

    """ Denotes the Customer type

    Valid types are:

    Retail
    
    B2B
    
    TCS
    
    Inspection
    """
    type: String

    """ Denotes the status of the Customer
    
    Valid statuses are:
    
    PendingApproval
    
    Active
    
    Suspend
    
    Terminated

    """
    status: String 

    # ... Regoin of the Customer which he belongs to.
    region: String       
}

type Query {
    """
    This query gets Customer details
    """
    getCustomer(id: ID): Customer   

    """
    This query gets All Customers details
    """
    getAllCustomers: [Customer]

    """
    This query gets Customer details by status

    Status is input to this query
    """
    getCustomerByStatus(input: String): [Customer]


    getCustomersWithPagination(limit: Int, offset: Int): [Customer]    

    """
    This query gets All Contact Statuses from UMB CMS Database
    """
    getContactStatusFromPSQLCMC_DB: [ContactStatus]

    """
    This query gets All Contact details from UMB CMS Database
    """
    getContactsFromPSQLCMC_DB: [Contact]    
}


type Mutation {
    createCustomer(input: CustomerInput): Customer   
    updateCustomer(id: ID!, input: CustomerInput) : Customer
}

`)

export default schema;