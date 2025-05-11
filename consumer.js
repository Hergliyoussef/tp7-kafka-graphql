const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'movies_topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log('📥 Reçu :', message.value.toString());
    },
  });
};

run().catch(console.error);
