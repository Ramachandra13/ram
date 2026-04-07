import { type } from 'os';
const app = require('express');
const router = app.Router();

const query = (q, vars) => {
    return graphql(rootSchema, q, null, null, vars)
}

class Audion {
    constructor(id, {audionName, team, attended}){
        this.id = id;
        this.audionName = audionName;
        this.team = team;
        this.attended = attended;
    }
}

class Customer {
    constructor(id, {name, type, status, locations, region, orders}){
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;        
        this.locations = locations;
        this.region = region;
        this.orders = orders;
    }   

}

class TransitAccount{
    constructor(id, {riderClassId, accountStatus, grantToken, productCatalog}){
        this.id = id  
        this.riderClassId = riderClassId
        this.accountStatus = accountStatus
        this.grantToken = grantToken    
        this.productCatalog = productCatalog        
    }    
}

class ProductCatalog{
    constructor(riderClassId, {productName, mediaProductName}){
        this.riderClassId = riderClassId
        this.productName = productName
        this.mediaProductName = mediaProductName
    }
}

const customerDatabase = {};

const transitAccountDatabase = {};

const productCatalogDatabase = {};

const audionDatabase = {};

let allCustomers = [
    {name: "Cust 1", id: "100", region: "Reg 1"},
    {name: "Cust 2", id: "102", region: "Reg 1"},
    {name: "Cust 3", id: "103", region: "Reg 1"},
    {name: "Cust 4", id: "104", region: "Reg 2"},
    {name: "Cust 5", id: "105", region: "Reg 2"}

]
const getBooksURL = 'http://localhost:4000?books';
const allCustomersURL = 'http://localhost:9081/pocgraphqlextdb?operationName=getAllCustomers&query=query%20getCust%7B%0A%20%20getCustomer(id%3A%20%22645281ec90a7b5c6a8cb255c%22)%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%7D%0A%7D%0A%0Aquery%20getAllCustomers%7B%0A%20%20getAllCustomers%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%20%20%20%0A%20%20%20%20region%20%20%20%20%0A%20%20%7D%0A%7D%0A%0A%20query%20byLabled%7B%0A%20%20ActiveCustomers%3A%20getCustomerByStatus(input%3A%20%22Active%22)%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%20%20id%0A%20%20%7D%0A%20%20%20%20%0A%20%20%20%20PendingCustomers%3A%20getCustomerByStatus(input%3A%20%22Pending%22)%7B%0A%20%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%0A%20%20SuspendedCustomers%3A%20getCustomerByStatus(input%3A%20%22Suspend%22)%7B%0A%20%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%7D%0A%0Aquery%20getCustomerWithPagination%7B%0A%20%20getCustomersWithPagination(limit%3A%203%2C%20offset%3A%203)%7B%0A%20%20%20%20name%20%20%20%20%0A%20%20%20%20id%0A%20%20%7D%0A%7D%0A%0A%0Amutation%20createCustomer%20%7B%0A%20%20createCustomer%20(input%3A%20%7B%0A%20%20%20%20name%3A%20%22Ram%20Chand%22%2C%0A%20%20%20%20type%3A%20%22TCS%22%2C%0A%20%20%09status%3A%20%22Suspend%22%20%20%0A%20%20%20%20%0A%20%20%7D)%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%7D%0A%7D%0A%0Amutation%20updateCustomer%20%7B%0A%20%20updateCustomer(id%3A%20%22645281ec90a7b5c6a8cb255c%22%2C%20input%3A%20%7B%0A%20%20%20%20name%3A%20%22Suresh%22%0A%20%20%20%20type%3A%20%22TB2%22%0A%20%20%20%20status%3A%20%22Pending%22%0A%20%20%7D)%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%7D%0A%7D'; 
const getUmbAppsURL = 'http://localhost:3000';
const getCustomerViaGraphQLURL = 'http://localhost:9081/pocgraphqlextdb?operationName=getCust&query=query%20getCust%7B%0A%20%20getCustomer(id%3A%20%22645281ec90a7b5c6a8cb255c%22)%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%7D%0A%7D%0A%0Aquery%20getAllCustomers%7B%0A%20%20getAllCustomers%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%20%20%20%0A%20%20%20%20region%20%20%20%20%0A%20%20%7D%0A%7D%0A%0A%20query%20byLabled%7B%0A%20%20ActiveCustomers%3A%20getCustomerByStatus(input%3A%20%22Active%22)%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%20%20id%0A%20%20%7D%0A%20%20%20%20%0A%20%20%20%20PendingCustomers%3A%20getCustomerByStatus(input%3A%20%22Pending%22)%7B%0A%20%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%0A%20%20SuspendedCustomers%3A%20getCustomerByStatus(input%3A%20%22Suspend%22)%7B%0A%20%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%7D%0A%0Aquery%20getCustomerWithPagination%7B%0A%20%20getCustomersWithPagination(limit%3A%203%2C%20offset%3A%203)%7B%0A%20%20%20%20name%20%20%20%20%0A%20%20%20%20id%0A%20%20%7D%0A%7D%0A%0A%0Amutation%20createCustomer%20%7B%0A%20%20createCustomer%20(input%3A%20%7B%0A%20%20%20%20name%3A%20%22Ram%20Chand%22%2C%0A%20%20%20%20type%3A%20%22TCS%22%2C%0A%20%20%09status%3A%20%22Suspend%22%20%20%0A%20%20%20%20%0A%20%20%7D)%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%7D%0A%7D%0A%0Amutation%20updateCustomer%20%7B%0A%20%20updateCustomer(id%3A%20%22645281ec90a7b5c6a8cb255c%22%2C%20input%3A%20%7B%0A%20%20%20%20name%3A%20%22Suresh%22%0A%20%20%20%20type%3A%20%22TB2%22%0A%20%20%20%20status%3A%20%22Pending%22%0A%20%20%7D)%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20type%0A%20%20%20%20status%0A%20%20%7D%0A%7D';
const getUsersFromRestURL= 'http://localhost:9000/users';

