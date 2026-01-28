// DOM Elements
const messageTextarea = document.getElementById('message');
const charCountElement = document.getElementById('charCount');
const wordCountElement = document.getElementById('wordCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const spamForm = document.getElementById('spamForm');

// Initialize counters
updateCounters();

// Event Listeners
if (messageTextarea) {
    messageTextarea.addEventListener('input', updateCounters);
    messageTextarea.addEventListener('input', autoResizeTextarea);
}

// Example message buttons
document.querySelectorAll('.example-btn').forEach(button => {
    button.addEventListener('click', function() {
        const message = this.getAttribute('data-message');
        messageTextarea.value = message;
        updateCounters();
        autoResizeTextarea();
        messageTextarea.focus();
        
        // Show notification
        showNotification(`Example message loaded: "${this.textContent.trim()}"`, 'info');
    });
});

// Form submission
if (spamForm) {
    spamForm.addEventListener('submit', function(e) {
        const message = messageTextarea.value.trim();
        
        if (!message) {
            e.preventDefault();
            showNotification('Please enter a message to analyze', 'error');
            return;
        }
        
        if (message.length < 10) {
            if (!confirm('Message is very short. Are you sure you want to analyze it?')) {
                e.preventDefault();
                return;
            }
        }
        
        // Show loading
        loadingSpinner.style.display = 'block';
        document.querySelector('.submit-btn').disabled = true;
    });
}

// Functions
function updateCounters() {
    if (!messageTextarea || !charCountElement || !wordCountElement) return;
    
    const text = messageTextarea.value;
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    charCountElement.textContent = charCount;
    wordCountElement.textContent = wordCount;
    
    // Update colors based on length
    if (charCount > 500) {
        charCountElement.style.color = '#e53e3e';
    } else if (charCount > 300) {
        charCountElement.style.color = '#d69e2e';
    } else {
        charCountElement.style.color = '#38a169';
    }
}

function autoResizeTextarea() {
    if (!messageTextarea) return;
    
    messageTextarea.style.height = 'auto';
    messageTextarea.style.height = (messageTextarea.scrollHeight) + 'px';
}

function copyResult() {
    const resultText = generateResultText();
    
    navigator.clipboard.writeText(resultText)
        .then(() => {
            showNotification('Result copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
}

function generateResultText() {
    const resultElement = document.querySelector('.result-title h2');
    const confidenceElement = document.querySelector('.confidence');
    const messageElement = document.querySelector('.preview-content');
    
    if (!resultElement || !confidenceElement || !messageElement) {
        return 'No result available';
    }
    
    return `SpamGuard Analysis Result:
📊 ${resultElement.textContent}
${confidenceElement.textContent}
📝 Message: ${messageElement.textContent}
🔗 Analyzed at: ${new Date().toLocaleString()}`;
}

function shareResult() {
    if (navigator.share) {
        const resultText = generateResultText();
        
        navigator.share({
            title: 'SpamGuard Analysis Result',
            text: resultText,
            url: window.location.href
        })
        .then(() => console.log('Shared successfully'))
        .catch(err => console.log('Error sharing:', err));
    } else {
        copyResult();
        showNotification('Result copied. Share manually.', 'info');
    }
}

function clearForm() {
    if (messageTextarea) {
        messageTextarea.value = '';
        updateCounters();
        autoResizeTextarea();
        messageTextarea.focus();
    }
    
    // Remove result parameters from URL
    const url = new URL(window.location);
    url.searchParams.delete('result');
    url.searchParams.delete('message');
    url.searchParams.delete('confidence');
    history.replaceState(null, '', url);
    
    // Reload page to clear results
    window.location.href = '/';
}

function clearError() {
    window.location.href = '/';
}

function testAPI() {
    const testMessage = "Congratulations! You've won a free iPhone. Click to claim: http://example.com";
    
    showNotification('Testing API...', 'info');
    
    fetch('/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: testMessage })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showNotification(`API Test Successful! Result: ${data.prediction} (${data.confidence}% confidence)`, 'success');
        } else {
            showNotification(`API Error: ${data.error || 'Unknown error'}`, 'error');
        }
    })
    .catch(error => {
        console.error('API Test Error:', error);
        showNotification('API Test Failed. Check console for details.', 'error');
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-text">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#f0fff4' : 
                     type === 'error' ? '#fff5f5' : 
                     type === 'warning' ? '#fffaf0' : '#ebf8ff'};
        color: ${type === 'success' ? '#276749' : 
                type === 'error' ? '#c53030' : 
                type === 'warning' ? '#c05621' : '#2c5282'};
        border: 2px solid ${type === 'success' ? '#68d391' : 
                         type === 'error' ? '#fc8181' : 
                         type === 'warning' ? '#f6ad55' : '#4299e1'};
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    // Add close button styles
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0 5px;
        margin-left: auto;
        color: inherit;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set probability bar widths
    document.querySelectorAll('.prob-fill').forEach(fill => {
        const width = fill.dataset.width;
        if (width) {
            fill.style.width = width + '%';
        }
    });
    
    // Add animation to result cards
    const resultCards = document.querySelectorAll('.result-card, .analysis-card');
    resultCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Focus textarea on load
    if (messageTextarea && !messageTextarea.value) {
        setTimeout(() => messageTextarea.focus(), 300);
    }
    
    // Add keyboard shortcut (Ctrl+Enter to submit)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && messageTextarea === document.activeElement) {
            if (spamForm) {
                spamForm.dispatchEvent(new Event('submit'));
                e.preventDefault();
            }
        }
    });
});

// Error handling for API calls
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred. Please try again.', 'error');
});

// Page visibility change (resume loading spinner if needed)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && loadingSpinner.style.display === 'block') {
        // Page became visible again, check if still loading
        showNotification('Page resumed. Processing your request...', 'info');
    }
});