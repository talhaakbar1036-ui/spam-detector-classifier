
import os
import joblib
from flask import Flask, request, jsonify
from utils import preprocess_text  # Import from utils.py

# Define the directory where models are stored
MODEL_ARTIFACTS_DIR = 'model_artifacts'

# Construct full paths to the model and vectorizer files
model_path = os.path.join(MODEL_ARTIFACTS_DIR, 'naive_bayes_model.joblib')
vectorizer_path = os.path.join(MODEL_ARTIFACTS_DIR, 'tfidf_vectorizer.joblib')

# Load the trained model and TF-IDF vectorizer
try:
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
except FileNotFoundError:
    print(f"Error: Model or vectorizer files not found in {MODEL_ARTIFACTS_DIR}.")
    print("Please ensure 'naive_bayes_model.joblib' and 'tfidf_vectorizer.joblib' exist.")
    model = None
    vectorizer = None

# Initialize Flask application
app = Flask(__name__)

# Define root route
@app.route('/')
def home():
    return 'SpamGuard API is running!'

# Define prediction route
@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    message = data.get('message')

    if not message:
        return jsonify({"error": "'message' field is required"}), 400

    if model is None or vectorizer is None:
        return jsonify({"error": "Model or vectorizer not loaded. Check server logs."}), 500

    # Preprocess the message
    cleaned_message = preprocess_text(message)

    # Transform the message using the TF-IDF vectorizer
    message_tfidf = vectorizer.transform([cleaned_message])

    # Make prediction
    prediction = model.predict(message_tfidf)[0]
    probabilities = model.predict_proba(message_tfidf)[0]

    # Determine the label and probabilities
    predicted_label = "SPAM" if prediction == 1 else "HAM"
    spam_probability = float(probabilities[1])
    ham_probability = float(probabilities[0])

    return jsonify({
        "original_message": message,
        "cleaned_message": cleaned_message,
        "prediction": predicted_label,
        "spam_probability": spam_probability,
        "ham_probability": ham_probability
    })

if __name__ == '__main__':
    # For development, run with debug=True
    # For production, use a production-ready WSGI server like Gunicorn
    app.run(debug=True, host='0.0.0.0', port=5000)
