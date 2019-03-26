const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
}

const db = knex(knexConfig)

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.get('/', async (req, res) => {
  try {
    const dbres = await db('zoos')
    res.status(200).json(dbres)
  } catch {
    res.status(500).json({ message: "error in retrieving items" })
  }
  
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
