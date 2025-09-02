const Fastify = require('fastify');
const fs = require('fs');
const path = require('path');

const app = Fastify({ logger: true });
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
let state = { sceneIndex: 0 };

app.get('/api/state', async (req, reply) => {
  const scene = data.scenes[state.sceneIndex];
  reply.send({ scene, characters: data.characters });
});

app.post('/api/action', async (req, reply) => {
  const { action } = req.body;
  // Platzhalter: Aktion wird ignoriert und zur nächsten Szene gewechselt
  if (state.sceneIndex < data.scenes.length - 1) {
    state.sceneIndex++;
  }
  const scene = data.scenes[state.sceneIndex];
  reply.send({ scene });
});

app.listen({ port: 3000, host: '0.0.0.0' }, err => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info('Server läuft auf http://localhost:3000');
});
