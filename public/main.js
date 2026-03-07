document.getElementById('testBtn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/test');
        const data = await res.json();
        document.getElementById('apiResponse').innerText = data.message;
    } catch (err) {
        console.error(err);
        document.getElementById('apiResponse').innerText = 'Error connecting to API';
    }
});
