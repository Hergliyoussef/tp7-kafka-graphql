const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { Kafka } = require('kafkajs');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Kafka - connection unique
  const kafka = new Kafka({ clientId: 'api-gateway', brokers: ['localhost:9092'] });
  const producer = kafka.producer();
  await producer.connect(); // ✅ Connecté une seule fois

  const sendMessage = async (topic, message) => {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  };

  // GraphQL Server
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use('/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => ({ sendMessage }),
    })
  );

  app.get('/', (req, res) => res.send('🎬 API Gateway is running'));

  app.post('/movies', async (req, res) => {
    try {
      await sendMessage('movies_topic', req.body);
      res.status(200).json({ message: 'Film publié via Kafka', data: req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(3000, () => {
    console.log('🚀 API Gateway sur http://localhost:3000');
    console.log('📡 GraphQL sur http://localhost:3000/graphql');
  });
}

startServer();
