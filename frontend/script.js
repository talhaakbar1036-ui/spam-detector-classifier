async function predictSpam() {
    const messageInput = document.getElementById('message-input').value;
    const responseArea = document.getElementById('response-area');

    if (!messageInput.trim()) {
        responseArea.innerText = 'Please enter a message.';
        return;
    }

    try {
        responseArea.innerText = 'Predicting...';
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageInput })
        });

        const data = await response.json();

        if (response.ok) {
            responseArea.innerHTML = `
                <b>Prediction:</b> ${data.prediction}<br>
                <b>Spam Probability:</b> ${(data.spam_probability * 100).toFixed(2)}%<br>
                <b>Ham Probability:</b> ${(data.ham_probability * 100).toFixed(2)}%<br>
                <b>Cleaned Message:</b> ${data.cleaned_message}
            `;
        } else {
            responseArea.innerText = `Error: ${data.error || 'Something went wrong.'}`;
        }
    } catch (error) {
        console.error('Error during prediction:', error);
        responseArea.innerText = 'An error occurred while connecting to the server.';
    }
}