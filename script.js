async function sendAction() {
  const input = document.getElementById('action');
  const action = input.value.trim();
  const res = await fetch('/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  const data = await res.json();
  if (data.error) {
    alert(data.error);
    return;
  }
  document.getElementById('story').textContent = data.text;
  const imgDiv = document.getElementById('images');
  imgDiv.innerHTML = '';
  data.images.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.width = 200;
    imgDiv.appendChild(img);
  });
  input.value = '';
}

document.getElementById('send').addEventListener('click', sendAction);
window.addEventListener('load', () => {
  sendAction();
});
