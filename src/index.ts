import { Server } from './server';

const server = new Server();

server.start().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
