const pgPromise = require('pg-promise');

const connStr = 'postgresql://postgres:postgres@localhost:5432/dev7'; // Backoffice Postgres Database

const pgp = pgPromise({}); // empty pgPromise instance
const psql = pgp(connStr); // get connection to your db instance

exports.psql = psql;