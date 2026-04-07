import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './data/schema';
import resolvers from './data/resolvers';

const app = express();

app.get('/', (req, res) => {
res.send('Graphql is Running..')	
});

const root = resolvers;

app.use('/pocgraphqlextdb', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
    }
));

app.listen(9081, () => console.log('GraphQL server is running on port: 9081'));