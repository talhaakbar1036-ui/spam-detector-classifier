
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

# Download NLTK data (if not already downloaded)
try:
    nltk.data.find('tokenizers/punkt')
except nltk.downloader.DownloadError:
    nltk.download('punkt', quiet=True)
try:
    nltk.data.find('corpora/stopwords')
except nltk.downloader.DownloadError:
    nltk.download('stopwords', quiet=True)
try:
    nltk.data.find('tokenizers/punkt_tab')
except nltk.downloader.DownloadError:
    nltk.download('punkt_tab', quiet=True)

def preprocess_text(text):
    """
    Cleans and preprocesses the input text for spam detection.
    Steps include: lowercasing, removing special characters/digits, 
    removing extra whitespace, tokenization, stopword removal, and stemming.
    """
    # Convert the text to lowercase
    text = text.lower()

    # Remove all the special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)

    # Remove extra white space
    text = re.sub(r'\s+', ' ', text).strip()

    # Tokenize
    tokens = word_tokenize(text)

    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]

    # Apply stemming
    stemmer = PorterStemmer()
    tokens = [stemmer.stem(word) for word in tokens]

    # Join tokens back to string
    return ' '.join(tokens)
