from flask import Flask, render_template, request, jsonify, send_from_directory
import joblib
import os

app = Flask(__name__, 
            static_folder='frontend',
            template_folder='frontend')

# Load models
try:
    model = joblib.load('model_artifacts/naive_bayes_model.joblib')
    vectorizer = joblib.load('model_artifacts/tfidf_vectorizer.joblib')
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    model = None
    vectorizer = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return '', 204  # No content response for favicon

@app.route('/predict', methods=['POST'])
def predict():
    try:
        message = request.form.get('message', '')
        
        if not message or not message.strip():
            return render_template('index.html', 
                                 error="Please enter a message")
        
        if model is None or vectorizer is None:
            return render_template('index.html',
                                 error="Model not loaded. Please contact admin.")
        
        # Transform and predict
        text_vec = vectorizer.transform([message])
        prediction = model.predict(text_vec)[0]
        probability = model.predict_proba(text_vec)[0]
        
        # Prepare result
        result_label = "Spam 🚫" if prediction == 1 else "Not Spam ✅"
        confidence = max(probability) * 100
        spam_prob = probability[1] * 100 if len(probability) > 1 else 0
        ham_prob = probability[0] * 100 if len(probability) > 0 else 0
        
        return render_template('index.html',
                             message=message,
                             result=result_label,
                             confidence=round(confidence, 2),
                             spam_prob=round(spam_prob, 2),
                             ham_prob=round(ham_prob, 2),
                             is_spam=bool(prediction == 1))
    except Exception as e:
        return render_template('index.html',
                             error=f"Error: {str(e)}")

@app.route('/api/predict', methods=['POST'])
def api_predict():
    """API endpoint for JSON response"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        text_vec = vectorizer.transform([message])
        prediction = model.predict(text_vec)[0]
        probability = model.predict_proba(text_vec)[0]
        
        return jsonify({
            'message': message[:500],
            'prediction': 'spam' if prediction == 1 else 'ham',
            'confidence': float(max(probability) * 100),
            'spam_probability': float(probability[1] * 100) if len(probability) > 1 else 0,
            'ham_probability': float(probability[0] * 100) if len(probability) > 0 else 0,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('frontend', filename)

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 SpamGuard Flask Application")
    print("="*50)
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"📁 Template folder: {app.template_folder}")
    print(f"📁 Static folder: {app.static_folder}")
    print("\n🌐 Available URLs:")
    print(f"   • Local: http://localhost:5000")
    print(f"   • Network: http://192.168.43.88:5000")
    print(f"   • API: http://localhost:5000/api/predict")
    print("\n✅ Server starting...")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)