import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_root_endpoint(client):
    '''Test the root endpoint /'''
    response = client.get('/')
    assert response.status_code == 200
    assert b'SpamGuard API is running!' in response.data

def test_predict_endpoint_ham_message(client):
    '''Test /predict endpoint with a valid ham message'''
    message = "Hey, let's meet for coffee tomorrow."
    response = client.post('/predict',
                           data=json.dumps({'message': message}),
                           content_type='application/json')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['prediction'] == 'HAM'
    assert 'spam_probability' in data
    assert 'ham_probability' in data
    assert data['ham_probability'] > data['spam_probability']

def test_predict_endpoint_spam_message(client):
    '''Test /predict endpoint with a valid spam message'''
    message = "Congratulations! You've won a free prize. Click here to claim."
    response = client.post('/predict',
                           data=json.dumps({'message': message}),
                           content_type='application/json')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['prediction'] == 'SPAM'
    assert 'spam_probability' in data
    assert 'ham_probability' in data
    assert data['spam_probability'] > data['ham_probability']

def test_predict_endpoint_missing_message(client):
    '''Test /predict endpoint with missing 'message' field'''
    response = client.post('/predict',
                           data=json.dumps({}),
                           content_type='application/json')
    data = json.loads(response.data)

    assert response.status_code == 400
    assert 'error' in data
    assert data['error'] == "'message' field is required"

def test_predict_endpoint_non_json_request(client):
    '''Test /predict endpoint with a non-JSON request'''
    response = client.post('/predict',
                           data='some plain text',
                           content_type='text/plain')
    data = json.loads(response.data)

    assert response.status_code == 400
    assert 'error' in data
    assert data['error'] == "Request must be JSON"