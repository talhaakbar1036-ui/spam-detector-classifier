SpamGuard — Message Filtering System: Comprehensive Project Report
1. Executive Summary

SpamGuard is a machine learning-based message classification system designed to distinguish between spam and ham (legitimate) text messages. The project implements a full pipeline from data acquisition and preprocessing to model training, evaluation, and visualization. Using a publicly available SMS spam dataset from Kaggle, the system applies natural language processing (NLP) techniques and multiple classification algorithms to achieve high accuracy in spam detection. The project is implemented in Python with a production-ready Flask web application frontend, leveraging libraries such as scikit-learn, NLTK, pandas, matplotlib, and Flask for end-to-end analysis and deployment.
2. Dataset Overview

    Source: Kaggle — SMS Spam Collection Dataset

    Size: 5,572 messages (original), reduced to 5,157 after deduplication

    Columns:

        Category: Label (ham or spam)

        Message: Raw text content

    Class Distribution:

        Ham: 4,516 messages (87.57%)

        Spam: 641 messages (12.43%)

    License: Public domain (UCI ML Repository)

3. Objectives

    Build a robust text classification system to filter spam messages.

    Compare multiple ML algorithms for performance.

    Implement NLP preprocessing: tokenization, stopword removal, stemming.

    Perform exploratory data analysis (EDA) and visualization.

    Deploy a reproducible pipeline for future extensions.

4. Methodology
4.1 Data Preprocessing

    Renamed columns for clarity (Category → label, Message → text).

    Encoded labels: ham → 0, spam → 1.

    Removed duplicates (reduced dataset to 5,157 samples).

    Text cleaning pipeline:

        Lowercasing

        Removal of special characters and digits

        Tokenization using NLTK

        Stopword removal (English)

        Porter stemming

        Rejoining tokens into clean text

4.2 Feature Engineering

    Used TF-IDF Vectorization to convert text into numerical features.

    Set max_features=5000 to limit vocabulary size and reduce dimensionality.

4.3 Model Training & Evaluation

    Train-Test Split: 80% training, 20% testing.

    Models Implemented:

        Multinomial Naïve Bayes (Baseline)

        Logistic Regression

        Support Vector Machine (SVC)

    Evaluation Metrics:

        Accuracy

        Precision, Recall, F1-Score

        Confusion Matrix

        Classification Report

5. Exploratory Data Analysis (EDA)
5.1 Class Distribution

    Dataset is imbalanced (12.43% spam).

    Visualized using count plots.

5.2 Message Length Analysis

    Spam messages tend to be longer (mean length ~150 characters).

    Ham messages are shorter (mean length ~80 characters).

    Visualized using histograms and box plots.

5.3 Word Cloud Visualization

    Ham Word Cloud: Common words: call, get, ok, know, love, sorry, home

    Spam Word Cloud: Common words: free, txt, win, claim, prize, urgent, mobile, cash

6. Model Performance Comparison
Model	Accuracy	Precision (Spam)	Recall (Spam)	F1-Score (Spam)
Multinomial Naïve Bayes	97.2%	0.95	0.89	0.92
Logistic Regression	98.1%	0.96	0.93	0.94
Support Vector Machine	98.3%	0.97	0.94	0.95

