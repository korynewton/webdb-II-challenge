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
server.get('/api/zoos/', async (req, res) => {
  try {
    const zoos = await db('zoos')
    res.status(200).json(zoos)
  } catch {
    res.status(500).json({ message: "error in retrieving items" })
  }
})

server.get('/api/zoos/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const zoo = await db('zoos').where({ id }).first()
    if (zoo) {
      res.status(200).json(zoo)
    }
    else {
      res.status(404).json({ message: "That zoo does not exist in the database" })
    }
  } catch {
    res.status(500).json({ message: "error in retrieving zoos" })
  }
})

server.post('/api/zoos/', async (req, res) => {
  try {
    const [id] = await db('zoos').insert(req.body)

    const zoo = await db('zoos')
      .where({ id })
      .first()

      res.status(200).json(zoo)
  } catch {
    res.status(500).json({ error: "error in adding to database" })
  }
})

server.put('/api/zoos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const edits = await db('zoos').where({ id }).update(req.body)
    if (edits) {
      const updated = await db('zoos').where({ id }).first()
      res.status(200).json(updated)
    } else {
      res.status(400).json({ message: 'item could not be found' })
    }
  } catch {
    res.status(500).json({ message: "error in updating item" })
  }
})

server.delete('/api/zoos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('zoos').where({ id }).delete()
    if (deleted) {
        res.status(200).json({ message: "item successfully deleted" })
    } else {
      res.status(400).json({ message: 'item could not be found' })
    }
  } catch {
    res.status(500).json({ message: "error in deleting item" })
  }
})


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
