import { buildSchema } from "graphql";

const schema = buildSchema(`

type Audion {
    id: ID
    audionName: String
    team: String
    attended: Boolean
}

type Customer {
    id: ID
    name: String
    type: CustomerType
    status: CustomerStatus    
    locations: [Location]!
    region: String
    orders: [Order]!
}

enum CustomerType{
    RETAIL
    B2B
    TRAVELER
    INSPECTION
}

enum CustomerStatus {
    PENDINGAPPROVAL
    APPROVED
    ACTIVE
    SUSPENDED
}

type Location {
    locationName: String
    locationRegion: String
}

input LocationInput {
    locationName: String
    locationRegion: String
}

type Order{
    orderId: ID
    orderType: String
    orderStatus: String
    transitAccountId: String
}

input OrderInput {
    orderId: ID
    orderType: String
    orderStatus: String
    transitAccountId: String
}

type TransitAccount{
    id: ID    
    riderClassId: String
    accountStatus: TransitAccountStatus    
    grantToken: String        
    productCatalog: ProductCatalog
}

enum TransitAccountStatus{
    ACTIVE
    SUSPEND
    LOST
}

type ProductCatalog {
    riderClassId: String
    productName: String
    mediaProductName: String
}

type Book{
    title: String
    author: String
}
type UMBApps{
    id: ID
    title: String
}

type Users{
    id: Int
    name: String
    age: String
}

type Query {
    getCustomer(id: ID): Customer
    getAllCustomers: [Customer]
    getTransitAccountDetails(id: ID): TransitAccount
    getProductCatalog(riderClassId: ID): ProductCatalog
    getAudion(id: ID): Audion
    getAllAudions: [Audion]   
    getBooks: [Book] 
    getUsersFromRest: [Users]
    getCustomerViaREST: [Customer]
}


input CustomerInput{
    id: ID
    name: String
    type: CustomerType
    status: CustomerStatus    
    locations: [LocationInput]!
    region: String
    orders: [OrderInput]
}

input TransitAccountInput{
    id: ID    
    riderClassId: String
    accountStatus: TransitAccountStatus    
    grantToken: String  
    productCatalog: ProductCatalogInput      
}

input ProductCatalogInput{
    riderClassId: String
    productName: String
    mediaProductName: String
}

input AudionInput {
    id: ID
    audionName: String
    team: String
    attended: Boolean
}

type Mutation {
    createCustomer(input: CustomerInput): Customer
    createTransitAccount(input: TransitAccountInput): TransitAccount
    createProductCatalog(input: ProductCatalogInput): ProductCatalog
    createAudion(input: AudionInput): Audion
    updateAudion(id: ID, audionName: String, attended: Boolean): Audion
}


`)

export default schema;