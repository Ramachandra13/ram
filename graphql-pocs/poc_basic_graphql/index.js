import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import resolvers from './resolvers'

const app = express();

const users = require('./src/user');

// app.use('/users', users);

app.get('/', (req, res) => {
res.send('Graphql is Running..')	
});

const root = resolvers;

app.use('/pocgraphqlebasic', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
    }
));

app.listen(9080, () => console.log('GraphQL server is running on port: 9080'));