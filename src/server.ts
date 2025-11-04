import { buildApp } from './app';

// Export buildApp for testing
export { buildApp };

// Start server
const start = async () => {
  const fastify = await buildApp();

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('Listening on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

