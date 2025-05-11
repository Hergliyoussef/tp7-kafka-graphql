const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const path = require('path');
const { Kafka } = require('kafkajs');

// Chargement de movie.proto
const movieProtoPath = 'movie.proto';
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

// Service gRPC
const movieService = {
  getMovie: (call, callback) => {
    const movie = {
      id: call.request.movie_id,
      title: 'Exemple de film',
      description: 'Ceci est un exemple de film.',
    };
    callback(null, { movie });
  },
  searchMovies: (call, callback) => {
    const movies = [
      { id: '1', title: 'Film 1', description: 'Premier film' },
      { id: '2', title: 'Film 2', description: 'Deuxième film' },
    ];
    callback(null, { movies });
  },
};

const server = new grpc.Server();
server.addService(movieProto.MovieService.service, movieService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err);
  console.log(`✅ Serveur gRPC movie sur port ${port}`);
  server.start();
});

// Kafka Consumer
const kafka = new Kafka({ clientId: 'movie-consumer', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'movie-group' });
const filmsFile = path.join(__dirname, 'film.json');

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'movies_topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const film = JSON.parse(message.value.toString());
        console.log('🎥 Nouveau film reçu :', film);
        let films = fs.existsSync(filmsFile)
          ? JSON.parse(fs.readFileSync(filmsFile, 'utf8'))
          : [];
        films.push(film);
        fs.writeFileSync(filmsFile, JSON.stringify(films, null, 2));
        console.log('✅ Film enregistré dans film.json');
      } catch (err) {
        console.error('❌ Erreur Kafka :', err.message);
      }
    },
  });
};

consumeMessages();
