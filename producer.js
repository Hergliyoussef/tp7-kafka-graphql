const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'movies_topic',
    messages: [{ value: JSON.stringify({ id: '1', title: 'Test', description: 'Film test Kafka' }) }],
  });
  console.log('✅ Message envoyé');
  await producer.disconnect();
};

run().catch(console.error);
