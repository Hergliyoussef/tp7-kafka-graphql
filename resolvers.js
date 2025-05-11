const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';

const movieProtoDef = protoLoader.loadSync(movieProtoPath, { keepCase: true, defaults: true, oneofs: true });
const tvShowProtoDef = protoLoader.loadSync(tvShowProtoPath, { keepCase: true, defaults: true, oneofs: true });

const movieProto = grpc.loadPackageDefinition(movieProtoDef).movie;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDef).tvShow;

const movieClient = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
const tvShowClient = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
// ... (importe les proto et initialise les clients comme avant)

const resolvers = {
  Query: {
    movie: (_, { id }) => new Promise((resolve, reject) => {
      movieClient.getMovie({ movie_id: id }, (err, response) => {
        if (err) reject(err);
        else resolve(response.movie);
      });
    }),
    movies: () => new Promise((resolve, reject) => {
      movieClient.searchMovies({}, (err, response) => {
        if (err) reject(err);
        else resolve(response.movies);
      });
    }),
    tvShow: (_, { id }) => new Promise((resolve, reject) => {
      tvShowClient.getTvshow({ tv_show_id: id }, (err, response) => {
        if (err) reject(err);
        else resolve(response.tv_show);
      });
    }),
    tvShows: () => new Promise((resolve, reject) => {
      tvShowClient.searchTvshows({}, (err, response) => {
        if (err) reject(err);
        else resolve(response.tv_shows);
      });
    }),
  },

  Mutation: {
    createMovie: async (_, { id, title, description }, { sendMessage }) => {
      const movie = { id, title, description };
      await sendMessage('movies_topic', movie);
      return movie;
    }
  }
};

module.exports = resolvers;

