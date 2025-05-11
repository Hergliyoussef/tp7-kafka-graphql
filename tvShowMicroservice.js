const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const tvShowProtoPath = 'tvShow.proto';
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

const tvShowService = {
  getTvshow: (call, callback) => {
    const tv_show = {
      id: call.request.tv_show_id,
      title: 'Série Démo',
      description: 'Ceci est une série test.',
    };
    callback(null, { tv_show });
  },
  searchTvshows: (call, callback) => {
    const tv_shows = [
      { id: '1', title: 'Série 1', description: 'Première série' },
      { id: '2', title: 'Série 2', description: 'Deuxième série' },
    ];
    callback(null, { tv_shows });
  },
};

const server = new grpc.Server();
server.addService(tvShowProto.TVShowService.service, tvShowService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) return console.error(err);
  console.log(`✅ Serveur gRPC tvShow sur port ${port}`);
  server.start();
});
