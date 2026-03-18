console.log("JS LOADED");

async function askAI() {
  const input = document.getElementById('userInput').value;

  if (!input) {
    alert("Enter something");
    return;
  }

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    document.getElementById('response').innerText = data.reply;

  } catch (err) {
    console.error(err);
    document.getElementById('response').innerText = "Server error";
  }
}
