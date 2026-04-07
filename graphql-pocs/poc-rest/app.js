const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt  = require("express-jwt");
var jwksRsa = require('jwks-rsa');

const app = express();

const {startDatabase} = require('./src/database/mongo');
const {insertAd, getAds} = require('./src/database/ads');


// defining an array to work as the database (temporary solution)
const ads = [
    {title: 'Hello, world (again)!'}
  ];
  
  // adding Helmet to enhance your API's security
  app.use(helmet());
  
  // using bodyParser to parse JSON bodies into JS objects
  app.use(bodyParser.json());
  
  // enabling CORS for all requests
  app.use(cors());
  
  // adding morgan to log HTTP requests
  app.use(morgan('combined'));

// defining an endpoint to return all ads
// app.get('/', (req, res) => {
//    res.send(ads);
// });

app.get('/', async (req, res) => {
  console.log("inside ads ....");
    res.send(await getAds());
  });

app.get('/umbapps', (req, res) => {
    // res.send('Hello, World!');
    const UMBApps = ["Retail", "B2B", "Traveler", "Inspcetion",  "Third party app"];       
    res.send(UMBApps.toString);
  });

  app.get('/posts', (req, res) => {
    console.log("Inside posts ....")
    const posts = [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
      { id: 3, title: 'Post 3' }
    ];
    res.json(posts);
  });

  const {deleteAd, updateAd} = require('./src/database/ads');

  const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://dev-pbjqc3p01v0614fs.us.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: 'https://ram-ads-api',
    issuerBaseURL: 'https://dev-pbjqc3p01v0614fs.us.auth0.com/',
    tokenSigningAlg: 'RS256'
  });

  // app.use(checkJwt);

// ... app definition, middleware configuration, and 

app.post('/post', async (req, res) => {
  const newAd = req.body;
  const insertedId = await insertAd(newAd);
  res.send({ message: 'New ad inserted.::'+insertedId });
});

// endpoint to delete an ad
app.delete('/:id', async (req, res) => {
  await deleteAd(req.params.id);
  res.send({ message: 'Ad removed.' });
});

// endpoint to update an ad
app.put('/:id', async (req, res) => {
  const updatedAd = req.body;
  await updateAd(req.params.id, updatedAd);
  res.send({ message: 'Ad updated.' });
});

  // start the in-memory MongoDB instance
    startDatabase().then(async () => {
        await insertAd({title: 'Hello, now from the in-memory database!'});
    

  const port = process.env.PORT || 3000;
    app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
    });
});