const test = require('node:test');
const assert = require('node:assert');
const { generateScene, characters } = require('./server');

test('generateScene returns expected structure', () => {
  const scene = generateScene('look around');
  assert.ok(scene.text.includes('Scene'));
  assert.strictEqual(Array.isArray(scene.images), true);
  assert.strictEqual(scene.sceneCard.characters.length, characters.length);
});
