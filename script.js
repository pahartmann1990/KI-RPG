async function fetchState() {
  const res = await fetch('/api/state');
  const data = await res.json();
  updateScene(data.scene);
}

function updateScene(scene) {
  document.getElementById('scene-text').textContent = scene.text;
  document.getElementById('scene-image').src = scene.image;
}

document.getElementById('send-btn').addEventListener('click', async () => {
  const action = document.getElementById('action-input').value;
  const res = await fetch('/api/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  const data = await res.json();
  updateScene(data.scene);
  document.getElementById('action-input').value = '';
});

fetchState();