const headers = {
	"content-type": "application/json"
    // "Authorization": "<token>"
};

const graphQLGetBooksQuery = {
    "operationName": "GetBooks",
    "query": `query GetBooks { books {title, author} }`,
    "variables": {}
}

const optionsGraphQLGetBooksQuery = {
    "method": "POST",
    "headers": headers,
    "body": JSON.stringify(graphQLGetBooksQuery)
};

 router.get('/allcustomers', (req, res) => {
    console.log("................");
    // Convert the request into a GraphQL query string
    // fetch(allCustomersURL, {
    //     method: 'GET'        
    //   })
    //   .then(res => res.json())
    //   .then(res => console.log(res.data))
    //   .then(err => console.log(err));
    // })
    // const response = fetch(getCustomerViaGraphQLURL, graphQLGetCustomerByIdQuery);
    // const data = response.json();
    // console.log(data.data); // data
    // console.log(data.errors); // errors            
});
// module.exports = router;

const resolvers = {

    getCustomer: ({ id }) => {
        return new Customer(id, customerDatabase[id]);
    },
    getAllCustomersOLD: () => {        
        return allCustomers;        
    },

    getAllCustomers: () =>{        
        fetch(allCustomersURL, {
          method: 'GET'        
        })
        .then(res => res.json())
        .then(res => console.log(res.data))
        .then(err => console.log(err));
      },

      getBooks: async () => {
        const response = await fetch(getBooksURL, optionsGraphQLGetBooksQuery);
        const data = await response.json();
        console.log(data.data); // data
        // console.log(data.errors); // errors
      },

      getUsersFromRest: () =>{        
        console.log("Inside get umb apps...");
        fetch(getUsersFromRestURL, {
          method: 'GET'                  
        })        
        .then(res => res.json())
        .then(res => console.log(res));        
        console.log("Inside get users from Rest..outsie.");
      },

        getTransitAccountDetails:( { id}) => {        
            return new TransitAccount(id, transitAccountDatabase[id]);
        },

    getProductCatalog:({riderClassId}) =>{
        return new ProductCatalog(riderClassId, productCatalogDatabase[riderClassId]);

    },    
    createCustomer: ({ input }) => {
        let id = require('crypto').randomBytes(10).toString('hex');
        customerDatabase[id] = input;        
        return new Customer(id, input);
    },

    getAudion:({ id }) => {
        return new Audion(id, audionDatabase[id]);
    },

    getAllAudions: () =>{
        return [audionDatabase];
    },

    createTransitAccount: ({ input}) => {
        let id = require('crypto').randomBytes(10).toString('hex');
        transitAccountDatabase[id] = input;
        return new TransitAccount(id, input);
    },

    createProductCatalog: ({ input}) => {
        let riderClassId = "Fullfare"; //require('crypto').randomBytes(10).toString('hex');
        productCatalogDatabase[riderClassId] = input;
        return new ProductCatalog(riderClassId, input);
    },

    createAudion: ({ input}) => {
        let id = require('crypto').randomBytes(10).toString('hex');
        audionDatabase[id] = input;
        return new Audion(id, input);
    },

    updateAudion: ({ id, audionName, attended })=>{
        const aud = audionDatabase[id];
        aud.audionName = audionName;
        aud.attended = attended;
        aud.id = id;
        return aud;
        

    }    
};
export default resolvers;
