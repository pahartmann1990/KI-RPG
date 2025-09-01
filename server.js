const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Simple in-memory game state
let sceneId = 0;

// Character sheets keep consistency across scenes
const characters = [
  { id: 1, name: 'Laura', tags: ['red hair', 'blue eyes'], portrait_url: '' },
  { id: 2, name: 'Alex', tags: ['black jacket', 'glasses'], portrait_url: '' },
  { id: 3, name: 'Tim', tags: ['green hat', 'freckles'], portrait_url: '' }
];

// Basic content filter
const banned = ['kill', 'blood', 'gore'];

function generateScene(action) {
  sceneId += 1;

  const time = new Date().toISOString();
  const text = `Scene ${sceneId}: ${action || 'The adventure begins.'}`;

  const sceneCard = {
    id: sceneId,
    time,
    location: 'unknown',
    mood: 'neutral',
    camera: 'wide shot',
    objects: [],
    characters: characters.map(c => ({ name: c.name, look: c.tags.join(', ') }))
  };

  const images = [
    `https://placehold.co/400x300?text=Scene+${sceneId}`
  ];

  return { id: sceneId, text, sceneCard, images };
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  if (req.method === 'POST' && parsed.pathname === '/action') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { action } = JSON.parse(body || '{}');
        if (action && banned.some(b => action.includes(b))) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Content not allowed' }));
          return;
        }
        const scene = generateScene(action);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(scene));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
  } else if (req.method === 'GET' && parsed.pathname === '/') {
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
  } else if (req.method === 'GET' && parsed.pathname === '/script.js') {
    fs.createReadStream(path.join(__dirname, 'script.js')).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = { server, generateScene, characters };
