const app = require('express');
const router = app.Router();
import rootSchema from '../schema';
import {graphql} from 'graphql'
const query = (q, vars) => {
    return graphql(rootSchema, q, null, null, vars)
}

// Transform response to JSON API format
// (if desired)
const transform = (result) => {
    const user = result.data.users[0];
    return {
        data: {
            id: user.id,
            name: user.name,
            type: user.type            
        }
    }
}
// REST request to get a user https://www.cloudbees.com/blog/graphql-as-an-api-gateway-to-micro-services
router.get('/customer/get/:id', (req, res) => {
    // Convert the request into a GraphQL query string
    query("query{getCustomer(id:" + req.params.id + "){id, name}}")
        .then(result => {
            const transformed = transform(result)
            res.send(transformed)
        })
        .catch(err => {
            res.sendStatus(500)
        })
})
module.exports = router;