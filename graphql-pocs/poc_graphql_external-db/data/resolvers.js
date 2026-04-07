import { Customer } from './dbConnectors';

const psql = require('./psqlAdapter').psql; // from psqlAdapter.js

const resolvers = {

    getContactsFromPSQLCMC_DB: async()=>{
        const fetchContatcsQuery = 'SELECT * FROM CMS_MAIN.CONTACT';
        const resContacts = await psql.manyOrNone(fetchContatcsQuery);
        console.log(resContacts);       
        return resContacts;
    },

    getContactStatusFromPSQLCMC_DB: async()=>{
        const fetchContStatuses = 'select contact_status_id, contact_status_enum, short_desc, description from cms_main.contact_status';
        const contStatuses = await psql.manyOrNone(fetchContStatuses);
        console.log(contStatuses);       
        return contStatuses;
    },  

    getCustomer: ({ id }) => {        
        return Customer.findById({ _id: id})             
        
    },

    getAllCustomers: async ()=> {
        return await Customer.find()
    },

    getCustomerByStatus: ({input}) =>{
        return Customer.where({"status": input})
    },
    
    getCustomersWithPagination: async({limit, offset}) =>{
        console.log(" Limit : "+limit);
        console.log(" offset : "+offset);
        return (await Customer.find().limit(parseInt(limit)).skip(parseInt(offset)))
    },

    createCustomer: async ({ input }) => {
        const newCust = new Customer({
            name: input.name,
            type: input.type,
            status: input.status,            
        });
        
        await newCust.save();
        return newCust;    
       
    } ,
    
    updateCustomer: async ( {id, input }) =>{
              
        console.log(" id :: "+id)        
         return await Customer.findByIdAndUpdate(id, input, {new: true})
    }
};

export default resolvers;