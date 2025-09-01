# Image RPG Demo

This is a minimal proof-of-concept for a text driven RPG that returns a scene card and placeholder images for each action.

## Running

```bash
node server.js
```

Open `index.html` in a browser and enter actions to progress the story. Each request returns:

- **text**: narrative description.
- **sceneCard**: structured info about the scene.
- **images**: placeholder URLs representing generated images.

The server includes a simple content filter blocking certain words.

## Testing

```bash
node --test
```