Key Insights:

    SVM performed best across all metrics.

    Logistic Regression also showed strong performance with faster training time.

    Naïve Bayes served as a good baseline but lagged slightly in recall.
    ## Model Accuracy
    ![Model Accuracy](./images/https://github.com/talhaakbar1036-ui/spam-detector-classifier/blob/main/images/accuracy.png)

    ## Confusion Matrix
    ![Confusion Matrix](./images/https://github.com/talhaakbar1036-ui/spam-detector-classifier/blob/main/images/confusion matrix.png)


7. Key Challenges & Solutions
Challenge	Solution
Class Imbalance	Used stratified sampling in train-test split.
Text Noise (special chars, digits)	Applied regex-based cleaning and stemming.
High Dimensionality	Limited TF-IDF features to 5000.
Model Comparison	Implemented multiple classifiers and compared metrics.
8. Tools & Technologies Used

    Python 3.x

    Backend & Framework:

        Flask 2.3.3 (web framework)

        Gunicorn 20.1.0 (WSGI server)

    Machine Learning & Data Processing:

        scikit-learn 1.3.0 (ML models, metrics, vectorization)

        pandas 2.0.3, numpy 1.24.3 (data handling)

        NLTK (text preprocessing)

        joblib 1.3.1 (model serialization)

    Visualization:

        matplotlib, seaborn, wordcloud (visualization)

    Frontend:

        HTML5, CSS3, JavaScript (responsive web interface)

        Font Awesome icons (UI elements)

    Environment: Jupyter Notebook for analysis / Flask for deployment

    Version Control: Git (optional but recommended)

eatures

### Current Implementation
- ✅ Web-based user interface for spam detection
- ✅ REST API endpoint for programmatic access
- ✅ Pre-trained Naïve Bayes model with 97.2% accuracy
- ✅ Real-time predictions with confidence scores
- ✅ Text preprocessing pipeline (stemming, stopword removal, etc.)
- ✅ Probability distribution visualization
- ✅ Character and word count tracking
- ✅ Mobile-responsive design

### Future Enhancements

- Handle class imbalance with SMOTE or class weighting.
- Experiment with deep learning (LSTM, Transformers).
- Deploy using containerization (Docker, Kubernetes).
- Extend to multilingual spam detection.
- Integrate real-time messaging platforms (e.g., email, WhatsApp).
- Add database for message history logging.
- Implement user authentication and analytics dashboard
│   ├── style.css            # Styling
│   └── script.js            # Frontend logic
├── model_artifacts/          # Pre-trained models
│   ├── naive_bayes_model.joblib      # Trained classifier
│   └── tfidf_vectorizer.joblib       # TF-IDF vectorizer
└── images/                   # Visualizations (word clouds, plots)
```
    Extend to multilingual spam detection.

    Integrate real-time messaging platforms (e.g., email, WhatsApp).

10. Conclusion

The SpamGuard project successfully demonstrates a complete NLP-based classification pipeline with production deployment. The system achieves 97.2% accuracy using a Naïve Bayes classifier, effectively distinguishing spam from legitimate messages. Beyond the analysis phase, the project has been deployed as a fully functional Flask web application with an intuitive user interface and REST API endpoints for seamless integration. The code is modular, well-documented, and ready for extension or deployment in real-world scenarios.
11. Repository Structure
text
### Option 1: Web Application (Recommended)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask application:**
   ```bash
   python app.py
   ```

3. **Access the web interface:**
   - Open your browser and navigate to `http://localhost:5000`
   - Enter a message to get instant spam prediction
   - View confidence scores and probability distribution

### Option 2: Jupyter Notebook (Analysis & Training)

1. **Install dependencies:**
   ```bash
   pip install pandas numpy matplotlib seaborn wordcloud nltk scikit-learn jupyter
   ```

2. **Download NLTK data:**
   ```python
   import nltk
   nltk.download('punkt')
   nltk.download('stopwords')
   nltk.download('punkt_tab')
   ```

3. **Run the Jupyter notebook:**
   ```bash
   jupyter notebook SpamGuard_(3).ipynb
   ```

### Option 3: API Usage (JSON)

Send a POST request to the API endpoint:

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"message": "Congratulations! You won 1 million!"}'
```

**Response:**
```json
{
  "message": "Congratulations! You won 1 million!",
  "prediction": "spam",
  "confidence": 98.5,
  "spam_probability": 98.5,
  "ham_probability": 1.5,
  "status": "success"
}
```

## Feedback

This project is still open to improvement.
Suggestions and constructive feedback are very welcome.  
Feel free to open an issue or submit a pull request.

nltk.download('stopwords')

    Run the Jupyter notebook SpamGuard_(3).ipynb.

## 13. Feedback & Contributing

This project is still open to improvement.
Suggestions and constructive feedback are very welcome.  
Feel free to open an issue or submit a pull request.
